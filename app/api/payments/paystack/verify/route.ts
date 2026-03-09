import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/utils/auth';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 });
    }

    if (!PAYSTACK_SECRET_KEY) {
      console.error('PAYSTACK_SECRET_KEY is not defined');
      return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 });
    }

    // Verify transaction with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();

    if (!data.status || data.data.status !== 'success') {
      return NextResponse.json({ error: data.message || 'Payment verification failed' }, { status: 400 });
    }

    const { businessId, tier } = data.data.metadata;

    // Update business and create subscription
    const business = await prisma.business.update({
      where: { id: businessId },
      data: {
        verificationTier: tier === 'PREMIUM' ? 'PREMIUM' : 'VERIFIED',
        trustBadgeActive: true,
        trustBadgeType: tier === 'PREMIUM' ? 'VERIFIED' : 'VERIFIED', // Need to check TrustBadgeType enum
        subscription: {
          upsert: {
            create: {
              tier: tier === 'PREMIUM' ? 'PREMIUM' : 'VERIFIED',
              status: 'ACTIVE',
              amount: data.data.amount / 100,
              currency: data.data.currency,
              paymentGateway: 'PAYSTACK',
              paymentGatewaySubscriptionId: data.data.id.toString(),
              lastPaymentDate: new Date(),
              currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
              nextBillingDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            },
            update: {
              tier: tier === 'PREMIUM' ? 'PREMIUM' : 'VERIFIED',
              status: 'ACTIVE',
              amount: data.data.amount / 100,
              lastPaymentDate: new Date(),
              currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              nextBillingDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Payment verified and account upgraded',
      business 
    });
  } catch (error: unknown) {
    console.error('Paystack verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
