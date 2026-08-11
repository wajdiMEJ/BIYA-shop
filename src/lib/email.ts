import { Resend } from 'resend'
import nodemailer from 'nodemailer'

const resend = new Resend(process.env.RESEND_API_KEY)

// Gmail pour l'admin
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const cleanEnv = (val?: string) => (val || '').replace(/^["']|["']$/g, '').trim()

const EMAIL_FROM = cleanEnv(process.env.EMAIL_FROM) || 'onboarding@resend.dev'
const ADMIN_EMAIL = cleanEnv(process.env.ADMIN_EMAIL)

interface OrderItem {
  name: string
  size: string
  quantity: number
  price: number
}

interface OrderData {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode?: string
  phone: string
  country: string
  total: number
  shippingCost: number
  items: OrderItem[]
  orderNumber: string
}

function adminEmailTemplate(data: OrderData) {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #D8CBB8;">${item.name}</td>
      <td style="padding:10px;border-bottom:1px solid #D8CBB8;text-align:center;">${item.size}</td>
      <td style="padding:10px;border-bottom:1px solid #D8CBB8;text-align:center;">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #D8CBB8;text-align:right;">${(item.price * item.quantity).toFixed(3)} DT</td>
    </tr>
  `).join('')

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#F8F5EF;border-radius:16px;overflow:hidden;border:1px solid #D8CBB8;">
      <div style="background:#3E3125;padding:24px;text-align:center;">
        <h1 style="color:#F8F5EF;margin:0;font-size:22px;">🛒 Nouvelle Commande BIYA</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#3E3125;font-size:16px;">Coordonnées du client</h2>
        <table style="width:100%;font-size:14px;color:#3E3125;line-height:2;">
          <tr><td><strong>Nom :</strong></td><td>${data.firstName} ${data.lastName}</td></tr>
          <tr><td><strong>Email :</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td><strong>Téléphone :</strong></td><td>${data.phone}</td></tr>
          <tr><td><strong>Adresse :</strong></td><td>${data.address}, ${data.city} ${data.postalCode || ''}</td></tr>
          <tr><td><strong>Gouvernorat :</strong></td><td>${data.country}</td></tr>
        </table>
        <h2 style="color:#3E3125;font-size:16px;margin-top:20px;">Détails de la commande</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#3E3125;">
          <thead><tr style="background:#EEE6D8;">
            <th style="padding:10px;text-align:left;">Produit</th>
            <th style="padding:10px;text-align:center;">Taille</th>
            <th style="padding:10px;text-align:center;">Qté</th>
            <th style="padding:10px;text-align:right;">Total</th>
          </tr></thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <div style="border-top:2px solid #D8CBB8;padding-top:12px;text-align:right;margin-top:12px;">
          <div style="color:#6F4E37;">Livraison : <strong>${data.shippingCost.toFixed(3)} DT</strong></div>
          <div style="font-size:18px;color:#3E3125;margin-top:8px;"><strong>Total : ${data.total.toFixed(3)} DT</strong></div>
        </div>
      </div>
      <div style="background:#3E3125;padding:16px;text-align:center;">
        <p style="color:#B8895A;margin:0;font-size:12px;">Commande n° ${data.orderNumber} | BIYA Shop</p>
      </div>
    </div>
  `
}

function customerEmailTemplate(data: OrderData) {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #D8CBB8;">
        <div style="font-weight:bold;color:#3E3125;">${item.name}</div>
        <div style="font-size:13px;color:#6F4E37;">Taille : ${item.size}</div>
      </td>
      <td style="padding:12px;border-bottom:1px solid #D8CBB8;text-align:center;color:#3E3125;">x${item.quantity}</td>
      <td style="padding:12px;border-bottom:1px solid #D8CBB8;text-align:right;color:#3E3125;font-weight:bold;">${(item.price * item.quantity).toFixed(3)} DT</td>
    </tr>
  `).join('')

  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#F8F5EF;border-radius:20px;overflow:hidden;border:1px solid #D8CBB8;">
      <div style="background:#3E3125;padding:32px 24px;text-align:center;">
        <h1 style="color:#F8F5EF;margin:0;font-size:26px;letter-spacing:2px;">BIYA</h1>
        <p style="color:#B8895A;margin:8px 0 0;font-size:14px;">Boutique de Mode</p>
      </div>
      <div style="padding:32px 24px;text-align:center;">
        <div style="font-size:48px;margin-bottom:12px;">🎉</div>
        <h2 style="color:#3E3125;margin:0 0 8px;font-size:22px;">Merci pour votre commande !</h2>
        <p style="color:#6F4E37;margin:0;font-size:15px;">
          Bonjour <strong>${data.firstName || data.lastName}</strong>,<br>
          Votre commande <strong>${data.orderNumber}</strong> est confirmée.
        </p>
      </div>
      <div style="padding:0 24px 24px;">
        <div style="background:#fff;border-radius:12px;padding:20px;border:1px solid #D8CBB8;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="border-top:2px solid #D8CBB8;margin-top:12px;padding-top:16px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;color:#6F4E37;font-size:14px;">
              <span>Sous-total</span><span>${(data.total - data.shippingCost).toFixed(3)} DT</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;color:#6F4E37;font-size:14px;">
              <span>Livraison</span><span>${data.shippingCost.toFixed(3)} DT</span>
            </div>
            <div style="display:flex;justify-content:space-between;color:#3E3125;font-size:18px;font-weight:bold;margin-top:8px;">
              <span>Total</span><span>${data.total.toFixed(3)} DT</span>
            </div>
          </div>
        </div>
        <div style="background:#F0EDE8;border-radius:12px;padding:16px;margin-top:16px;">
          <p style="color:#3E3125;margin:0 0 4px;font-size:14px;font-weight:bold;">Adresse de livraison</p>
          <p style="color:#6F4E37;margin:0;font-size:14px;line-height:1.6;">
            ${data.firstName} ${data.lastName}<br>
            ${data.address}<br>
            ${data.city}${data.postalCode ? ' ' + data.postalCode : ''}<br>
            ${data.country}<br>
            📞 ${data.phone}
          </p>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <p style="color:#6F4E37;font-size:13px;">
            Vous paierez <strong style="color:#3E3125;">${data.total.toFixed(3)} DT</strong> à la livraison.<br>
            Notre équipe vous contactera pour confirmer.
          </p>
        </div>
      </div>
      <div style="background:#3E3125;padding:20px;text-align:center;">
        <p style="color:#F8F5EF;margin:0 0 8px;font-size:14px;">Merci de votre confiance</p>
        <p style="color:#B8895A;margin:0;font-size:12px;">BIYA Shop</p>
      </div>
    </div>
  `
}

function newProductEmailTemplate(productName: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#F8F5EF;border-radius:20px;overflow:hidden;border:1px solid #D8CBB8;">
      <div style="background:#3E3125;padding:32px 24px;text-align:center;">
        <h1 style="color:#F8F5EF;margin:0;font-size:26px;letter-spacing:2px;">BIYA</h1>
        <p style="color:#B8895A;margin:8px 0 0;font-size:14px;">Boutique de Mode</p>
      </div>
      <div style="padding:32px 24px;text-align:center;">
        <div style="font-size:48px;margin-bottom:12px;">✨</div>
        <h2 style="color:#3E3125;margin:0 0 8px;font-size:22px;">Nouvelle arrivée !</h2>
        <p style="color:#6F4E37;margin:0;font-size:15px;line-height:1.6;">
          Bonjour,<br><br>
          Un nouveau produit vient d'arriver dans notre boutique :
        </p>
        <div style="background:#fff;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #D8CBB8;">
          <h3 style="color:#3E3125;margin:0;font-size:20px;">${productName}</h3>
          <p style="color:#6F4E37;margin:8px 0 0;font-size:14px;">Découvrez-le dès maintenant !</p>
        </div>
        <a href="https://biya-shop.vercel.app/produits" style="display:inline-block;background:#6F4E37;color:#F8F5EF;padding:14px 32px;border-radius:50;text-decoration:none;font-weight:bold;font-size:15px;margin-top:8px;">
          Voir le produit →
        </a>
      </div>
      <div style="background:#3E3125;padding:20px;text-align:center;">
        <p style="color:#F8F5EF;margin:0 0 8px;font-size:14px;">Merci de votre fidélité</p>
        <p style="color:#B8895A;margin:0;font-size:12px;">BIYA Shop</p>
      </div>
    </div>
  `
}

// ✅ ADMIN : Gmail
export async function sendAdminOrderNotification(data: OrderData) {
  try {
    console.log('📧 [ADMIN Gmail] Envoi à:', ADMIN_EMAIL)
    await gmailTransporter.sendMail({
      from: `"BIYA Shop" <${process.env.EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `🛒 Nouvelle commande ${data.orderNumber}`,
      html: adminEmailTemplate(data),
    })
    console.log('✅ [ADMIN Gmail] Email envoyé')
  } catch (error: any) {
    console.error('❌ [ADMIN Gmail] Erreur:', error?.message || error)
  }
}

// ✅ CLIENT : Resend
export async function sendCustomerConfirmation(data: OrderData) {
  try {
    console.log('📧 [CLIENT Resend] Envoi à:', data.email)
    const result = await resend.emails.send({
      from: `BIYA Shop <${EMAIL_FROM}>`,
      to: data.email,
      replyTo: ADMIN_EMAIL,
      subject: `Votre commande ${data.orderNumber} est confirmée`,
      html: customerEmailTemplate(data),
    })
    console.log('✅ [CLIENT Resend] Email envoyé:', result)
  } catch (error: any) {
    console.error('❌ [CLIENT Resend] Erreur:', error?.message || error)
  }
}

// ✅ NOTIFICATION NOUVEAU PRODUIT (pour l'API)
export async function notifyNewProduct(email: string, productName: string) {
  try {
    await resend.emails.send({
      from: `BIYA Shop <${EMAIL_FROM}>`,
      to: email,
      subject: `✨ Nouveau produit chez BIYA : ${productName}`,
      html: newProductEmailTemplate(productName),
    })
  } catch (error: any) {
    console.error('❌ [Notify] Erreur:', error?.message || error)
  }
}