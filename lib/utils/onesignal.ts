/**
 * OneSignal SMS Verification Service
 * 
 * OneSignal REST API Documentation: https://documentation.onesignal.com/reference
 * Note: OneSignal SMS requires a paid plan. For free alternatives, consider Twilio or AWS SNS.
 */

interface SendSMSOptions {
  phoneNumber: string;
  message: string;
}

interface SendVerificationCodeOptions {
  phoneNumber: string;
  code: string;
}

class OneSignalService {
  private appId: string;
  private restApiKey: string;
  private smsFromNumber?: string;

  constructor() {
    this.appId = process.env.ONESIGNAL_APP_ID || '';
    this.restApiKey = process.env.ONESIGNAL_REST_API_KEY || '';
    this.smsFromNumber = process.env.ONESIGNAL_SMS_FROM_NUMBER;

    if (!this.appId || !this.restApiKey) {
      console.warn('OneSignal credentials not configured. SMS verification will not work.');
    }
  }

  /**
   * Send SMS via OneSignal REST API
   * Note: OneSignal SMS requires API v1 and proper configuration
   */
  async sendSMS({ phoneNumber, message }: SendSMSOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.appId || !this.restApiKey) {
      return {
        success: false,
        error: 'OneSignal not configured. Please set ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY',
      };
    }

    try {
      // Format phone number (remove spaces, ensure + prefix)
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      // OneSignal SMS API endpoint
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.restApiKey}`,
        },
        body: JSON.stringify({
          app_id: this.appId,
          include_phone_numbers: [formattedPhone],
          sms_from: this.smsFromNumber || 'Jhustify',
          contents: {
            en: message,
          },
          // For SMS-only notifications
          isSms: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.errors?.[0] || 'Failed to send SMS',
        };
      }

      return {
        success: true,
        messageId: data.id,
      };
    } catch (error: any) {
      console.error('OneSignal SMS error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS',
      };
    }
  }

  /**
   * Send verification code via SMS
   */
  async sendVerificationCode({ phoneNumber, code }: SendVerificationCodeOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const message = `Your Jhustify verification code is: ${code}. This code expires in 10 minutes.`;
    
    return this.sendSMS({
      phoneNumber,
      message,
    });
  }

  /**
   * Format phone number to international format
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');

    // If doesn't start with +, assume it's a local number and add country code
    // Default to Nigeria (+234) if no country code detected
    if (!cleaned.startsWith('+')) {
      // If starts with 0, replace with country code
      if (cleaned.startsWith('0')) {
        cleaned = '+234' + cleaned.substring(1);
      } else {
        // Assume it's already without leading 0
        cleaned = '+234' + cleaned;
      }
    }

    return cleaned;
  }

  /**
   * Generate a 6-digit verification code
   */
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

// Export singleton instance
export const oneSignalService = new OneSignalService();

// Export for testing
export { OneSignalService };

