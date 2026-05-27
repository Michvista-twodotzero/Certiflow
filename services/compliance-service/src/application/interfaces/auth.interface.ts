export interface AuthUserRecord {
  id: string
  name: string
  email: string
  password: string
  emailNotifications?: boolean
  criticalViolationAlerts?: boolean
  notificationSound?: boolean
}

export interface AuthUserRepository {
  findByEmail(email: string): Promise<AuthUserRecord | null>
  findById(id: string): Promise<AuthUserRecord | null>
  create(input: { name: string; email: string; password: string }): Promise<AuthUserRecord>
  updateSettings(
    userId: string,
    settings: {
      emailNotifications: boolean
      criticalViolationAlerts: boolean
      notificationSound: boolean
    },
  ): Promise<AuthUserRecord>
}
