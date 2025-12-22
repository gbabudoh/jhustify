/**
 * Email Service Utility
 * Sends emails using nodemailer or SMTP
 */

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

class EmailService {
  private smtpHost: string;
  private smtpPort: number;
  private smtpUser: string;
  private smtpPassword: string;
  private smtpFrom: string;
  private enabled: boolean;

  constructor() {
    this.smtpHost = process.env.SMTP_HOST || '';
    this.smtpPort = parseInt(process.env.SMTP_PORT || '587');
    this.smtpUser = process.env.SMTP_USER || '';
    this.smtpPassword = process.env.SMTP_PASSWORD || '';
    this.smtpFrom = process.env.SMTP_FROM || 'noreply@jhustify.com';
    // Enable if host is set (auth is optional for localhost/VPS)
    this.enabled = !!this.smtpHost;
  }

  async sendEmail({ to, subject, html, text, from }: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
    // If SMTP is configured, use nodemailer
    if (this.enabled) {
      try {
        const nodemailer = await import('nodemailer');

        // Configure transporter with optional auth (for VPS/localhost)
        const transporterConfig: any = {
          host: this.smtpHost,
          port: this.smtpPort,
          secure: this.smtpPort === 465,
        };

        // Only add auth if credentials are provided (required for most SMTP servers)
        if (this.smtpUser && this.smtpPassword) {
          transporterConfig.auth = {
            user: this.smtpUser,
            pass: this.smtpPassword,
          };
        }

        const transporter = nodemailer.createTransport(transporterConfig);

        const info = await transporter.sendMail({
          from: from || this.smtpFrom,
          to,
          subject,
          text: text || html.replace(/<[^>]*>/g, ''),
          html,
        });

        console.log('Email sent via SMTP:', info.messageId);
        return { success: true };
      } catch (error: any) {
        console.error('SMTP email send error:', error);
        return { success: false, error: error.message };
      }
    }

    // If Resend API is configured, use that
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      return await this.sendViaAPI({ to, subject, html, text, from });
    }

    // Development mode: log email instead of sending
    console.log('Email service not configured. Email would be sent to:', to);
    console.log('Subject:', subject);
    console.log('Body:', text || html);
    return { success: true }; // Return success in dev mode
  }

  private async sendViaAPI({ to, subject, html, text, from }: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
    // Try Resend API if configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: from || this.smtpFrom,
            to: [to],
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, ''),
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to send email');
        }

        return { success: true };
      } catch (error: any) {
        console.error('Resend API error:', error);
        return { success: false, error: error.message };
      }
    }

    // Log email in development
    console.log('Email service not configured. Email would be sent:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', text || html);
    return { success: true };
  }

  async sendBusinessMessageNotification({
    businessEmail,
    businessName,
    fromName,
    fromEmail,
    fromPhone,
    subject,
    message,
    businessId,
  }: {
    businessEmail: string;
    businessName: string;
    fromName: string;
    fromEmail: string;
    fromPhone?: string;
    subject: string;
    message: string;
    businessId: string;
  }): Promise<{ success: boolean; error?: string }> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #465362; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f5f5f5; padding: 20px; margin-top: 20px; }
            .message-box { background-color: white; padding: 15px; border-left: 4px solid #465362; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #465362; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Message on Jhustify</h1>
            </div>
            <div class="content">
              <p>Hello ${businessName},</p>
              <p>You have received a new message from a customer on Jhustify:</p>
              
              <div class="message-box">
                <p><strong>From:</strong> ${fromName}</p>
                ${fromEmail ? `<p><strong>Email:</strong> ${fromEmail}</p>` : ''}
                ${fromPhone ? `<p><strong>Phone:</strong> ${fromPhone}</p>` : ''}
                <p><strong>Subject:</strong> ${subject}</p>
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>

              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/messages?businessId=${businessId}" class="button">
                  View Message in Dashboard
                </a>
              </div>

              <p style="margin-top: 30px; font-size: 12px; color: #666;">
                This is an automated notification from Jhustify. Please do not reply directly to this email.
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Jhustify. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
New Message on Jhustify

Hello ${businessName},

You have received a new message from a customer on Jhustify:

From: ${fromName}
${fromEmail ? `Email: ${fromEmail}` : ''}
${fromPhone ? `Phone: ${fromPhone}` : ''}
Subject: ${subject}

Message:
${message}

View this message in your dashboard:
${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/messages?businessId=${businessId}

---
This is an automated notification from Jhustify.
    `;

    return await this.sendEmail({
      to: businessEmail,
      subject: `New Message: ${subject}`,
      html,
      text,
    });
  }
}

export const emailService = new EmailService();

