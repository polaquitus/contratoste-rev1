// Environment configuration
// Uses Vite environment variables in production
// For local dev, you can hardcode values or create a .env file

const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const config = {
  supabase: {
    // Try env vars first, fallback to hardcoded for local dev
    url: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) 
      || 'https://wxqvuahipuxezprbuwxh.supabase.co',
    anonKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY)
      || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4cXZ1YWhpcHV4ZXpwcmJ1d3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NTAzOTksImV4cCI6MjA1MzIyNjM5OX0.0IG88KwjhkZBt3CsEqoGX2pxQRDDtGNkAzEW45WXyEw'
  },
  anthropic: {
    apiKey: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ANTHROPIC_API_KEY)
      || (isDev ? 'sk-ant-api03-GcEwq76wYaIX_PMwZu4bPfF0Qfvs2lJG8sjw43D8N5jmDpX03L-8WxUJqBYY8Y5Vy83RDUCBRaTEuTWdRJPRAA-0cIVswAA' : '')
  },
  app: {
    name: 'Contratos TA',
    version: '2.0.0'
  }
};
