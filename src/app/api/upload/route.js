import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // Verify admin authentication
    const auth = verifyAdminToken(req);
    if (!auth.valid) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (10MB limit for Cloudinary)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        ok: false, 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'foodjoint/menu', // Organize images in a folder
          resource_type: 'image',
          transformation: [
            { width: 800, height: 600, crop: 'limit' }, // Resize large images
            { quality: 'auto:good' }, // Optimize quality
            { fetch_format: 'auto' }, // Automatic format selection (WebP when supported)
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(buffer);
    });

    // Return the Cloudinary URL
    const url = uploadResult.secure_url;

    return NextResponse.json({ ok: true, url });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to upload file: ' + error.message 
    }, { status: 500 });
  }
}
