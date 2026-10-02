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
      from: process.env.EMAIL_USER || 'tanmaylkgarg@gmail.com',
      to: email, // sends back to the person who filled out the form
      subject: `Thank you for reaching out, ${name}!`,
      text: `Hi ${name},\n\nThank you for checking out my portfolio and getting in touch! I have received your message and will get back to you as soon as possible.\n\nBest regards,\nTanmay Garg\nSoftware Engineer`,
      html: `<p>Hi ${name},</p>
             <p>Thank you for checking out my portfolio and getting in touch! I have received your message and will get back to you as soon as possible.</p>
             <p>Best regards,<br><strong>Tanmay Garg</strong><br>Software Engineer</p>`,
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
