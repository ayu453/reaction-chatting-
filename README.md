# Afterglow — chat, with a twist

A frontend-first messaging prototype built around a **hybrid reaction engine**.

## Run it
Open `index.html` in a browser, or deploy the repository as a static site (for example, on Vercel). No build step is required.

## What's in this first prototype
- Responsive three-panel chat interface with a contacts list, conversation and reaction rail.
- Local demo conversations and message composer.
- Local context rules that detect themes and tone, then select from a small curated reaction library.
- Reactions appear in the dedicated ambient panel and reaction feed — never on top of message bubbles.
- Mobile contacts drawer and friend filtering.

## Hybrid engine plan
1. **Local understanding:** fast, private keyword/context heuristics for common moments.
2. **Curated library:** choose an appropriate visual/audio/meme reaction from approved assets.
3. **AI assist (later):** optional server-side interpretation for nuanced context; not called for every message.

## Current limitations
- This is a UI prototype. Messages are held in browser memory and reset on refresh.
- No database, authentication, real friend requests, cross-device sync, or real-time transport is connected yet.
- The AI assist and real media asset library are not connected. The current engine uses local rules and emoji/ambient visual treatments as placeholders.

## Next milestones
1. Refine the reaction library and background presentation.
2. Add friend discovery and profile flows.
3. Add real-time messaging and persistence when explicitly approved.
4. Add optional AI-assisted interpretation with privacy and cost controls.
