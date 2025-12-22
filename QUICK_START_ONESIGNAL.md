# Quick Start: OneSignal SMS Verification

## 🚀 Quick Setup (5 minutes)

### 1. Get OneSignal Credentials

1. Sign up at https://onesignal.com (or login)
2. Create a new app or select existing app
3. Go to **Settings > Keys & IDs**
4. Copy:
   - **App ID** (e.g., `12345678-1234-1234-1234-123456789012`)
   - **REST API Key** (e.g., `YjA2YzE4YzAtYjE2Yi00YzY5LWI5NzAtYjE2YjE2YjE2YjE2`)

### 2. Add to Environment Variables

Create or update `.env.local`:

```env
ONESIGNAL_APP_ID=your-app-id-here
ONESIGNAL_REST_API_KEY=your-rest-api-key-here
ONESIGNAL_SMS_FROM_NUMBER=Jhustify
```

### 3. Enable SMS in OneSignal

**Important:** OneSignal SMS requires a paid plan and SMS provider setup.

1. Go to **Settings > SMS** in OneSignal dashboard
2. Configure SMS provider (Twilio, AWS SNS, etc.)
3. Set up sender ID/number

### 4. Test It

```bash
# Start your dev server
npm run dev

# In development mode, if SMS fails, the code will be returned in the API response
# This allows testing without actual SMS setup
```

## 📱 Usage Example

### In Your React Component:

```tsx
import PhoneVerification from '@/components/PhoneVerification';

function MyComponent() {
  const handleVerified = () => {
    console.log('Phone verified!');
    // Proceed with next step
  };

  return (
    <PhoneVerification
      phoneNumber="+2348000000000"
      businessId="optional-business-id"
      onVerified={handleVerified}
    />
  );
}
```

### API Endpoints:

**Send Code:**
```bash
POST /api/verification/phone/send-code
Authorization: Bearer <token>
Body: {
  "phoneNumber": "+2348000000000",
  "businessId": "optional"
}
```

**Verify Code:**
```bash
POST /api/verification/phone/verify-code
Authorization: Bearer <token>
Body: {
  "phoneNumber": "+2348000000000",
  "code": "123456",
  "businessId": "optional"
}
```

## ⚠️ Important Notes

1. **OneSignal SMS is Paid**: Requires paid plan + SMS provider (Twilio/AWS SNS)
2. **Development Mode**: Codes are returned in API response if SMS fails (for testing)
3. **Production**: Remove code-returning feature before going live
4. **Alternative**: Consider Twilio directly for SMS (see `ONESIGNAL_SETUP.md`)

## 🔄 Alternative: Use Twilio Directly

If OneSignal SMS is not available, use Twilio:

```bash
npm install twilio
```

Add to `.env.local`:
```env
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
```

Then update `lib/utils/onesignal.ts` to use Twilio instead.

## ✅ What's Included

- ✅ OneSignal service utility
- ✅ Phone verification API endpoints
- ✅ PhoneVerification React component
- ✅ Database model for verification codes
- ✅ Auto-expiry (10 minutes)
- ✅ Rate limiting (5 attempts max)
- ✅ Security features

## 📚 Full Documentation

See `ONESIGNAL_SETUP.md` for complete setup guide.

