
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    const { accountName, bankName, sortCode, accountNumber } = await req.json()

    // Simple encryption for demo purposes - in production, use proper encryption libraries
    const encryptText = (text: string): string => {
      if (!text) return text;
      return btoa(text); // Base64 encoding for demo - use AES or similar in production
    }

    const encryptedData = {
      accountName: encryptText(accountName),
      bankName: encryptText(bankName),
      sortCode: encryptText(sortCode),
      accountNumber: encryptText(accountNumber)
    }

    return new Response(
      JSON.stringify(encryptedData),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})
