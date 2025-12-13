// app/api/media/[id]/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const publicId = decodeURIComponent(id);
    
    console.log('Attempting to delete:', publicId);
    
    // Check if this is a video by looking at the path
    // Videos have /video/ in their path: environment/userId/displayId/type/video/filename
    const isVideo = publicId.includes('/video/');
    
    const resourceType = isVideo ? 'video' : 'image';
    
    console.log('Deleting as resource type:', resourceType);
    
    // Try to delete with the correct resource type
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      
      console.log('Delete result:', result);
      
      if (result.result === 'ok') {
        return NextResponse.json({
          success: true,
          message: 'File deleted successfully',
          resourceType: resourceType
        });
      } else if (result.result === 'not found') {
        // If not found with detected type, try the other type
        const alternateType = isVideo ? 'image' : 'video';
        console.log('Not found, trying alternate type:', alternateType);
        
        const alternateResult = await cloudinary.uploader.destroy(publicId, {
          resource_type: alternateType,
        });
        
        console.log('Alternate delete result:', alternateResult);
        
        if (alternateResult.result === 'ok') {
          return NextResponse.json({
            success: true,
            message: 'File deleted successfully',
            resourceType: alternateType
          });
        }
      }
      
      // If still not successful
      return NextResponse.json(
        { error: 'File not found or already deleted', result: result.result },
        { status: 404 }
      );
      
    } catch (deleteError) {
      console.error('Delete operation error:', deleteError);
      throw deleteError;
    }

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}