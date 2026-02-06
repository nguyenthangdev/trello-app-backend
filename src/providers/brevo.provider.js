const SibApiV3Sdk = require('@getbrevo/brevo')
import { env } from '~/config/environment'

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
  sendSmtpEmail.sender = { email: 'dattran278005@gmail.com', name: 'ThangNguyen' }

  // 'to': phải là 1 Array để sau chúng ta có thể tùy chỉnh biến gửi 1 email tới nhiều user tùy tính năng dự án
  sendSmtpEmail.to = [{ email: recipientEmail }]

  sendSmtpEmail.subject = customSubject
  sendSmtpEmail.htmlContent = htmlContent
  // trả về 1 promise
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const brevoProvider = {
  sendEmail
}