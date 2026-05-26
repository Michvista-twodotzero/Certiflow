import { Router, Request, Response, NextFunction } from 'express'
import { successResponse, ValidationError } from '@certiflow/shared'
import { PrismaUserAuthRepository } from '../repositories/PrismaUserAuth.repository'

const router = Router()
const authRepository = new PrismaUserAuthRepository()

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['x-user-id'] as string
    const user = await authRepository.findById(userId)

    if (!user) {
      throw new ValidationError('User not found')
    }

    res.json(successResponse({
      emailNotifications: user.emailNotifications ?? true,
      criticalViolationAlerts: user.criticalViolationAlerts ?? true,
      theme: 'dark' as const,
    }))
  } catch (error) {
    next(error)
  }
})

router.patch('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.headers['x-user-id'] as string
    const emailNotifications = Boolean(req.body.emailNotifications)
    const criticalViolationAlerts = Boolean(req.body.criticalViolationAlerts)

    const user = await authRepository.updateSettings(userId, {
      emailNotifications,
      criticalViolationAlerts,
    })

    res.json(successResponse({
      emailNotifications: user.emailNotifications ?? true,
      criticalViolationAlerts: user.criticalViolationAlerts ?? true,
      theme: 'dark' as const,
    }, 'Settings updated'))
  } catch (error) {
    next(error)
  }
})

export default router
