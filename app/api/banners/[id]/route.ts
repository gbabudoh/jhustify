import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Banner from '@/lib/models/Banner';
import { verifyToken } from '@/lib/utils/auth';

// GET - Get single banner
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const banner = await Banner.findById(params.id);

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json({ banner }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching banner:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch banner' }, { status: 500 });
  }
}

// PATCH - Update banner (Admin only)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, imageUrl, linkUrl, position, costPrice, startDate, endDate, isActive } = body;

    const banner = await Banner.findById(params.id);

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    // Update fields
    if (title !== undefined) banner.title = title;
    if (description !== undefined) banner.description = description;
    if (imageUrl !== undefined) banner.imageUrl = imageUrl;
    if (linkUrl !== undefined) banner.linkUrl = linkUrl;
    if (position !== undefined) banner.position = position;
    if (costPrice !== undefined) banner.costPrice = parseFloat(costPrice);
    if (startDate !== undefined) banner.startDate = new Date(startDate);
    if (endDate !== undefined) banner.endDate = new Date(endDate);
    if (isActive !== undefined) banner.isActive = isActive;

    // Validate dates if both are present
    if (banner.endDate <= banner.startDate) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    await banner.save();

    return NextResponse.json({ banner, message: 'Banner updated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: error.message || 'Failed to update banner' }, { status: 500 });
  }
}

// DELETE - Delete banner (Admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const banner = await Banner.findByIdAndDelete(params.id);

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Banner deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete banner' }, { status: 500 });
  }
}
