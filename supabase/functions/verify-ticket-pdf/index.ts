
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { pdfUrl, eventName, fileName } = await req.json()

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Download the PDF file
    const pdfResponse = await fetch(pdfUrl)
    if (!pdfResponse.ok) {
      throw new Error('Failed to download PDF')
    }

    const pdfBuffer = await pdfResponse.arrayBuffer()
    const pdfText = await extractTextFromPdf(pdfBuffer)

    // Extract QR code information (simplified - in production you'd use a proper QR code library)
    const qrCodeHash = extractQRCodeHash(pdfText)
    
    if (!qrCodeHash) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "No QR code found in the PDF" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if QR code already exists
    const { data: existingTicket } = await supabase
      .from('tickets')
      .select('id')
      .eq('qr_code_hash', qrCodeHash)
      .single()

    if (existingTicket) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "This ticket has already been uploaded" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if event name matches (simplified text matching)
    const eventKeywords = eventName.toLowerCase().split(' ')
    const pdfTextLower = pdfText.toLowerCase()
    const hasEventMatch = eventKeywords.some(keyword => 
      keyword.length > 2 && pdfTextLower.includes(keyword)
    )

    if (!hasEventMatch) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "The uploaded ticket doesn't appear to match the selected event" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        qrCodeHash,
        message: "Ticket verified successfully" 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || "Failed to verify ticket" 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Simplified PDF text extraction (in production, use a proper PDF parsing library)
async function extractTextFromPdf(pdfBuffer: ArrayBuffer): Promise<string> {
  // This is a simplified implementation
  // In production, you would use a library like pdf-parse or similar
  const uint8Array = new Uint8Array(pdfBuffer)
  const text = new TextDecoder().decode(uint8Array)
  
  // Extract readable text between stream objects
  const textRegex = /BT\s+(.*?)\s+ET/gs
  const matches = text.match(textRegex) || []
  
  return matches.join(' ').replace(/[^\w\s]/g, ' ').trim()
}

// Simplified QR code hash extraction (in production, use proper QR code detection)
function extractQRCodeHash(text: string): string | null {
  // Look for patterns that might be QR code data
  const qrPatterns = [
    /[A-Z0-9]{10,}/g, // Alphanumeric strings
    /[a-f0-9]{32,}/g, // Hex strings
    /[A-Za-z0-9+/]{20,}/g // Base64-like strings
  ]
  
  for (const pattern of qrPatterns) {
    const matches = text.match(pattern)
    if (matches && matches.length > 0) {
      // Return the first substantial match as QR code hash
      const match = matches.find(m => m.length >= 10)
      if (match) {
        return match.substring(0, 50) // Limit length
      }
    }
  }
  
  return null
}
