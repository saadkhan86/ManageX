import { emailService } from "../services/email.service"

const emailUtils = {
  sendVerificationEmail: async (email: string, token: string) => {
    const link = `${process.env.EMAIL_VERIFICATION_URL}/verify-email/${token}`
    const html = `<h2>Verify Your Email</h2>
                    <p>Please click the link below to verify your email address:</p>
                    <a href="${link}" style="padding:10px 15px;background-color:#007bff;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
                    <p>If you did not create this account, please ignore this email.</p>
                    <p>Thank you!</p>
                `
    console.log("email html created")
    return await emailService.sendEmail({
      to: email,
      subject: "Verify your email",
      html: html,
    })
  },
  sendInviteEmail: async (senderName: string, email: string, token: string) => {
    const link = `${process.env.EMAIL_VERIFICATION_URL}/verify-email/${token}`
    const html = `<h2>Workspace Invite"${senderName}"</h2>
                    <p>Please click the link below to verify your email address:</p>
                    <a href="${link}" style="padding:10px 15px;background-color:#007bff;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
                    <p>If you did not create this account, please ignore this email.</p>
                    <p>Thank you!</p>
                `
    console.log("email html created")
    return await emailService.sendEmail({
      to: email,
      subject: "Verify your email",
      html: html,
    })
  },
}
export default emailUtils
