// app/api/media/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterUserId = searchParams.get('userId');
    const filterType = searchParams.get('type');
    const filterFileType = searchParams.get('fileType'); // 'image' or 'video'

    console.log('Fetching media with filters:', {
      userId: filterUserId,
      type: filterType,
      fileType: filterFileType
    });

    // Get both images and videos from Cloudinary
    const [imageResult, videoResult] = await Promise.all([
      cloudinary.api.resources({
        type: 'upload',
        max_results: 500,
        resource_type: 'image',
      }).catch(error => {
        console.error('Error fetching images:', error);
        return { resources: [] };
      }),
      cloudinary.api.resources({
        type: 'upload',
        max_results: 500,
        resource_type: 'video',
      }).catch(error => {
        console.error('Error fetching videos:', error);
        return { resources: [] };
      })
    ]);
    
    // Combine images and videos
    const allResources = [
      ...(imageResult.resources || []).map((resource: any) => ({
        ...resource,
        resource_type: 'image',
        fileType: 'image'
      })),
      ...(videoResult.resources || []).map((resource: any) => ({
        ...resource,
        resource_type: 'video', 
        fileType: 'video'
      }))
    ];

    console.log(`Fetched ${allResources.length} total resources (${imageResult.resources?.length || 0} images, ${videoResult.resources?.length || 0} videos)`);

    const mediaItems = allResources.map((resource: any) => {
      const pathParts = resource.public_id.split('/');
      const fileName = pathParts[pathParts.length - 1];
      
      return {
        id: resource.public_id,
        fileName: fileName,
        fileType: resource.fileType, // 'image' or 'video'
        fileUrl: resource.secure_url,
        fileSize: resource.bytes,
        uploadedAt: resource.created_at,
        userId: pathParts[0] || '',
        displayId: pathParts[1] || '',
        type: pathParts[2] || '',
        format: resource.format,
        width: resource.width,
        height: resource.height,
        duration: resource.duration,
        resourceType: resource.resource_type
      };
    });

    // Apply filters
    let filteredItems = mediaItems;
    
    if (filterUserId) {
      filteredItems = filteredItems.filter(item => item.userId === filterUserId);
    }
    
    if (filterType) {
      filteredItems = filteredItems.filter(item => item.type === filterType);
    }
    
    if (filterFileType) {
      filteredItems = filteredItems.filter(item => item.fileType === filterFileType);
    }

    console.log(`Total resources: ${mediaItems.length}, Filtered: ${filteredItems.length}`);

    return NextResponse.json(filteredItems);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}