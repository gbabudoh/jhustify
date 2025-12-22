import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Message from '@/lib/models/Message';
import Business from '@/lib/models/Business';
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

    await connectDB();

    const body = await request.json();
    const { businessId, subject, message, phone } = body;

    if (!businessId || !subject || !message) {
      return NextResponse.json(
        { error: 'Business ID, subject, and message are required' },
        { status: 400 }
      );
    }

    // Verify business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Get user details for message
    const User = (await import('@/lib/models/User')).default;
    const user = await User.findById(auth.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create message
    const newMessage = new Message({
      businessId,
      userId: auth.userId,
      fromEmail: user.email,
      fromName: user.name,
      fromPhone: phone || undefined,
      subject,
      message,
      status: 'UNREAD',
    });

    await newMessage.save();

    // Send email notification to business owner
    try {
      // Get business owner email
      const businessOwner = await User.findById(business.ownerId);
      const businessEmail = business.email || businessOwner?.email;
      
      if (businessEmail) {
        await emailService.sendBusinessMessageNotification({
          businessEmail,
          businessName: business.businessName,
          fromName: user.name,
          fromEmail: user.email,
          fromPhone: phone,
          subject,
          message,
          businessId: businessId.toString(),
        });
      }
    } catch (emailError: any) {
      // Don't fail the request if email fails, just log it
      console.error('Failed to send email notification:', emailError);
    }

    return NextResponse.json(
      {
        message: 'Message sent successfully',
        messageId: newMessage._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Message creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
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

    await connectDB();

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    // Business owners can view messages for their businesses
    if (auth.role === 'BUSINESS_OWNER' && businessId) {
      const business = await Business.findById(businessId);
      if (!business) {
        return NextResponse.json(
          { error: 'Business not found' },
          { status: 404 }
        );
      }

      // Check ownership (allow ADMIN and TRUST_TEAM to view any business messages)
      const isOwner = business.ownerId.toString() === auth.userId;
      const userRole = auth.role as string;
      const isAdmin = userRole === 'ADMIN' || userRole === 'TRUST_TEAM';
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const messages = await Message.find({ businessId })
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({ messages });
    }

    // Consumers can view their own messages
    if (auth.role === 'CONSUMER') {
      const messages = await Message.find({ userId: auth.userId })
        .populate('businessId', 'businessName category')
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({ messages });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error: any) {
    console.error('Message fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

