import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { to, subject, text, html } = await req.json();

    // SMTPトランスポートの設定
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // SMTPユーザー名
        pass: process.env.SMTP_PASS, // SMTPパスワード
      },
    });

    // メール送信
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL, // 送信元メールアドレス
      to, // 送信先メールアドレス
      subject, // 件名
      text, // テキスト形式の本文
      html, // HTML形式の本文
    });

    console.log('Message sent: %s', info.messageId);
    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: unknown) {
    console.error('Error in email API route:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
