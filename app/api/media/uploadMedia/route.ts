// app/api/media/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Try both 'files' and 'images' keys for compatibility
    let files = formData.getAll('files') as File[];
    if (files.length === 0) {
      files = formData.getAll('images') as File[];
    }
    
    const userId = formData.get('id') as string;
    const environment = (formData.get('environment') as string) || 'preview';
    const imageId = (formData.get('imageId') as string) || 'default';
    
    console.log('Upload request:', {
      filesCount: files.length,
      userId,
      environment,
      imageId,
      formDataKeys: Array.from(formData.keys())
    });
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate environment
    if (environment !== 'preview' && environment !== 'production') {
      return NextResponse.json(
        { error: 'Environment must be either "preview" or "production"' },
        { status: 400 }
      );
    }

    // 1 day in seconds = 24 * 60 * 60 = 86400
    const ONE_DAY_IN_SECONDS = 86400;

    const uploadPromises = files.map(async (file) => {
      // Generate unique filename with timestamp
      const timestamp = Date.now();
      // Structure: userId/environment/imageId/timestamp-filename
      const filename = `${userId}/${environment}/${imageId}/${timestamp}-${file.name}`;
      
      // Configure blob options based on environment
      const blobOptions: any = {
        access: 'public',
        addRandomSuffix: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      };

      // Only add TTL for preview environment
      if (environment === 'preview') {
        blobOptions.cacheControlMaxAge = ONE_DAY_IN_SECONDS;
      }
      // Production has no TTL - stored forever
      
      const blob = await put(filename, file, blobOptions);
      
      return {
        url: blob.url,
        pathname: blob.pathname,
        downloadUrl: blob.downloadUrl,
        id: userId,
        environment: environment,
        imageId: imageId,
      };
    });

    const uploadedBlobs = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      urls: uploadedBlobs.map(blob => blob.url),
      blobs: uploadedBlobs,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}