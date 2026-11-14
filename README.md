# Word Ladder

A 3D word-ladder race. Everyone gets the same start word and target word and the same clock;
change one letter at a time, every correct word scores, faster scores more.

Plain static site: `index.html` plus `qrcode.js`. No build step.

## Deploy to Vercel

1. Import this repo in Vercel: **Add New > Project**, framework preset **Other**, no build command,
   output directory left as the repo root.
2. Deploy. Every push to `main` redeploys.

Solo and play-together (Host / Join, game code, QR) both work straight away.

## How play-together connects

By default the game uses the free public [PeerJS](https://peerjs.com) service: the host's device is the hub
and players' devices connect straight to it. Nothing to set up, nothing stored anywhere.

Some school, office or hotel networks block direct device-to-device connections. If players there
can't join, switch to Supabase below.

## Optional: Supabase (sturdier connection)

With Supabase, every device talks to Supabase's servers instead of to each other, so it works on
strict networks too. The free plan is enough.

1. Sign up at [supabase.com](https://supabase.com) and create a new project (any name and region;
   pick one near your players, for example London).
2. Open **Project Settings > API Keys** (or the **Connect** button) and copy:
   - the **Project URL**, like `https://abcdefghijkl.supabase.co`
   - the **publishable** key (starts `sb_publishable_`), or the legacy **anon public** key
3. In **Realtime > Settings**, make sure **Allow public access** is on. The game uses public
   presence channels named `wl-<game code>` and stores nothing in the database.
4. In Vercel, open the project's **Settings > Environment Variables** and add:

   | Name | Value |
   | --- | --- |
   | `SUPABASE_URL` | the Project URL |
   | `SUPABASE_PUBLISHABLE_KEY` | the publishable (or anon public) key |

   Tick all environments (Production, Preview, Development).
5. Redeploy (Deployments > ... > Redeploy). New variables only reach new deployments.

`api/config.js` hands those two values to the game. If you host somewhere without serverless
functions, put them in the config block near the bottom of `index.html` instead.

The publishable/anon key is meant to be public, so it is fine in the repo. Never paste the
**secret** or **service_role** key.

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
- The Supabase connection was written against the documented API but has not yet been run against a live project.
