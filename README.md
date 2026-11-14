# Word Ladder

A 3D word-ladder race. Everyone gets the same start word and target word and the same clock;
change one letter at a time, every correct word scores, faster scores more.

Plain static site: `index.html` plus `qrcode.js`. No build step.

## Deploy to Vercel

1. Put this folder in a GitHub repo (or run `npx vercel` inside it).
2. In Vercel: **Add New > Project**, import the repo, framework preset **Other**, no build command,
   output directory left as the repo root.
3. Deploy. Solo mode works straight away.

## Switch on "play together" (join codes and QR)

On your own hosting the game talks to other players through Supabase Realtime presence.

1. Create a free project at supabase.com.
2. Copy the **Project URL** and the **publishable (anon) key** from the project's API settings.
3. Paste them into the small config block near the bottom of `index.html`:

   ```html
   window.WORD_LADDER = { supabaseUrl: 'https://YOUR-PROJECT.supabase.co', supabaseKey: 'YOUR-PUBLISHABLE-KEY' };
   ```

4. In the Supabase dashboard, Realtime > Settings, keep **Allow public access** on. The game uses
   public presence channels named `wl-<game code>`; it stores nothing in the database.
5. Redeploy.

The publishable key is meant to be public. Do not paste the service-role key.

## How a game runs

- The host picks rounds, seconds per round and a first word, and gets a six-digit code.
- Players join by typing the code, scanning the lobby QR code, or opening the copied link
  (`https://your-site/#join-123456`).
- Each device shares only its own name, colour, score and "done" flag. The host's device also
  shares the round, the two words and the seconds left, and runs the clock.
- Scoring: 100 per correct word, up to +100 for speed, and 300 + 10 per second left for reaching the target.

## Known limits

- Scores are counted on each player's device, so they can be faked by someone determined.
- If the host closes the page, the game ends for everyone.
- The Supabase connection was written against the documented API but has not been run against a live project yet.
