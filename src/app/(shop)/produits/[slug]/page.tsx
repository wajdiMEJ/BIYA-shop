import { prisma } from '@/lib/db/prisma'
import TopNav from '@/components/TopNav'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetailClient from '@/components/product/ProductDetailClient'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: { 
      images: true, 
      category: true, 
      variants: true, 
      reviews: { include: { user: true } }
    },
  })

  if (!product) {
    return (
      <>
        <TopNav />
        <Header />
        <div className="container py-5 text-center">
          <h2 style={{ color: '#3E3125' }}>Produit non trouvé</h2>
        </div>
        <Footer />
      </>
    )
  }

  // ✅ Sérialisation complète (plus de Date, plus de Decimal)
  const serializedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    saleStartDate: product.saleStartDate ? product.saleStartDate.toISOString() : null,
    saleEndDate: product.saleEndDate ? product.saleEndDate.toISOString() : null,
    stock: product.stock,
    sku: product.sku,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    brand: product.brand,
    material: product.material,
    careInstructions: product.careInstructions,
    weight: product.weight ? Number(product.weight) : null,
    categoryId: product.categoryId,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    images: product.images.map(img => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    })),
    variants: product.variants.map(v => ({
      id: v.id,
      size: v.size,
      color: v.color,
      stock: v.stock,
      sku: v.sku,
      isActive: v.isActive,
    })),
    category: product.category ? {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    } : null,
    reviews: product.reviews.map(r => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    })),
  }

  return (
    <>
      <TopNav />
      <Header />
      <div className="container py-5">
        <ProductDetailClient product={serializedProduct} />
      </div>
      <Footer />
    </>
  )
}