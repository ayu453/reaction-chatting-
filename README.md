# Afterglow — chat, with a twist

A frontend-first messaging prototype built around a **hybrid reaction engine**.

## Run it
Open `index.html` in a browser. No build step is required. To run the engine tests, use Node.js 18+ with `node --test reaction-engine.test.js reaction-visuals.test.js`.

## What's in this first prototype
- Responsive three-panel chat interface with a contacts list, conversation and reaction rail.
- Local demo conversations and message composer.
- A standalone local-first hybrid reaction engine with weighted context matching and a curated, media-ready reaction catalog.
- An original CSS-based visual reaction renderer with eight themed animated scenes and generated reaction cards (no external meme/song assets required).
- A media slot contract for ambient visuals, animations, meme cards, audio and short video, plus a non-intrusive media status panel and explicit tap-to-play audio hook.
- Automated Node.js tests for reaction matching, fallback behavior, deterministic scoring and visual scene mapping.
- Reactions appear in the dedicated ambient panel and reaction feed — never on top of message bubbles.
- Mobile contacts drawer and friend filtering.

## Hybrid engine plan
1. **Local understanding:** fast, private keyword/context heuristics for common moments.
2. **Curated library:** choose an appropriate visual/audio/meme reaction from approved assets.
3. **AI assist (later):** optional server-side interpretation for nuanced context; not called for every message.

## Current limitations
- This is a UI prototype. Messages are held in browser memory and reset on refresh.
- No database, authentication, real friend requests, cross-device sync, or real-time transport is connected yet.
- AI assist and licensed media files are not connected yet. The catalog and UI now support media slots, but the slots remain empty until approved assets are added. Audio never auto-plays; it requires a user tap.

## Next milestones
1. Refine the reaction library and background presentation.
2. Add friend discovery and profile flows.
3. Add real-time messaging and persistence when explicitly approved.
4. Add optional AI-assisted interpretation with privacy and cost controls.
