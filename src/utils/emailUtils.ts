import { emailService } from "../services/email.service"

const emailUtils = {
  sendVerificationEmail: async (email: string, token: string) => {
    const link = `${process.env.EMAIL_VERIFICATION_URL}/verify-email/${token}`
    const html = `<h2>Verify Your Email</h2>
                    <p>Please click the link below to verify your email address:</p>
                    <a href="${link}" style="color:blue;text-decoration:none;">Verify Email</a>
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
  sendInviteEmail: async (
    senderName: string,
    email: string,
    token: string,
    workspaceName: string,
    role: string,
  ) => {
    const link = `${process.env.INVITE_VERIFICATION_URL}/${token}`
    const html = `
  <h2>Workspace Invitation</h2>
  <p>You have been invited to join <strong>${workspaceName}</strong> as <strong>${role}</strong>.</p>
  <p>Invite sent by: <strong>${senderName}</strong></p>
  <a href="${link}/accepted" style="color:blue;text-decoration:none;">
    Accept Invitation
  </a>
  <br /> <br />
  <a href="${link}/rejected" style="color:blue;text-decoration:none;">
    Reject Invitation
  </a>
  
  <p>This invite will expire in 24 hours.</p>
  <p>If you were not expecting this, you can ignore this email.</p>
  <p>Thanks!</p>
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
