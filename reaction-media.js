/* Media slot contract for Afterglow reactions.
 * Add local, licensed assets by filling src; never auto-play audio.
 */
(function (root) {
  "use strict";
  const media = Object.freeze({
    visual: Object.freeze({ kind: "visual", label: "Ambient visual", autoplay: false }),
    animation: Object.freeze({ kind: "animation", label: "Looping animation", autoplay: false }),
    meme: Object.freeze({ kind: "meme", label: "Meme card", autoplay: false }),
    audio: Object.freeze({ kind: "audio", label: "Sound / song", autoplay: false, requiresUserGesture: true }),
    video: Object.freeze({ kind: "video", label: "Short video", autoplay: false, mutedByDefault: true })
  });
  if (root) root.AfterglowMediaTypes = media;
})(typeof globalThis !== "undefined" ? globalThis : this);
