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
      subject: `Thanks for connecting, ${name}!`,
      text: `Hi ${name},\n\nI truly appreciate you taking the time to explore my portfolio and reaching out.\n\nWhether you are contacting me regarding a potential opportunity, a collaboration, or just to talk about cloud architecture and software engineering, I am thrilled to connect with you. I have successfully received your message and will get back to you within the next 24-48 hours.\n\nIn the meantime, feel free to check out some of my open-source work on GitHub (https://github.com/tanmaygarg06), or connect with me on LinkedIn (https://www.linkedin.com/in/garg-tanmay/).\n\nHave a fantastic day!\n\nBest regards,\nTanmay Garg\nSoftware Engineer & Cloud Builder`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #10b981; margin-top: 0;">Thanks for connecting, ${name}!</h2>
          <p>I truly appreciate you taking the time to explore my portfolio and reaching out.</p>
          <p>Whether you are contacting me regarding a potential opportunity, a collaboration, or just to talk about cloud architecture and software engineering, I am thrilled to connect with you. I have successfully received your message and will review it and get back to you within the next 24 hours.</p>
          <p>In the meantime, feel free to check out some of my open-source work on <a href="https://github.com/tanmaygarg06" style="color: #10b981; text-decoration: none; font-weight: bold;">GitHub</a>, or connect with me on <a href="https://www.linkedin.com/in/garg-tanmay/" style="color: #10b981; text-decoration: none; font-weight: bold;">LinkedIn</a>.</p>
          <p>Have a fantastic day!</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="margin: 0; font-weight: bold; font-size: 16px;">Tanmay Garg</p>
          <p style="margin: 0; color: #666; font-size: 14px;">Software Engineer & Cloud Builder</p>
          <p style="margin: 0; color: #999; font-size: 12px; margin-top: 5px;">ABES Engineering College, Ghaziabad</p>
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
