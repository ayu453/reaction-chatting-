/* Afterglow Hybrid Reaction Engine
 * Local-first, deterministic and safe to run without a network connection.
 * The catalog is intentionally media-agnostic: assets can be attached later.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AfterglowReactionEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const catalog = [
    { id: "coastal-daydream", patterns: [/\b(sea|ocean|beach|waves|coast|holiday|travel|trip)\b/i], weight: 3, emoji: "🌊", tag: "THE VIBE", title: "Coastal daydream", text: "Somewhere salty, sunny and far away.", feed: "Coastal daydream", why: "Picked up on a little escape", mediaType: "visual", media: [{ kind: "animation", asset: null, fallback: "ambient" }, { kind: "meme", asset: null, fallback: "caption-card" }] },
    { id: "little-cafe", patterns: [/\b(cafe|coffee|tea|toast|bakery|café|espresso)\b/i], weight: 3, emoji: "☕", tag: "THE VIBE", title: "Little café energy", text: "Slow mornings and one more cup.", feed: "Little café energy", why: "A cosy plan is brewing", mediaType: "visual" },
    { id: "laughing-hours", patterns: [/😭|😂|🤣|\b(lol|lmao|haha|hahaha|funny|hilarious|dying)\b/i], weight: 3, emoji: "😭", tag: "THE MOOD", title: "Crying-laughing hours", text: "This conversation has lost all seriousness.", feed: "Crying-laughing hours", why: "Humour detected in the chat", mediaType: "visual" },
    { id: "soft-spot", patterns: [/\b(love|miss you|proud of you|thank you|thanks|appreciate|care about)\b/i, /❤️|💗|🥹/], weight: 3, emoji: "💗", tag: "THE FEELING", title: "Soft spot unlocked", text: "A little warmth goes a long way.", feed: "Soft spot unlocked", why: "A kind moment deserves a glow", mediaType: "visual" },
    { id: "victory-lap", patterns: [/\b(game|level|win|won|beat|score|victory|lets go|let’s go)\b/i, /🏆|🎮/], weight: 3, emoji: "🎮", tag: "THE HYPE", title: "Main character victory", text: "That deserves a tiny victory lap.", feed: "Main character victory", why: "Celebration mode activated", mediaType: "visual" },
    { id: "soundtrack", patterns: [/\b(music|song|playlist|sing|dance|concert|track)\b/i, /🎵|🎶|🎧/], weight: 3, emoji: "🎧", tag: "THE SOUND", title: "Soundtrack moment", text: "Every good conversation needs a track.", feed: "Soundtrack moment", why: "Music energy detected", mediaType: "audio", media: [{ kind: "audio", asset: null, fallback: "audio-placeholder" }, { kind: "visual", asset: null, fallback: "ambient" }] },
    { id: "comfort", patterns: [/\b(sorry|sad|rough|tired|stress|stressed|bad day|exhausted|overwhelmed)\b/i, /😔|😢|🫂/], weight: 3, emoji: "🫶", tag: "THE FEELING", title: "A little comfort", text: "No fixing. Just being here.", feed: "A little comfort", why: "A softer moment in the chat", mediaType: "visual" },
    { id: "big-yes", patterns: [/\b(wow|amazing|incredible|awesome|perfect|fantastic|brilliant)\b/i, /✨|🤩/], weight: 2, emoji: "✨", tag: "THE SPARK", title: "Big yes energy", text: "Some moments deserve extra sparkle.", feed: "Big yes energy", why: "Excitement detected", mediaType: "visual" }
  ];

  catalog.forEach(item => {
    if (!item.media) {
      item.media = item.mediaType === "audio-ready"
        ? [{ kind: "audio", asset: null, fallback: "audio-placeholder" }, { kind: "visual", asset: null, fallback: "ambient" }]
        : [{ kind: "animation", asset: null, fallback: "ambient" }, { kind: "meme", asset: null, fallback: "caption-card" }];
    }
    item.media.forEach(slot => Object.freeze(slot));
    Object.freeze(item.media);
    Object.freeze(item.patterns);
    Object.freeze(item);
  });

  const fallback = { id: "little-moment", emoji: "✨", tag: "THE SPARK", title: "A little moment", text: "Every conversation has its own rhythm.", feed: "A little moment", why: "A new moment in the conversation", mediaType: "visual" };

  function scoreReaction(message) {
    const text = String(message || "").trim();
    if (!text) return { reaction: fallback, score: 0, confidence: 0 };
    const ranked = catalog.map((item, index) => {
      const matches = item.patterns.reduce((total, pattern) => total + (pattern.test(text) ? 1 : 0), 0);
      return { item, index, score: matches * item.weight };
    }).filter(entry => entry.score > 0).sort((a, b) => b.score - a.score || a.index - b.index);
    if (!ranked.length) return { reaction: fallback, score: 0, confidence: 0 };
    const best = ranked[0];
    const second = ranked[1];
    const confidence = Math.min(1, best.score / (best.score + (second ? second.score : 0) + 1));
    return { reaction: best.item, score: best.score, confidence };
  }

  function classify(message) {
    return scoreReaction(message).reaction;
  }

  return Object.freeze({ catalog: Object.freeze(catalog), fallback: Object.freeze(fallback), classify, scoreReaction });
});
