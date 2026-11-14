# Word Ladder

A 3D word-ladder game. Everyone starts from the same word, then each player builds their own chain
one letter at a time (HARD -> CARD -> CARE ...). Every word change is a round with its own clock:
change a letter before the clock runs out for a point; if the clock wins, that round's point is lost.
The clock resets for every new word.

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

## Two game types

- **Beat the clock:** timed rounds, described below.
- **Reach a goal word:** a first word and a goal word (HARD -> SOFT, or any pair that can be
  joined one letter at a time). No timer. Each move says whether you got closer, the goal letters
  turn green on the board as they fall into place, and the hint points to a move that gets closer.
  Fewest steps wins; the end screen shows the fewest possible. Two players on one device take turns
  and reach the goal together. Online, everyone races on their own chain: finishers rank by fewest
  steps, then who finished first; the host can end the game early with **End game**.

## How a timed game runs

- Three ways to play: **Host** (others join with a code or QR), **Play here, 1 player** (beat your
  best score, saved on the device), or **Play here, 2 players** (take turns on one device on a
  shared chain; player 1 is the yellow glove, player 2 the blue one).
- The host picks the number of rounds (5, 10, any number, or no limit), seconds per word (10, 15 or 20),
  the word length (3 to 7 letters), and a first word (a suggestion or any real word they type).
  They get a six-digit code.
- Players join by typing the code, scanning the lobby QR code, or opening the copied link
  (`https://your-site/#join-123456`).
- Each player plays at their own pace from the shared first word. Each round they change one
  letter of their current word to make a real word they haven't used yet; the clock then resets for
  the next word.
- Scoring: 1 point for each change made in time. Speed doesn't matter as long as it's in time.
  A round where the clock runs out scores nothing, and the player carries on from the same word.
- If a player's word can't be changed into any unused real word, the game gives them a fresh word
  and says so.
- When everyone has finished all their rounds, the podium shows the final points (ties share a place).
- No limit (the infinity button): keep going until your word can't be changed into an unused
  word, or the timer runs out 3 times in a row.

## Dictionary

`words.js` holds about 45,000 words of 3 to 7 letters, from the `wordlist-english` (SCOWL) and
`word-list` packages, with swear words and slurs removed. "Everyday" words (the most common ones)
are used for suggestions and robot moves; players may type any word in the full list.

## Known limits

- Scores are counted on each player's device, so they can be faked by someone determined.
- If the host closes the page, the game ends for everyone.
- The Supabase connection was written against the documented API but has not yet been run against a live project.
