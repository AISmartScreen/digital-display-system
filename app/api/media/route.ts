// app/api/media/route.ts
import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get userId from query params (optional - for filtering on server side)
    const { searchParams } = new URL(request.url);
    const filterUserId = searchParams.get('userId');

    const { blobs } = await list();
    
    const mediaItems = blobs.map((blob) => {
      const pathParts = blob.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];
      
      return {
        id: blob.pathname,
        fileName: fileName,
        fileType: blob.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "image" : "video",
        fileUrl: blob.url,
        fileSize: blob.size,
        uploadedAt: blob.uploadedAt,
        userId: pathParts[0] || '',
        displayId: pathParts[1] || '',
        type: pathParts[2] || ''
      };
    });

    // Filter by userId if provided - gets ALL images for that user regardless of display
    const filteredItems = filterUserId 
      ? mediaItems.filter(item => item.userId === filterUserId)
      : mediaItems;

    console.log(`Total blobs: ${mediaItems.length}, Filtered for user ${filterUserId}: ${filteredItems.length}`);

    return NextResponse.json(filteredItems);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}