import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth || (auth.role !== 'ADMIN' && auth.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('verificationStatus');
    const tier = searchParams.get('verificationTier');
    const type = searchParams.get('businessType');
    const search = searchParams.get('search');

    const where: import('@prisma/client').Prisma.BusinessWhereInput & { businessType?: string } = {};
    if (status) {
      where.verificationStatus = status as import('@prisma/client').VerificationStatus;
    }
    if (tier) {
      where.verificationTier = tier as import('@prisma/client').VerificationTier;
    }
    if (type) {
      where.businessType = type;
    }
    if (search) {
      where.OR = [
        { businessName: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;
    
    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        include: {
          owner: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.business.count({ where })
    ]);

    return NextResponse.json({
      businesses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Admin businesses fetch error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth || (auth.role !== 'ADMIN' && auth.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const { businessId, businessDescription, offeredItems, businessType, ...updates } = body;

    if (!businessId || typeof businessId !== 'string') {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    const updateData: import('@prisma/client').Prisma.BusinessUpdateInput & { 
      businessDescription?: string | null;
      offeredItems?: import('@prisma/client').Prisma.InputJsonValue;
      businessType?: string;
    } = { ...updates as Record<string, unknown> };

    if (businessDescription !== undefined) updateData.businessDescription = businessDescription as string;
    if (offeredItems !== undefined) updateData.offeredItems = offeredItems as import('@prisma/client').Prisma.InputJsonValue;
    if (businessType !== undefined) updateData.businessType = businessType as string;

    const business = await prisma.business.update({
      where: { id: businessId },
      data: updateData,
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({
      business,
      message: 'Business updated successfully',
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Admin business update error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth || (auth.role !== 'ADMIN' && auth.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    await prisma.business.delete({
      where: { id: businessId }
    });

    return NextResponse.json({ message: 'Business deleted successfully' });
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('Admin business delete error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

