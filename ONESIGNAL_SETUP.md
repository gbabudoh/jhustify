# OneSignal SMS Verification Setup Guide

This guide will help you set up OneSignal for SMS phone verification in your Jhustify application.

## Prerequisites

1. OneSignal account (sign up at https://onesignal.com)
2. OneSignal app created
3. SMS capabilities enabled (requires paid plan)

## Step 1: Create OneSignal Account and App

1. Go to https://onesignal.com and sign up/login
2. Create a new app (or use existing)
3. Note your **App ID** (found in Settings > Keys & IDs)

## Step 2: Get REST API Key

1. In your OneSignal dashboard, go to **Settings > Keys & IDs**
2. Copy your **REST API Key** (REST API Key, not User Auth Key)

## Step 3: Configure SMS (OneSignal Paid Feature)

**Important:** OneSignal SMS requires a paid plan. If you need a free alternative, consider:
- **Twilio** (recommended for SMS)
- **AWS SNS**
- **Vonage (Nexmo)**

### For OneSignal SMS:
1. Go to **Settings > SMS**
2. Configure your SMS sender ID/number
3. Set up SMS provider (Twilio, AWS SNS, etc.) through OneSignal

## Step 4: Set Environment Variables

Add these to your `.env.local` file:

```env
# OneSignal Configuration
ONESIGNAL_APP_ID=your-app-id-here
ONESIGNAL_REST_API_KEY=your-rest-api-key-here
ONESIGNAL_SMS_FROM_NUMBER=Jhustify
```

### Example:
```env
ONESIGNAL_APP_ID=12345678-1234-1234-1234-123456789012
ONESIGNAL_REST_API_KEY=YjA2YzE4YzAtYjE2Yi00YzY5LWI5NzAtYjE2YjE2YjE2YjE2
ONESIGNAL_SMS_FROM_NUMBER=Jhustify
```

## Step 5: Install Dependencies

The current implementation uses the native `fetch` API, so no additional packages are needed. However, if you prefer using the OneSignal SDK:

```bash
npm install onesignal-node
```

## Step 6: Test the Integration

### Development Mode
In development mode, if SMS fails, the API will return the code directly (for testing). Remove this in production!

### Test Endpoints

1. **Send Verification Code:**
```bash
POST /api/verification/phone/send-code
Headers: Authorization: Bearer <token>
Body: {
  "phoneNumber": "+2348000000000",
  "businessId": "optional-business-id"
}
```

2. **Verify Code:**
```bash
POST /api/verification/phone/verify-code
Headers: Authorization: Bearer <token>
Body: {
  "phoneNumber": "+2348000000000",
  "code": "123456",
  "businessId": "optional-business-id"
}
```

## Alternative: Using Twilio Directly (Recommended for SMS)

If OneSignal SMS is not available or too expensive, here's how to use Twilio directly:

### Install Twilio:
```bash
npm install twilio
```

### Create Twilio Service (`lib/utils/twilio.ts`):
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendVerificationSMS(phoneNumber: string, code: string) {
  return client.messages.create({
    body: `Your Jhustify verification code is: ${code}. This code expires in 10 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });
}
```

### Environment Variables:
```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

## Integration with Verification Flow

The phone verification is integrated into the business verification flow:

1. User enters phone number during business registration
2. System sends verification code via OneSignal SMS
3. User enters code to verify
4. Business `mobileVerified` field is set to `true`
5. User can proceed with verification

## Security Features

- ✅ Codes expire after 10 minutes
- ✅ Maximum 5 verification attempts
- ✅ Codes are auto-deleted after expiry (MongoDB TTL)
- ✅ Rate limiting on failed attempts
- ✅ Codes are not returned in API responses (except dev mode)

## Troubleshooting

### SMS Not Sending
1. Check OneSignal credentials in `.env.local`
2. Verify SMS is enabled in OneSignal dashboard
3. Check OneSignal account has SMS credits/plan
4. Verify phone number format (must include country code)

### Code Not Verifying
1. Check code hasn't expired (10 minutes)
2. Verify code matches exactly
3. Check attempts haven't exceeded limit (5)
4. Ensure phone number format matches

### Development Mode
In development, if SMS fails, the code will be returned in the response for testing. **Remove this in production!**

## Next Steps

1. Set up OneSignal account and get credentials
2. Add credentials to `.env.local`
3. Test SMS sending in development
4. Integrate phone verification UI into verification flow
5. Remove development code-returning feature before production

## Support

- OneSignal Documentation: https://documentation.onesignal.com/
- OneSignal SMS Guide: https://documentation.onesignal.com/docs/sms
- Twilio Alternative: https://www.twilio.com/docs/sms

