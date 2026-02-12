// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Membuat instance baru jika belum ada, atau menggunakan yang sudah ada di global
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Opsional: Untuk melihat log SQL di terminal
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma