import { prisma } from '../prisma/client'
import { AuthUserRecord, AuthUserRepository } from '../../application/interfaces/auth.interface'

type PrismaUser = {
  id: string
  name: string
  email: string
  password: string
  emailNotifications: boolean
  criticalViolationAlerts: boolean
}

export class PrismaUserAuthRepository implements AuthUserRepository {
  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    return user ? this.toRecord(user as PrismaUser) : null
  }

  async findById(id: string): Promise<AuthUserRecord | null> {
    const user = await prisma.user.findUnique({ where: { id } })
    return user ? this.toRecord(user as PrismaUser) : null
  }

  async create(input: { name: string; email: string; password: string }): Promise<AuthUserRecord> {
    const user = await prisma.user.create({ data: input })
    return this.toRecord(user as PrismaUser)
  }

  async updateSettings(userId: string, settings: { emailNotifications: boolean; criticalViolationAlerts: boolean }): Promise<AuthUserRecord> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: settings,
    })

    return this.toRecord(user as PrismaUser)
  }

  private toRecord(user: PrismaUser): AuthUserRecord {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      emailNotifications: user.emailNotifications,
      criticalViolationAlerts: user.criticalViolationAlerts,
    }
  }
}
