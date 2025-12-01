// app/api/media/upload/route.ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Get files (support both 'files' and 'images' for compatibility)
    let files = formData.getAll('images') as File[];
    if (files.length === 0) {
      files = formData.getAll('files') as File[];
    }
    
    const userId = formData.get('userId') as string;
    const displayId = formData.get('displayId') as string;
    const type = (formData.get('type') as string) || 'default';
    
    console.log('Upload request:', {
      filesCount: files.length,
      userId,
      displayId,
      type,
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

    if (!displayId) {
      return NextResponse.json(
        { error: 'Display ID is required' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error(`${file.name} is not an image file`);
      }

      // Generate unique filename with timestamp
      const timestamp = Date.now();
      // Structure: userId/displayId/type/timestamp-filename
      const filename = `${userId}/${displayId}/${type}/${timestamp}-${file.name}`;
      
      console.log('Uploading file:', filename);
      
      // Configure blob options
      const blobOptions: any = {
        access: 'public',
        addRandomSuffix: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      };
      
      const blob = await put(filename, file, blobOptions);
      
      console.log('Upload successful:', blob.url);
      
      return {
        url: blob.url,
        pathname: blob.pathname,
        downloadUrl: blob.downloadUrl,
        userId: userId,
        displayId: displayId,
        type: type,
      };
    });

    const uploadedBlobs = await Promise.all(uploadPromises);

    console.log(`Successfully uploaded ${uploadedBlobs.length} files`);

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

// Optional: Add DELETE endpoint to clean up images
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter required' },
        { status: 400 }
      );
    }

    // Import del from @vercel/blob
    const { del } = await import('@vercel/blob');
    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    console.log('Successfully deleted:', url);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}