
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
    const { pdfUrl, eventName, eventDate, fileName, selectedPages } = await req.json()

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

    // Extract QR code information and estimate page count
    const qrCodeHash = extractQRCodeHash(pdfText)
    const estimatedPages = estimatePageCount(pdfText)
    
    if (!qrCodeHash) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "No QR code or ticket identifier found in the PDF" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate selected pages against estimated pages
    if (selectedPages > estimatedPages) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `You selected ${selectedPages} tickets but the PDF appears to contain only ${estimatedPages} page(s)` 
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

    // Check if event name matches
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

    // Check if event date matches (if we can extract it)
    const extractedDate = extractDateFromPdf(pdfText)
    if (extractedDate && eventDate) {
      const eventDateObj = new Date(eventDate)
      const extractedDateObj = new Date(extractedDate)
      
      // Allow for some tolerance (same day)
      const timeDiff = Math.abs(eventDateObj.getTime() - extractedDateObj.getTime())
      const dayDiff = timeDiff / (1000 * 3600 * 24)
      
      if (dayDiff > 1) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `The date on your ticket (${extractedDate}) doesn't match the event date (${eventDate.split('T')[0]})` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        qrCodeHash,
        totalPages: estimatedPages,
        selectedPages,
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

// Improved PDF text extraction
async function extractTextFromPdf(pdfBuffer: ArrayBuffer): Promise<string> {
  const uint8Array = new Uint8Array(pdfBuffer)
  const text = new TextDecoder().decode(uint8Array)
  
  // Extract readable text between stream objects and other text indicators
  const textPatterns = [
    /BT\s+(.*?)\s+ET/gs,
    /\((.*?)\)/g,
    /\[(.*?)\]/g
  ]
  
  let extractedText = ''
  for (const pattern of textPatterns) {
    const matches = text.match(pattern) || []
    extractedText += matches.join(' ')
  }
  
  return extractedText.replace(/[^\w\s\-\/:\.]/g, ' ').trim()
}

// Estimate page count based on page markers in PDF
function estimatePageCount(text: string): number {
  // Look for common page indicators in PDF structure
  const pageMarkers = [
    /\/Type\s*\/Page/g,
    /\/Page\b/g,
    /\/Count\s+(\d+)/g
  ]
  
  let maxCount = 1
  
  for (const marker of pageMarkers) {
    const matches = text.match(marker)
    if (matches) {
      if (marker.source.includes('Count')) {
        const countMatch = text.match(/\/Count\s+(\d+)/)
        if (countMatch) {
          maxCount = Math.max(maxCount, parseInt(countMatch[1]))
        }
      } else {
        maxCount = Math.max(maxCount, matches.length)
      }
    }
  }
  
  // Cap at reasonable number and ensure minimum of 1
  return Math.min(Math.max(maxCount, 1), 10)
}

// Extract date from PDF text
function extractDateFromPdf(text: string): string | null {
  const datePatterns = [
    /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/g, // DD/MM/YYYY or MM/DD/YYYY
    /(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/g, // YYYY/MM/DD
    /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/gi, // DD Mon YYYY
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})/gi // Mon DD, YYYY
  ]
  
  for (const pattern of datePatterns) {
    const matches = text.match(pattern)
    if (matches && matches.length > 0) {
      // Return the first date found
      return matches[0]
    }
  }
  
  return null
}

// Improved QR code hash extraction
function extractQRCodeHash(text: string): string | null {
  const qrPatterns = [
    /[A-Z0-9]{12,}/g, // Alphanumeric strings (12+ chars)
    /[a-f0-9]{16,}/g, // Hex strings (16+ chars)
    /[A-Za-z0-9+/]{24,}/g, // Base64-like strings (24+ chars)
    /\b[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}\b/g // UUID format
  ]
  
  for (const pattern of qrPatterns) {
    const matches = text.match(pattern)
    if (matches && matches.length > 0) {
      // Return the longest substantial match as QR code hash
      const longestMatch = matches.reduce((longest, current) => 
        current.length > longest.length ? current : longest
      )
      if (longestMatch.length >= 10) {
        return longestMatch.substring(0, 50) // Limit length
      }
    }
  }
  
  return null
}
