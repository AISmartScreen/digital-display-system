// app/api/media/uploadMedia/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Check for files in multiple possible field names
    let files = formData.getAll('files') as File[];
    if (files.length === 0) {
      files = formData.getAll('images') as File[];
    }
    if (files.length === 0) {
      files = formData.getAll('file') as File[];
    }
    
    const userId = formData.get('userId') as string;
    const displayId = formData.get('displayId') as string;
    const type = (formData.get('type') as string) || 'default';
    const environment = formData.get('environment') as string || 'preview';
    
    console.log('Upload request:', {
      filesCount: files.length,
      userId,
      displayId,
      type,
      environment,
      formDataKeys: Array.from(formData.keys()),
      fileTypes: files.map(f => f.type)
    });
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided. Please check that files are being sent correctly.' },
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
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      // Validate file type
      if (!isVideo && !isImage) {
        throw new Error(`${file.name} is not a valid image or video file`);
      }

      const timestamp = Date.now();
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      
      // Build folder structure with /video subfolder for videos
      // Format: environment/userId/displayId/type OR environment/userId/displayId/type/video
      let folder = `${environment}/${userId}/${displayId}/${type}`;
      if (isVideo) {
        folder = `${folder}/video`;
      }
      
      const publicId = `${timestamp}-${fileNameWithoutExt}`;
      
      console.log('Uploading file:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        isVideo,
        isImage,
        folder,
        publicId
      });
      
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;
      
      // Upload to Cloudinary with appropriate resource type
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: folder,
        public_id: publicId,
        resource_type: isVideo ? 'video' : 'image',
        overwrite: false,
        // For videos, add chunk upload support
        ...(isVideo && {
          chunk_size: 6000000, // 6MB chunks for large videos
        }),
      });
      
      console.log('Upload successful:', {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        format: result.format
      });
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        userId: userId,
        displayId: displayId,
        type: type,
        environment: environment,
        fileType: isVideo ? 'video' : 'image',
        resourceType: result.resource_type,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    console.log(`Successfully uploaded ${uploadedFiles.length} file(s):`,
      uploadedFiles.map(f => ({ url: f.url, type: f.fileType }))
    );

    return NextResponse.json({
      success: true,
      urls: uploadedFiles.map(file => file.url),
      blobs: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');
    const resourceType = searchParams.get('resourceType') as 'image' | 'video' | undefined;
    
    if (!publicId) {
      return NextResponse.json(
        { error: 'publicId parameter required' },
        { status: 400 }
      );
    }

    // Delete with appropriate resource type
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || 'image',
    });

    console.log('Successfully deleted:', publicId, 'type:', resourceType || 'image');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}