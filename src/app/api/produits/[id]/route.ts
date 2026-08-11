import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"

// GET /api/produits/123 → Détail d'un produit
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
        category: true,
        reviews: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Erreur GET produit :", error)

    return NextResponse.json(
      { error: "Erreur chargement produit" },
      { status: 500 }
    )
  }
}

// PUT /api/produits/123 → Modifier un produit
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const product = await prisma.product.update({
      where: { id },
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
      include: {
        images: true,
        category: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Erreur PUT produit :", error)

    return NextResponse.json(
      { error: "Erreur modification produit" },
      { status: 500 }
    )
  }
}

// DELETE /api/produits/123 → Supprimer un produit
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Supprimer les images liées au produit
    await prisma.productImage.deleteMany({
      where: { productId: id },
    })

    // Supprimer le produit
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({
      message: "Produit supprimé",
    })
  } catch (error) {
    console.error("Erreur DELETE produit :", error)

    return NextResponse.json(
      { error: "Erreur suppression" },
      { status: 500 }
    )
  }
}