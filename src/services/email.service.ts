import { getTransporter } from "../config/emailConfig"

export const emailService = {
  sendEmail: async ({
    to,
    subject,
    html,
  }: {
    to: string
    subject: string
    html: string
  }) => {
    try {
      const transporter = getTransporter()
      return await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      })
    } catch (error) {
      console.error("Email verification failed:", error)
    }
  },
}
