
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'npm:resend@2.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationEmailRequest {
  to: string
  type: 'new_message' | 'offer_response' | 'transaction_update' | 'ticket_available'
  data: {
    userName?: string
    eventName?: string
    ticketTitle?: string
    messagePreview?: string
    offerAmount?: number
    status?: string
  }
}

const getEmailTemplate = (type: string, data: any) => {
  const baseStyle = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <div style="background-color: #dc2626; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">SocialDealr</h1>
        <p style="color: white; margin: 5px 0 0 0; font-size: 14px;">Your University Ticket Marketplace</p>
      </div>
      <div style="padding: 30px 20px;">
  `

  const footer = `
      </div>
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
        <p>This email was sent by SocialDealr. If you no longer wish to receive these notifications, you can update your preferences in your account settings.</p>
        <p>© 2024 SocialDealr. All rights reserved.</p>
      </div>
    </div>
  `

  switch (type) {
    case 'new_message':
      return baseStyle + `
        <h2 style="color: #1f2937; margin-bottom: 20px;">You have a new message!</h2>
        <p style="color: #4b5563; line-height: 1.6;">Hi ${data.userName || 'there'},</p>
        <p style="color: #4b5563; line-height: 1.6;">You have received a new message about <strong>${data.ticketTitle}</strong>.</p>
        <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
          <p style="color: #374151; margin: 0; font-style: italic;">"${data.messagePreview}"</p>
        </div>
        <a href="${Deno.env.get('SITE_URL')}/messages" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">View Message</a>
      ` + footer

    case 'offer_response':
      return baseStyle + `
        <h2 style="color: #1f2937; margin-bottom: 20px;">Response to your offer</h2>
        <p style="color: #4b5563; line-height: 1.6;">Hi ${data.userName || 'there'},</p>
        <p style="color: #4b5563; line-height: 1.6;">The seller has responded to your £${data.offerAmount} offer for <strong>${data.ticketTitle}</strong>.</p>
        <a href="${Deno.env.get('SITE_URL')}/messages" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">View Response</a>
      ` + footer

    case 'transaction_update':
      return baseStyle + `
        <h2 style="color: #1f2937; margin-bottom: 20px;">Transaction Update</h2>
        <p style="color: #4b5563; line-height: 1.6;">Hi ${data.userName || 'there'},</p>
        <p style="color: #4b5563; line-height: 1.6;">Your transaction for <strong>${data.ticketTitle}</strong> has been updated.</p>
        <p style="color: #4b5563; line-height: 1.6;">Status: <strong>${data.status}</strong></p>
        <a href="${Deno.env.get('SITE_URL')}/my-tickets" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">View Details</a>
      ` + footer

    case 'ticket_available':
      return baseStyle + `
        <h2 style="color: #1f2937; margin-bottom: 20px;">Ticket Alert!</h2>
        <p style="color: #4b5563; line-height: 1.6;">Hi ${data.userName || 'there'},</p>
        <p style="color: #4b5563; line-height: 1.6;">Great news! A ticket for <strong>${data.eventName}</strong> is now available.</p>
        <a href="${Deno.env.get('SITE_URL')}/events" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">View Tickets</a>
      ` + footer

    default:
      return baseStyle + `
        <h2 style="color: #1f2937; margin-bottom: 20px;">Notification from SocialDealr</h2>
        <p style="color: #4b5563; line-height: 1.6;">You have a new notification on SocialDealr.</p>
        <a href="${Deno.env.get('SITE_URL')}" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">Visit SocialDealr</a>
      ` + footer
  }
}

const getSubject = (type: string, data: any) => {
  switch (type) {
    case 'new_message':
      return 'New message on SocialDealr'
    case 'offer_response':
      return 'Response to your offer - SocialDealr'
    case 'transaction_update':
      return 'Transaction update - SocialDealr'
    case 'ticket_available':
      return `${data.eventName} tickets available - SocialDealr`
    default:
      return 'Notification from SocialDealr'
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, type, data }: NotificationEmailRequest = await req.json()

    const emailResponse = await resend.emails.send({
      from: 'SocialDealr <noreply@socialdealr.com>',
      to: [to],
      subject: getSubject(type, data),
      html: getEmailTemplate(type, data),
    })

    console.log('Notification email sent successfully:', emailResponse)

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    })
  } catch (error: any) {
    console.error('Error sending notification email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
