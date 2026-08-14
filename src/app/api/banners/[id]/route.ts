import { prisma } from '@/lib/db/prisma'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.banner.delete({ where: { id } })

    // ✅ REVALIDER l'accueil et l'admin
    revalidatePath('/')
    revalidatePath('/admin/banners')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })
  }
}