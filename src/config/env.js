// Environment configuration
// In production, move these to .env files and use a build tool like Vite
export const config = {
  supabase: {
    url: 'https://wxqvuahipuxezprbuwxh.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4cXZ1YWhpcHV4ZXpwcmJ1d3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2NTAzOTksImV4cCI6MjA1MzIyNjM5OX0.0IG88KwjhkZBt3CsEqoGX2pxQRDDtGNkAzEW45WXyEw'
  },
  anthropic: {
    apiKey: 'sk-ant-api03-GcEwq76wYaIX_PMwZu4bPfF0Qfvs2lJG8sjw43D8N5jmDpX03L-8WxUJqBYY8Y5Vy83RDUCBRaTEuTWdRJPRAA-0cIVswAA'
  },
  app: {
    name: 'Contratos TA',
    version: '2.0.0'
  }
};
