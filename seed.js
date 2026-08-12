const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // 1. Créer les catégories
  const categories = await prisma.$transaction([
    prisma.category.upsert({ where: { slug: 'pull' }, update: {}, create: { name: 'Pull', slug: 'pull', isActive: true } }),
    prisma.category.upsert({ where: { slug: 'top' }, update: {}, create: { name: 'Top', slug: 'top', isActive: true } }),
    prisma.category.upsert({ where: { slug: 'pantalon' }, update: {}, create: { name: 'Pantalon', slug: 'pantalon', isActive: true } }),
    prisma.category.upsert({ where: { slug: 't-shirt' }, update: {}, create: { name: 'T-shirt', slug: 't-shirt', isActive: true } }),
    prisma.category.upsert({ where: { slug: 'veste' }, update: {}, create: { name: 'Veste', slug: 'veste', isActive: true } }),
    prisma.category.upsert({ where: { slug: 'sacs' }, update: {}, create: { name: 'Sacs', slug: 'sacs', isActive: true } }),
  ])
  console.log('✅ Catégories créées')

  // 2. Créer les produits
  const products = [
    { name: 'Pull MARAM', slug: 'pull-maram', description: 'Pull confortable', price: 45, stock: 10, sku: 'PULL-001', categoryId: categories[0].id, image: '/assets/img/shop_01.jpg' },
    { name: 'Top Élégance', slug: 'top-elegance', description: 'Top tendance', price: 35, stock: 15, sku: 'TOP-001', categoryId: categories[1].id, image: '/assets/img/shop_02.jpg' },
    { name: 'Pantalon Classic', slug: 'pantalon-classic', description: 'Pantalon droit', price: 55, stock: 8, sku: 'PANT-001', categoryId: categories[2].id, image: '/assets/img/shop_03.jpg' },
    { name: 'T-shirt BIYA', slug: 't-shirt-biya', description: 'T-shirt 100% coton', price: 25, stock: 20, sku: 'TS-001', categoryId: categories[3].id, image: '/assets/img/shop_04.jpg' },
    { name: 'Veste Premium', slug: 'veste-premium', description: 'Veste stylée', price: 75, stock: 5, sku: 'VEST-001', categoryId: categories[4].id, image: '/assets/img/shop_05.jpg' },
    { name: 'Sac à main', slug: 'sac-main', description: 'Sac élégant', price: 65, stock: 12, sku: 'SAC-001', categoryId: categories[5].id, image: '/assets/img/shop_06.jpg' },
  ]

  for (const p of products) {
    const { image, ...productData } = p
    await prisma.product.create({
      data: {
        ...productData,
        isActive: true,
        images: { create: { url: image, isPrimary: true, alt: p.name } },
        variants: {
          create: [
            { size: 'S', stock: Math.floor(p.stock / 3), color: 'Standard', sku: `${p.sku}-S` },
            { size: 'M', stock: Math.floor(p.stock / 3), color: 'Standard', sku: `${p.sku}-M` },
            { size: 'L', stock: Math.floor(p.stock / 3), color: 'Standard', sku: `${p.sku}-L` },
          ]
        }
      }
    })
    console.log(`✅ Produit: ${p.name}`)
  }
  console.log('🎉 Seed terminé !')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })