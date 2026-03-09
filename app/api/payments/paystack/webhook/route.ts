import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!PAYSTACK_SECRET_KEY) {
      console.error('PAYSTACK_SECRET_KEY is not defined');
      return NextResponse.json({ error: 'Config error' }, { status: 500 });
    }

    // Verify signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const { metadata, reference, amount, currency, id } = event.data;
      const { businessId, tier } = metadata;

      // Update business and create/update subscription
      // We use upsert to handle case where verification might have already happened
      await prisma.business.update({
        where: { id: businessId },
        data: {
          verificationTier: tier === 'PREMIUM' ? 'PREMIUM' : 'VERIFIED',
          trustBadgeActive: true,
          trustBadgeType: tier === 'PREMIUM' ? 'VERIFIED' : 'VERIFIED',
          subscription: {
            upsert: {
              create: {
                tier: tier === 'PREMIUM' ? 'PREMIUM' : 'VERIFIED',
                status: 'ACTIVE',
                amount: amount / 100,
                currency,
                paymentGateway: 'PAYSTACK',
                paymentGatewaySubscriptionId: id.toString(),
                lastPaymentDate: new Date(),
                currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                nextBillingDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              },
              update: {
                tier: tier === 'PREMIUM' ? 'PREMIUM' : 'VERIFIED',
                status: 'ACTIVE',
                amount: amount / 100,
                lastPaymentDate: new Date(),
                currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                nextBillingDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      });

      console.log(`Payment successful for business ${businessId} (Reference: ${reference})`);
    }

    return new Response('OK', { status: 200 });
  } catch (error: unknown) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
