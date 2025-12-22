import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/utils/auth';

/**
 * POST /api/upload
 * Handle file uploads (photos, documents)
 * 
 * For production, integrate with S3/GCS/Cloudinary
 * For development, converts to base64 data URLs
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Validate file type (more flexible for different browsers)
    const allowedMimeTypes = [
      'image/jpeg', 
      'image/png', 
      'image/jpg', 
      'image/webp',
      'image/gif',
      'application/pdf', 
      'video/mp4', 
      'video/quicktime',
      'video/x-msvideo' // AVI
    ];
    
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf', '.mp4', '.mov', '.avi'];
    const fileExtension = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
    
    if (!allowedMimeTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: images (JPEG, PNG, WebP, GIF), PDF, or MP4 video. Received: ${file.type || fileExtension}` },
        { status: 400 }
      );
    }

    // For development: Convert to base64 data URL
    // For production: Upload to S3/GCS/Cloudinary and return URL
    if (process.env.NODE_ENV === 'development' || !process.env.S3_BUCKET_NAME) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;

      return NextResponse.json(
        {
          url: dataUrl,
          filename: file.name,
          size: file.size,
          type: file.type,
          message: 'File uploaded (base64 - development mode)',
        },
        { status: 200 }
      );
    }

    // Production: Upload to S3/GCS/Cloudinary
    // TODO: Implement S3/GCS upload here
    // Example:
    // const uploadResult = await uploadToS3(file, fileType);
    // return NextResponse.json({ url: uploadResult.url, ... });

    return NextResponse.json(
      { error: 'File upload not configured for production' },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}

