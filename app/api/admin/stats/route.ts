import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Business from '@/lib/models/Business';
import Verification from '@/lib/models/Verification';
import Message from '@/lib/models/Message';
import Rating from '@/lib/models/Rating';
import Subscription from '@/lib/models/Subscription';
import Banner from '@/lib/models/Banner';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (auth.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    await connectDB();

    const [users, businesses, verifications, messages, ratings, subscriptions, banners] = await Promise.all([
      User.countDocuments(),
      Business.countDocuments(),
      Verification.countDocuments(),
      Message.countDocuments(),
      Rating.countDocuments(),
      Subscription.countDocuments(),
      Banner.countDocuments(),
    ]);

    return NextResponse.json({
      users,
      businesses,
      verifications,
      messages,
      ratings,
      subscriptions,
      banners,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

