interface MailgunConfig {
  apiKey: string
  domain: string
  baseUrl?: string
}

interface EmailOptions {
  to: string
  from: string
  subject: string
  html: string
  text?: string
}

export class MailgunService {
  private config: MailgunConfig

  constructor(config: MailgunConfig) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl || 'https://api.mailgun.net/v3'
    }
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Use URLSearchParams instead of FormData to match working Java pattern
      const params = new URLSearchParams()
      params.append('from', options.from)
      params.append('to', options.to)
      params.append('subject', options.subject)
      params.append('html', options.html)
      if (options.text) {
        params.append('text', options.text)
      }

      console.log('🔍 Mailgun request URL:', `${this.config.baseUrl}/${this.config.domain}/messages`)
      console.log('🔍 Domain from env:', this.config.domain)

      const response = await fetch(`${this.config.baseUrl}/${this.config.domain}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${this.config.apiKey}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Mailgun API error: ${response.status} ${errorText}`)
      }

      const result = await response.json()
      return {
        success: true,
        messageId: result.id
      }
    } catch (error) {
      console.error('Error sending email via Mailgun:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async sendSubscriptionConfirmation(email: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const subscriptionEmail = process.env.MAILGUN_SUBSCRIPTION_EMAIL || 'subscription@maxyourpoints.com'
    
    const emailOptions: EmailOptions = {
      to: email,
      from: `Max Your Points <${subscriptionEmail}>`,
      subject: 'Welcome to Max Your Points Newsletter! 🎉',
      html: this.getSubscriptionConfirmationHTML(email),
      text: this.getSubscriptionConfirmationText(email)
    }

    return this.sendEmail(emailOptions)
  }

  private getSubscriptionConfirmationHTML(email: string): string {
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://maxyourpoints.com'}/unsubscribe`
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Max Your Points!</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #14b8a6 0%, #f59e0b 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border-radius: 10px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; padding: 20px; }
        .button { display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #f59e0b 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .highlight { background: #ecfdf5; padding: 15px; border-left: 4px solid #14b8a6; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Welcome to Max Your Points!</h1>
        <p>Thank you for subscribing to our newsletter</p>
      </div>
      
      <div class="content">
        <h2>Hello there!</h2>
        <p>Welcome to the Max Your Points community! We're thrilled to have you on board.</p>
        
        <div class="highlight">
          <strong>What you can expect:</strong>
          <ul>
            <li>📈 Exclusive travel tips and strategies</li>
            <li>💳 Best credit card deals and offers</li>
            <li>✈️ Airline loyalty program insights</li>
            <li>🏨 Hotel booking strategies</li>
            <li>🎯 Point maximization techniques</li>
          </ul>
        </div>
        
        <p>We'll send you carefully curated content to help you maximize your travel rewards and get the most value from your points and miles.</p>
        
        <p>Have any questions? Just reply to this email - we'd love to hear from you!</p>
        
        <p style="margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://maxyourpoints.com'}" class="button">Visit Max Your Points</a>
        </p>
      </div>
      
      <div class="footer">
        <p>You're receiving this because you subscribed to Max Your Points newsletter.</p>
        <p>Email: ${email}</p>
        <p><a href="${unsubscribeUrl}" style="color: #14b8a6;">Unsubscribe</a> | <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://maxyourpoints.com'}/privacy-policy" style="color: #14b8a6;">Privacy Policy</a></p>
        <p>Max Your Points Team<br>Making every point count!</p>
      </div>
    </body>
    </html>
    `
  }

  private getSubscriptionConfirmationText(email: string): string {
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://maxyourpoints.com'}/unsubscribe`
    
    return `
Welcome to Max Your Points! 🎉

Thank you for subscribing to our newsletter. We're thrilled to have you on board!

What you can expect:
- Exclusive travel tips and strategies
- Best credit card deals and offers  
- Airline loyalty program insights
- Hotel booking strategies
- Point maximization techniques

We'll send you carefully curated content to help you maximize your travel rewards and get the most value from your points and miles.

Have any questions? Just reply to this email - we'd love to hear from you!

Visit us: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://maxyourpoints.com'}

You're receiving this because you subscribed to Max Your Points newsletter.
Email: ${email}
Unsubscribe: ${unsubscribeUrl}
Privacy Policy: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://maxyourpoints.com'}/privacy-policy

Max Your Points Team
Making every point count!
    `
  }
}

// Create singleton instance
let mailgunService: MailgunService | null = null

export function getMailgunService(): MailgunService {
  if (!mailgunService) {
    const apiKey = process.env.MAILGUN_API_KEY
    const domain = process.env.MAILGUN_DOMAIN

    if (!apiKey || !domain) {
      throw new Error('Missing required Mailgun configuration. Please set MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables.')
    }

    mailgunService = new MailgunService({
      apiKey,
      domain
    })
  }

  return mailgunService
} 