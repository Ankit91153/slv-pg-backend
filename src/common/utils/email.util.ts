import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
) => {
  return resend.emails.send({
    from: 'My App <onboarding@resend.dev>', // free tier sender
    to,
    subject,
    html,
  });
};
