# Email Setup Guide

This guide will help you configure email notifications for business messages.

## Email Service Options

The email service supports multiple providers:

### Option 1: SMTP with Your VPS (Recommended for production)

Use your own VPS email server or any SMTP server.

Add to `.env.local`:

```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-email-password
SMTP_FROM=noreply@yourdomain.com
```

**Common VPS SMTP configurations:**

**Postfix/Sendmail (Local VPS):**
```env
SMTP_HOST=localhost
SMTP_PORT=25
# No auth needed for localhost postfix
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@yourdomain.com
```

**Note:** For localhost postfix, you typically don't need SMTP_USER and SMTP_PASSWORD. Just set SMTP_HOST=localhost and SMTP_PORT=25.

**cPanel/WHM:**
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-cpanel-email-password
SMTP_FROM=noreply@yourdomain.com
```

**Gmail SMTP:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@jhustify.com
```

**For Gmail:**
1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password as `SMTP_PASSWORD`

**For SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

### Option 2: Resend API (Recommended for production)

1. Sign up at https://resend.com
2. Get your API key
3. Add to `.env.local`:

```env
RESEND_API_KEY=re_your_api_key_here
SMTP_FROM=noreply@yourdomain.com
```

**Note:** You need to verify your domain in Resend before sending emails.

### Option 3: Development Mode (No email sent)

If no email configuration is provided, emails will be logged to the console instead of being sent. This is useful for development.

## Install Nodemailer (Optional)

If you want to use SMTP with nodemailer:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

## Environment Variables

Add these to your `.env.local`:

```env
# Email Configuration (choose one method)

# Method 1: SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@jhustify.com

# Method 2: Resend API
RESEND_API_KEY=re_your_api_key_here

# App URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing

1. Send a message to a business from the business detail page
2. Check the business owner's email inbox
3. In development mode (no email config), check the server console logs

## Troubleshooting

- **Emails not sending**: Check server console for error messages
- **SMTP errors**: Verify your SMTP credentials are correct
- **Resend errors**: Make sure your domain is verified in Resend
- **Development mode**: Emails are logged to console, not actually sent

