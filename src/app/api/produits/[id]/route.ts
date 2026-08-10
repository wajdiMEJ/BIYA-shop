import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"

// GET /api/produits/123 → Détail d'un produit
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { images: true, variants: true, category: true, reviews: true }
    })

    if (!product) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Erreur chargement produit" }, { status: 500 })
  }
}

// PUT /api/produits/123 → Modifier un produit
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        stock: body.stock,
        sku: body.sku,
        categoryId: body.categoryId,
        isActive: body.isActive,
      },
      include: { images: true, category: true }
    })

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Erreur modification produit" }, { status: 500 })
  }
}

// DELETE /api/produits/123 → Supprimer un produit
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.productImage.deleteMany({
      where: { productId: params.id }
    })

    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Produit supprimé" })
  } catch (error) {
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 })
  }
}