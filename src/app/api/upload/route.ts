import { NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUri = `data:${file.type || 'image/jpeg'};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'biya-shop/products',
      public_id: `${Date.now()}-${file.name.replace(/\s/g, '-').replace(/\.[^/.]+$/, '')}`,
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}