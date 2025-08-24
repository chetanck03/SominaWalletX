# EmailJS Setup Guide for Contact Form

This guide will help you set up EmailJS to enable the contact form functionality in SominaWalletX.

## Prerequisites

- EmailJS account (free tier available)
- Email service (Gmail, Outlook, etc.)

## Step-by-Step Setup

### 1. Create EmailJS Account

1. Go to [EmailJS website](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Add Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note down your **Service ID**

### 3. Create Email Template

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Design your template with these variables:

```html
Subject: New Contact Form Message - {{subject}}

Hello {{to_name}},

You have received a new message from your SominaWalletX contact form:

From: {{from_name}} ({{from_email}})
Subject: {{subject}}

Message:
{{message}}

---
Best regards,
SominaWalletX Contact Form
```

4. Note down your **Template ID**

### 4. Get Public Key

1. Go to **Account** > **General** in your dashboard
2. Find your **Public Key** (User ID)
3. Copy this key

### 5. Configure Environment Variables

Add the following variables to your `.env` file:

```env
# EmailJS Configuration for Contact Form
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

Replace the placeholder values with your actual EmailJS credentials.

### 6. Template Parameters

The contact form sends these parameters to your EmailJS template:

- `from_name` - The sender's name
- `from_email` - The sender's email address
- `subject` - The email subject
- `message` - The message content
- `to_name` - Set to "SominaWalletX Team"
- `reply_to` - The sender's email for replies

### 7. Testing

1. Restart your development server after adding environment variables
2. Fill out the contact form on your website
3. Check your email for the message
4. Verify all template variables are populated correctly

## Troubleshooting

### Common Issues

1. **"Email service is not configured" error**
   - Check that all environment variables are set correctly
   - Ensure you've restarted the development server

2. **EmailJS errors in console**
   - Verify your Service ID, Template ID, and Public Key
   - Check EmailJS dashboard for service status

3. **Emails not being received**
   - Check your spam folder
   - Verify email template configuration
   - Test with a different email address

### Rate Limits

EmailJS free tier includes:
- 200 emails per month
- 50 emails per day

For higher volumes, consider upgrading to a paid plan.

## Security Notes

- Public Key is safe to expose in frontend code
- Service ID and Template ID are also safe to expose
- Never expose your Private Key in frontend code
- EmailJS handles all email sending securely

## Support

For EmailJS-specific issues, refer to:
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Support](https://www.emailjs.com/contact/)

For SominaWalletX contact form issues, check the browser console for error messages.