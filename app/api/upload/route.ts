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
    const file = formData.get('file') as File | null;

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

    // Import MinIO upload utility
    const { uploadFileToMinio } = await import('@/lib/storage/minio');

    try {
      const fileUrl = await uploadFileToMinio(file, file.name, file.type);

      return NextResponse.json(
        {
          url: fileUrl,
          filename: file.name,
          size: file.size,
          type: file.type,
          message: 'File uploaded successfully to storage',
        },
        { status: 200 }
      );
    } catch (uploadError: unknown) {
      console.error('MinIO storage error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload to permanent storage' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'File upload not configured for production' },
      { status: 500 }
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error');
    console.error('File upload error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}

