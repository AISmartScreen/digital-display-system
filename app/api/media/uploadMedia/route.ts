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
      formDataKeys: Array.from(formData.keys())
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
      const timestamp = Date.now();
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      
      // Include environment in folder path
      const folder = `${environment}/${userId}/${displayId}/${type}`;
      const publicId = `${timestamp}-${fileNameWithoutExt}`;
      
      console.log('Uploading file to folder:', folder, {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });
      
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;
      
      // Determine resource type based on file type
      const resourceType = file.type.startsWith('video/') ? 'video' : 'auto';
      
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: folder,
        public_id: publicId,
        resource_type: resourceType,
        overwrite: false,
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
        fileType: file.type.startsWith('video/') ? 'video' : 'image',
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    console.log(`Successfully uploaded ${uploadedFiles.length} files`);

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
    
    if (!publicId) {
      return NextResponse.json(
        { error: 'publicId parameter required' },
        { status: 400 }
      );
    }

    await cloudinary.uploader.destroy(publicId);

    console.log('Successfully deleted:', publicId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}