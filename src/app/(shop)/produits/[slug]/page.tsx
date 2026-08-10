import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import TopNav from "@/components/TopNav"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductGallery from "@/components/product/ProductGallery"
import ProductDetailClient from "@/components/product/ProductDetailClient"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!slug) {
    notFound()
  }

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { 
      images: { orderBy: { sortOrder: 'asc' } }, 
      variants: true, 
      category: true 
    }
  })

  if (!product) {
    notFound()
  }

  const productClean = {
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    saleStartDate: product.saleStartDate ? product.saleStartDate.toISOString() : null,
    saleEndDate: product.saleEndDate ? product.saleEndDate.toISOString() : null,
    weight: product.weight ? Number(product.weight) : null,
    variants: product.variants.map(v => ({
      ...v,
      stock: v.stock
    }))
  }

  return (
    <>
      <TopNav />
      <Header />
      
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-6">
            <ProductGallery images={productClean.images} name={productClean.name} />
          </div>
          <div className="col-lg-6">
            <ProductDetailClient product={productClean} />
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
}