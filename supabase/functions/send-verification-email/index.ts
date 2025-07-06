
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@2.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    const wh = new Webhook(hookSecret)
    
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string
        user_metadata?: any
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
      }
    }

    const userName = user.user_metadata?.full_name || 'there'

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <div style="background-color: #dc2626; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">SocialDealr</h1>
          <p style="color: white; margin: 5px 0 0 0; font-size: 14px;">Your University Ticket Marketplace</p>
        </div>
        <div style="padding: 30px 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to SocialDealr!</h2>
          <p style="color: #4b5563; line-height: 1.6;">Hi ${userName},</p>
          <p style="color: #4b5563; line-height: 1.6;">Thank you for joining SocialDealr, the trusted ticket marketplace for university students. To complete your registration, please verify your email address.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <p style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">Your 6-digit verification code:</p>
            <div style="background-color: #dc2626; color: white; padding: 15px 25px; font-size: 24px; font-weight: bold; letter-spacing: 3px; border-radius: 6px; display: inline-block;">${token}</div>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">Enter this code on the verification page to activate your account. This code will expire in 10 minutes.</p>
          
          <p style="color: #4b5563; line-height: 1.6; margin-top: 30px;">Once verified, you'll be able to:</p>
          <ul style="color: #4b5563; line-height: 1.8; padding-left: 20px;">
            <li>Buy tickets safely from verified students</li>
            <li>Sell your spare tickets easily</li>
            <li>Connect with students from your university</li>
            <li>Avoid the hassle of Facebook groups and WhatsApp</li>
          </ul>
        </div>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p>If you didn't create an account with SocialDealr, you can safely ignore this email.</p>
          <p>© 2024 SocialDealr. All rights reserved.</p>
        </div>
      </div>
    `

    const { error } = await resend.emails.send({
      from: 'SocialDealr <noreply@socialdealr.com>',
      to: [user.email],
      subject: 'Verify your SocialDealr account',
      html: emailTemplate,
    })

    if (error) {
      throw error
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error sending verification email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
