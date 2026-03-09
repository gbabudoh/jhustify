import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth || (auth.role !== 'ADMIN' && auth.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch recent events across different tables
    const [recentBusinesses, recentSubscriptions, recentUsers, recentVerifications] = await Promise.all([
      prisma.business.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { businessName: true, createdAt: true, city: true, country: true },
      }),
      prisma.subscription.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { business: { select: { businessName: true } } },
      }),
      prisma.user.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { name: true, createdAt: true, role: true },
      }),
      prisma.verification.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { business: { select: { businessName: true } } },
      }),
    ]);

    // Map to a unified activity format
    const activities = [
      ...recentBusinesses.map(b => ({
        type: 'BUSINESS',
        text: `New business: ${b.businessName}`,
        meta: `${b.city ? b.city + ', ' : ''}${b.country}`,
        time: b.createdAt,
      })),
      ...recentSubscriptions.map(s => ({
        type: 'SUBSCRIPTION',
        text: `Premium upgrade: ${s.business.businessName}`,
        meta: `${s.amount} ${s.currency}`,
        time: s.createdAt,
      })),
      ...recentUsers.map(u => ({
        type: 'USER',
        text: `New user: ${u.name}`,
        meta: u.role.replace('_', ' '),
        time: u.createdAt,
      })),
      ...recentVerifications.map(v => ({
        type: 'VERIFICATION',
        text: `Verification submitted: ${v.business.businessName}`,
        meta: v.status,
        time: v.createdAt,
      })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

    return NextResponse.json(activities);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
