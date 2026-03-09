import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
});

const bucketName = process.env.MINIO_BUCKET || 'jhustify';
const publicUrl = process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;

/**
 * Initializes the bucket if it doesn't exist and sets policy to public read
 */
export async function initMinio() {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName);
      console.log(`Bucket '${bucketName}' created successfully.`);
      
      // Set public read policy
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetBucketLocation', 's3:ListBucket'],
            Resource: [`arn:aws:s3:::${bucketName}`],
          },
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
          },
        ],
      };
      await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
      console.log(`Public read policy set for bucket '${bucketName}'.`);
    }
  } catch (error) {
    console.error('Error initializing MinIO:', error);
  }
}

/**
 * Uploads a file to MinIO and returns the public URL
 */
export async function uploadFileToMinio(file: File | Buffer, fileName: string, mimeType: string) {
  try {
    // Ensure bucket exists
    await initMinio();

    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/\s+/g, '-').toLowerCase();
    const objectName = `${timestamp}-${sanitizedFileName}`;

    let buffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = file;
    }

    await minioClient.putObject(bucketName, objectName, buffer, buffer.length, {
      'Content-Type': mimeType,
    });

    return `${publicUrl}/${bucketName}/${objectName}`;
  } catch (error) {
    console.error('MinIO Upload Error:', error);
    throw new Error('Failed to upload file to storage');
  }
}

export default minioClient;
