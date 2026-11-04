/* Afterglow visual reaction renderer model.
 * Generates lightweight, original CSS-based reaction scenes without external assets.
 * No message text is copied into the visual, keeping private chat content out of display cards.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AfterglowVisuals = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const scenes = Object.freeze({
    "coastal-daydream": { theme: "coast", sticker: "🌊", headline: "MENTALLY, WE'RE HERE", caption: "Somewhere salty. Somewhere sunny. Nowhere near the inbox.", stamp: "OUT OF OFFICE" },
    "little-cafe": { theme: "cafe", sticker: "☕", headline: "THE LITTLE CAFÉ CLUB", caption: "One more cup, one more story, absolutely no rush.", stamp: "SLOW MORNING" },
    "laughing-hours": { theme: "laugh", sticker: "😭", headline: "I CAN'T WITH YOU", caption: "The conversation has officially left the group chat.", stamp: "SEND HELP" },
    "soft-spot": { theme: "soft", sticker: "💗", headline: "A SOFT LITTLE MOMENT", caption: "Consider this your reminder that you are appreciated.", stamp: "WARM FUZZIES" },
    "victory-lap": { theme: "victory", sticker: "🏆", headline: "ABSOLUTE LEGEND", caption: "The comeback. The plot twist. The victory lap.", stamp: "YOU DID THAT" },
    "soundtrack": { theme: "sound", sticker: "🎧", headline: "THIS NEEDS A SOUNDTRACK", caption: "Main-character scene. Headphones highly recommended.", stamp: "ON REPEAT" },
    "comfort": { theme: "comfort", sticker: "🫶", headline: "A LITTLE GENTLE REMINDER", caption: "You don't have to solve everything right now.", stamp: "HERE WITH YOU" },
    "big-yes": { theme: "spark", sticker: "✨", headline: "THAT'S THE ENERGY", caption: "A tiny moment deserves a very big sparkle.", stamp: "BIG YES" },
    "little-moment": { theme: "spark", sticker: "✳️", headline: "A LITTLE MOMENT", caption: "Every conversation has its own kind of magic.", stamp: "AFTERGLOW" }
  });
  function buildVisual(reaction) {
    const scene = scenes[reaction && reaction.id] || scenes["little-moment"];
    return Object.freeze({ ...scene, title: reaction && reaction.title ? String(reaction.title) : "A little moment" });
  }
  return Object.freeze({ buildVisual, scenes });
});
