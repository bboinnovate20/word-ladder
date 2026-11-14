// Vercel serverless function: hands the game the two PUBLIC Supabase values stored in
// Project Settings > Environment Variables. Only the URL and the publishable (anon) key are sent;
// never put the secret / service_role key in these variables.
module.exports = (req, res) => {
  const env = process.env;
  const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY ||
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=60');
  const url = supabaseUrl.trim();
  const key = supabaseKey.trim();
  res.status(200).send(JSON.stringify({
    supabaseUrl: url || false,
    supabaseKey: key || false
  }));
};
