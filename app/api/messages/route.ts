import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/utils/auth';
import { emailService } from '@/lib/utils/email';

// Create a new message (requires consumer authentication)
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to send messages.' },
        { status: 401 }
      );
    }

    // Only consumers can send messages
    if (auth.role !== 'CONSUMER') {
      return NextResponse.json(
        { error: 'Only consumer accounts can send messages to businesses.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { businessId, subject, message, phone } = body;

    if (!businessId || !subject || !message) {
      return NextResponse.json(
        { error: 'Business ID, subject, and message are required' },
        { status: 400 }
      );
    }

    // Verify business exists and get owner details
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: { owner: true }
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Get sender user details
    const user = await prisma.user.findUnique({
      where: { id: auth.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create message using Prisma
    const newMessage = await prisma.message.create({
      data: {
        businessId,
        userId: auth.userId,
        fromEmail: user.email,
        fromName: user.name,
        fromPhone: phone || null,
        subject,
        message,
        status: 'UNREAD',
      },
    });

    // Send email notification to business owner
    try {
      const businessEmail = business.email || business.owner?.email;
      
      if (businessEmail) {
        await emailService.sendBusinessMessageNotification({
          businessEmail,
          businessName: business.businessName,
          fromName: user.name,
          fromEmail: user.email,
          fromPhone: phone,
          subject,
          message,
          businessId: businessId,
        });
      }
    } catch (emailError: unknown) {
      const err = emailError instanceof Error ? emailError : new Error('Email error');
      console.error('Failed to send email notification:', err.message);
    }

    return NextResponse.json(
      {
        message: 'Message sent successfully',
        messageId: newMessage.id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Message creation error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get messages for a business (business owner only)
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    // Business owners can view messages for their businesses
    if (auth.role === 'BUSINESS_OWNER' && businessId) {
      const business = await prisma.business.findUnique({
        where: { id: businessId }
      });

      if (!business) {
        return NextResponse.json(
          { error: 'Business not found' },
          { status: 404 }
        );
      }

      // Check ownership (allow ADMIN and TRUST_TEAM to view any business messages)
      const isOwner = business.ownerId === auth.userId;
      const isAdmin = auth.role === ('ADMIN' as import('@prisma/client').Role) || 
                      auth.role === ('TRUST_TEAM' as import('@prisma/client').Role);
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const messages = await prisma.message.findMany({
        where: { businessId },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({ messages });
    }

    // Consumers can view their own messages
    if (auth.role === 'CONSUMER') {
      const messages = await prisma.message.findMany({
        where: { userId: auth.userId },
        include: {
          business: {
            select: {
              businessName: true,
              category: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({ messages });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Message fetch error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

