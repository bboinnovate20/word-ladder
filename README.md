# Word Ladder

A 3D word-ladder race. Each round shows one word, and everyone races to change one letter to make
a new real word before the clock runs out. Faster correct answers score more, and the fastest
player's word becomes the next round's word.

Plain static site: `index.html`, `words.js` (the dictionary), `qrcode.js`, and `api/config.js`
(optional, reads Supabase keys on Vercel). No build step.

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

- The host picks the number of rounds (5, 10 or any number), seconds per word (10, 15 or 20),
  the word length (3 to 7 letters), and a first word (a suggestion or any real word they type).
  They get a six-digit code.
- Players join by typing the code, scanning the lobby QR code, or opening the copied link
  (`https://your-site/#join-123456`).
- Each round everyone changes one letter of the same word. A word already used in this game
  doesn't count.
- Scoring: a correct word is worth 1000 points the moment the round opens, draining to 200 as the
  clock runs down. Missing the clock scores nothing and resets your streak. Answering several rounds
  in a row adds +100, +200 or +300 on top.
- After each round a leaderboard shows the change (for example HARD -> LARD) and who was fastest.
  Their word starts the next round. If nobody answers, the same word stays.
- Solo mode plays the same rules against two robot players.

## Dictionary

`words.js` holds about 45,000 words of 3 to 7 letters, from the `wordlist-english` (SCOWL) and
`word-list` packages, with swear words and slurs removed. "Everyday" words (the most common ones)
are used for suggestions and robot moves; players may type any word in the full list.

## Known limits

- Scores are counted on each player's device, so they can be faked by someone determined.
- If the host closes the page, the game ends for everyone.
- The Supabase connection was written against the documented API but has not yet been run against a live project.
