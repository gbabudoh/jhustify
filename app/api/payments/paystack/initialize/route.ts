import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/utils/auth';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { businessId, tier } = body;

    if (!businessId || !tier) {
      return NextResponse.json({ error: 'Business ID and Tier are required' }, { status: 400 });
    }

    // Verify business ownership
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business || business.ownerId !== auth.userId) {
      return NextResponse.json({ error: 'Business not found or unauthorized' }, { status: 404 });
    }

    // Define amounts based on tier (in kobo for NGN)
    // ₦1,200 -> 120,000 kobo
    const amount = 120000; 
    const email = auth.email;

    if (!PAYSTACK_SECRET_KEY) {
      console.error('PAYSTACK_SECRET_KEY is not defined');
      return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 });
    }

    // Initialize Paystack transaction
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/success?businessId=${businessId}&tier=${tier}`,
        metadata: {
          businessId,
          tier,
          userId: auth.userId,
        },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message || 'Failed to initialize transaction' }, { status: 400 });
    }

    return NextResponse.json({ 
      authorization_url: data.data.authorization_url,
      reference: data.data.reference 
    });
  } catch (error: unknown) {
    console.error('Paystack initialization error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
