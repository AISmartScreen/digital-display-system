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
      // Parse folder structure based on resource type
      // Images: environment/userId/displayId/type/filename
      // Videos: environment/userId/displayId/type/video/filename
      const pathParts = resource.public_id.split('/');
      const fileName = pathParts[pathParts.length - 1];
      
      let environment = '';
      let userId = '';
      let displayId = '';
      let actualType = '';
      let hasVideoFolder = false;
      
      // Determine if this is a video based on the resource_type
      const isVideo = resource.resource_type === 'video';
      
      if (isVideo) {
        // Video path: environment/userId/displayId/type/video/filename
        if (pathParts.length >= 6 && pathParts[4] === 'video') {
          // New format with environment and /video folder
          environment = pathParts[0] || '';
          userId = pathParts[1] || '';
          displayId = pathParts[2] || '';
          actualType = pathParts[3] || '';
          hasVideoFolder = true;
        } else if (pathParts.length === 5 && pathParts[3] === 'video') {
          // Legacy format without environment: userId/displayId/type/video/filename
          userId = pathParts[0] || '';
          displayId = pathParts[1] || '';
          actualType = pathParts[2] || '';
          hasVideoFolder = true;
        } else if (pathParts.length >= 4) {
          // Old video format without /video folder
          environment = pathParts[0] || '';
          userId = pathParts[1] || '';
          displayId = pathParts[2] || '';
          actualType = pathParts[3] || '';
        }
      } else {
        // Image path: environment/userId/displayId/type/filename
        if (pathParts.length >= 5) {
          // New format with environment
          environment = pathParts[0] || '';
          userId = pathParts[1] || '';
          displayId = pathParts[2] || '';
          actualType = pathParts[3] || '';
        } else if (pathParts.length === 4) {
          // Legacy format without environment: userId/displayId/type/filename
          userId = pathParts[0] || '';
          displayId = pathParts[1] || '';
          actualType = pathParts[2] || '';
        } else if (pathParts.length === 3) {
          // Very old format: userId/displayId/filename
          userId = pathParts[0] || '';
          displayId = pathParts[1] || '';
        }
      }
      
      return {
        id: resource.public_id,
        fileName: fileName,
        fileType: resource.fileType, // 'image' or 'video' from resource_type
        fileUrl: resource.secure_url,
        fileSize: resource.bytes,
        uploadedAt: resource.created_at,
        environment: environment,
        userId: userId,
        displayId: displayId,
        type: actualType,
        format: resource.format,
        width: resource.width,
        height: resource.height,
        duration: resource.duration,
        resourceType: resource.resource_type,
        hasVideoFolder: hasVideoFolder,
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
    console.log('Sample items:', filteredItems.slice(0, 3).map(i => ({ 
      id: i.id, 
      type: i.fileType, 
      userId: i.userId,
      displayId: i.displayId,
      contentType: i.type 
    })));

    return NextResponse.json(filteredItems);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}