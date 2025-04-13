import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESNED_API_KEY!);

export type EmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

// TODO: CORS エラーが出るので、API経由で送信するようにする
export const sendEmail = async (payload: EmailPayload) => {
  try {
    const data = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL!,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
      react: undefined,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
