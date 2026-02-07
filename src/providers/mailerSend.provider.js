/* eslint-disable no-console */
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'

const MAILER_SEND_API_KEY = process.env.MAILER_SEND_API_KEY

const ADMIN_SENDER_EMAIL = process.env.ADMIN_SENDER_EMAIL
const ADMIN_SENDER_NAME = process.env.ADMIN_SENDER_NAME

const mailerSendInstance = new MailerSend({
  apiKey: MAILER_SEND_API_KEY
})

const sendFrom = new Sender(ADMIN_SENDER_EMAIL, ADMIN_SENDER_NAME)

const sendEmail = async ({ to, toName, subject, html }) => {
  try {
    const recipients = [
      new Recipient(to, toName)
      // new Recipient(to, toName) // Muốn gửi nhiều thì bỏ tiền ra cho MailerSend
      // new Recipient(to, toName)
      // new Recipient(to, toName)
      // new Recipient(to, toName)
    ]

    // mất phí mới đc xài
    // // Carbon Copy. Gửi email hàng loạt, xem đc tất cả những thông tin của cả những người khác.
    // const cc = [
    //   new Recipient('your_cc@client.com', 'Your Client CC 1'),
    //   new Recipient('your_cc@client.com', 'Your Client CC 2'),
    //   new Recipient('your_cc@client.com', 'Your Client CC 3')
    // ]
    // // Blind Carbon Copy. Gửi email hàng loạt, không xem đc thông tin của những người khác.
    // const bcc = [
    //   new Recipient('your_bcc@client.com', 'Your Client BCC 1'),
    //   new Recipient('your_bcc@client.com', 'Your Client BCC 2'),
    //   new Recipient('your_bcc@client.com', 'Your Client BCC 3')
    // ]

    const emailParams = new EmailParams()
      .setFrom(sendFrom)
      .setTo(recipients)
      .setReplyTo(sendFrom)
      .setSubject(subject)
      .setHtml(html)
      // .setCc(cc)
      // .setBcc(bcc)

    const data = await mailerSendInstance.email.send(emailParams)
    return data
  } catch (error) {
    console.error('MailerSend Error: ', error)
    throw error
  }
}

export const mailerSendProvider = {
  sendEmail
}