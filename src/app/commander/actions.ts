'use server'

import { prisma } from "@/lib/db/prisma"
import { revalidatePath } from "next/cache"
import { sendAdminOrderNotification, sendCustomerConfirmation } from "@/lib/email"

const DEFAULT_SHIPPING_METHOD_ID = "9d679c0b-947e-40fe-87da-a5c3d415c44c"

interface OrderData {
  email: string
  firstName: string
  lastName: string
  address: string
  apartment?: string
  city: string
  postalCode?: string
  phone: string
  country: string
  shippingCost: number
  total: number
  billingAddress: any
  items: {
    productId: string
    name: string
    size: string
    quantity: number
    price: number
    image: string
  }[]
}

export async function createOrder(data: OrderData) {
  try {
    const orderNumber = `BIYA-${Date.now().toString(36).toUpperCase().slice(-6)}`
    const subtotal = data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const order = await (prisma.order.create as any)({
      data: {
        orderNumber,
        email: data.email,
        shippingCost: data.shippingCost,
        subtotal: subtotal,
        total: data.total,
        status: "PENDING",
        paymentStatus: "PENDING",
        shippingMethodId: DEFAULT_SHIPPING_METHOD_ID,
        shippingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode || null,
          phone: data.phone,
          country: data.country,
        },
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            size: item.size,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: item.price * item.quantity,
          }))
        }
      }
    })

    // Mettre à jour le stock
    for (const item of data.items) {
      const variant = await prisma.productVariant.findFirst({
        where: { productId: item.productId, size: item.size }
      })
      if (variant) {
        await prisma.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } }
        })
      }
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      })
    }

    // 📧 Préparer les données email
    const emailData = {
      ...data,
      orderId: order.id,
      orderNumber,
      shippingCost: data.shippingCost,
      total: data.total,
      items: data.items,
    }

    // ✅ Envoyer séparément (si admin plante, client reçoit quand même)
    await sendAdminOrderNotification(emailData)
    await sendCustomerConfirmation(emailData)

    revalidatePath('/commander')
    return { success: true, orderId: order.id, orderNumber }
  } catch (error) {
    console.error('Erreur création commande:', error)
    return { success: false, error: 'Erreur lors de la création de la commande' }
  }
}