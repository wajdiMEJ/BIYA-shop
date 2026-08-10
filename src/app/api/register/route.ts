import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"

// 🛡️ RATE LIMITING : max 5 inscriptions par IP toutes les 15 minutes
const rateLimit = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 5

  const record = rateLimit.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

// 🛡️ VALIDATION ZOD : empêche XSS et injection
const registerSchema = z.object({
  firstName: z.string().min(1).max(50).trim(),
  lastName: z.string().min(1).max(50).trim(),
  email: z.string().email().max(100).trim().toLowerCase(),
  password: z.string().min(6).max(100),
  phone: z.string().max(20).optional(),
})

export async function POST(request: Request) {
  try {
    // Récupérer IP (simplifié)
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    
    // 🛡️ Vérifier rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans 15 minutes." },
        { status: 429 }
      )
    }

    const body = await request.json()

    // 🛡️ Validation stricte avec Zod (bloque XSS)
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.issues },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, password, phone } = result.data

    // Vérifier si email existe déjà
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      )
    }

    // 🛡️ Hash du mot de passe (jamais stocké en clair)
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      }
    })

    return NextResponse.json(
      { message: "Compte créé avec succès", user },
      { status: 201 }
    )

  } catch (error) {
    console.error("Erreur inscription:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}