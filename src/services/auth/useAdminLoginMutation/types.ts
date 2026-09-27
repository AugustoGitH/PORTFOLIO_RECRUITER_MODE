export type AdminLoginPayload = {
  email: string
  password: string
}

export type AdminLoginError = {
  attemptsRemaining?: number
  retryAfterSeconds?: number
}
