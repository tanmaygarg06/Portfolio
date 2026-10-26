import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailUser = process.env.EMAIL_USER || 'tanmaylkgarg@gmail.com';
    const rawPass = process.env.EMAIL_PASS || '';
    const emailPass = rawPass.replace(/\s+/g, ''); // Remove spaces from Google App Password

    if (!emailPass || emailPass === 'your_gmail_app_password_here' || emailPass === 'your_16_character_gmail_app_password_here') {
      console.error('Email configuration error: EMAIL_PASS is not set. Please configure a 16-character Gmail App Password in your environment variables.');
      return NextResponse.json(
        { error: 'Email service is not configured (missing Gmail App Password in EMAIL_PASS). Please add EMAIL_PASS to .env.local and hosting environment variables.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // 1. Email to Site Owner (Tanmay)
    const mailOptionsToYou = {
      from: `"${name}" <${emailUser}>`,
      to: emailUser,
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #10b981; margin-top: 0;">New Message from Portfolio</h2>
          <p><strong>Sender Name:</strong> ${name}</p>
          <p><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</div>
        </div>
      `,
    };

    // 2. Thank You Auto-Reply Email to the Visitor
    const mailOptionsToVisitor = {
      from: {
        name: 'Tanmay Garg',
        address: emailUser,
      },
      to: email,
      subject: `Re: Your message to Tanmay Garg`,
      text: `Hi ${name},\n\nThank you for reaching out! I've received your message and will review it shortly. I typically respond within 24 hours.\n\nLooking forward to connecting.\n\nBest regards,\nTanmay Garg\nSoftware Engineer & Cloud Builder\n\nGitHub: https://github.com/tanmaygarg06\nLinkedIn: https://www.linkedin.com/in/garg-tanmay/`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <p>Hi ${name},</p>
          <p>Thank you for reaching out! I've received your message and will review it shortly. I typically respond within 24 hours.</p>
          <p>Looking forward to connecting.</p>
          <br>
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 0; font-weight: bold;">Tanmay Garg</p>
          <p style="margin: 0; color: #555;">Software Engineer & Cloud Builder</p>
          <p style="margin-top: 15px; font-size: 13px;">
            <a href="https://github.com/tanmaygarg06" style="color: #10b981; text-decoration: none; font-weight: bold; margin-right: 12px;">GitHub</a> | 
            <a href="https://www.linkedin.com/in/garg-tanmay/" style="color: #10b981; text-decoration: none; font-weight: bold; margin-left: 12px;">LinkedIn</a>
          </p>
        </div>
      `,
    };

    // Send primary email to Tanmay
    await transporter.sendMail(mailOptionsToYou);

    // Send auto-reply to the visitor (non-fatal if visitor entered an invalid email)
    try {
      await transporter.sendMail(mailOptionsToVisitor);
    } catch (visitorErr) {
      console.warn('Visitor auto-reply could not be sent (likely invalid recipient email):', visitorErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to send email' }, { status: 500 });
  }
}
