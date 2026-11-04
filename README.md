# Afterglow — chat, with a reaction

A browser-first messaging app with a local hybrid reaction engine and Supabase-backed accounts, friends, private messages and Realtime delivery.

## Run it
Open `index.html` from a static web host. The app loads the pinned `@supabase/supabase-js@2.119.0` browser bundle and the project's public publishable key from `supabase-client.js`. No service-role key is used in the browser.

## Current features
- Email and password sign-up/sign-in, profile creation and unique usernames. Email confirmation is intended to be disabled in Supabase Auth settings for immediate access.
- Search registered users by username and send friend requests.
- Accept incoming friend requests; accepted connections appear in the contacts list.
- Private one-to-one message history stored in Supabase Postgres.
- Supabase Realtime delivery for incoming messages and friend-request updates.
- Row Level Security on profiles, friend requests and messages.
- Local-first hybrid reaction matching with eight original CSS-animated visual themes.
- Reaction visuals stay in the dedicated side rail; audio is never autoplayed.
- Responsive three-panel chat UI and mobile contacts drawer.

## Supabase setup
The schema is applied to project `smreuzsuxmgwaihvttpq`. The reproducible SQL is in `supabase/schema.sql`.
Tables:
- `profiles` — public-to-signed-in display name and username only.
- `friend_requests` — pending, accepted and rejected requests.
- `messages` — direct messages between accepted friends.

RLS is enabled on every public table. The browser uses only the publishable key. Never add a Supabase secret/service-role key to this repository.

**Email confirmation setting:** In Supabase Dashboard → Authentication → Providers → Email, turn off **Confirm email** to let new users sign in immediately after signup. The app uses email + password authentication; do not disable password strength or abuse protections.


## Tests
GitHub Actions checks the browser JavaScript syntax and runs the reaction engine/visual tests on pushes to `main` and pull requests. Use Node.js 20+ locally:
```sh
node --check app.js
node --test reaction-engine.test.js reaction-visuals.test.js
```

## Not yet included
- Group chats, attachments, voice/video calls, message edits/deletes, read receipts and push notifications.
- Real licensed meme, GIF, song or video assets; current visual reactions are original CSS scenes.
- Optional server-side AI interpretation. The current reaction engine runs locally and does not send chat text to an AI service.
