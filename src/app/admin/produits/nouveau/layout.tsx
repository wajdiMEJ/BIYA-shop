import { prisma } from '@/lib/db/prisma'
import NewProductPage from './page'

export default async function Layout() {
  const categories = await prisma.category.findMany()
  return <NewProductPage categories={categories} />
}