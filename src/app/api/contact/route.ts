import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'tanmaylkgarg@gmail.com',
        pass: process.env.EMAIL_PASS,
      },
    });

    // 1. Email to You (The Site Owner)
    const mailOptionsToYou = {
      from: process.env.EMAIL_USER || 'tanmaylkgarg@gmail.com',
      to: 'tanmaylkgarg@gmail.com',
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br>')}</p>`,
    };

    // 2. Thank You Auto-Reply Email to the Visitor
    const mailOptionsToVisitor = {
      from: {
        name: 'Tanmay Garg',
        address: process.env.EMAIL_USER || 'tanmaylkgarg@gmail.com'
      },
      to: email, // sends back to the person who filled out the form
      subject: `Re: Your message to Tanmay Garg`,
      text: `Hi ${name},\n\nThank you for reaching out! I've received your message and will review it shortly. I typically respond within 24 hours.\n\nLooking forward to connecting.\n\nBest regards,\nTanmay Garg\nSoftware Engineer & Cloud Builder\n\nGitHub: https://github.com/tanmaygarg06\nLinkedIn: https://www.linkedin.com/in/garg-tanmay/`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
          <p>Hi ${name},</p>
          <p>Thank you for reaching out! I've received your message and will review it shortly. I typically respond within 24 hours.</p>
          <p>Looking forward to connecting.</p>
          <br>
          <p style="margin: 0;">Best regards,</p>
          <p style="margin: 0; font-weight: bold;">Tanmay Garg</p>
          <p style="margin: 0; color: #555;">Software Engineer & Cloud Builder</p>
          <p style="margin-top: 10px; font-size: 13px;">
            <a href="https://github.com/tanmaygarg06" style="color: #0066cc;">GitHub</a> | 
            <a href="https://www.linkedin.com/in/garg-tanmay/" style="color: #0066cc;">LinkedIn</a>
          </p>
        </div>
      `,
    };

    // Send both emails simultaneously
    await Promise.all([
      transporter.sendMail(mailOptionsToYou),
      transporter.sendMail(mailOptionsToVisitor)
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
