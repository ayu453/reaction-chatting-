const test = require("node:test");
const assert = require("node:assert/strict");
const engine = require("./reaction-engine.js");

test("matches clear context to the expected curated reaction", () => {
  assert.equal(engine.classify("Let's go to the beach tomorrow").id, "coastal-daydream");
  assert.equal(engine.classify("I need coffee before we talk").id, "little-cafe");
  assert.equal(engine.classify("HAHA that was hilarious 😂").id, "laughing-hours");
  assert.equal(engine.classify("I am so proud of you").id, "soft-spot");
  assert.equal(engine.classify("I finally beat the last level").id, "victory-lap");
  assert.equal(engine.classify("Send me that playlist").id, "soundtrack");
  assert.equal(engine.classify("Sorry you had such a rough day").id, "comfort");
  assert.equal(engine.classify("That was absolutely amazing").id, "big-yes");
});

test("returns a calm fallback for empty or unrelated messages", () => {
  assert.equal(engine.classify("").id, "little-moment");
  assert.equal(engine.classify("Are you free at six?").id, "little-moment");
});

test("scores are deterministic and bounded", () => {
  const first = engine.scoreReaction("Beach, coffee and music!");
  const second = engine.scoreReaction("Beach, coffee and music!");
  assert.equal(first.reaction.id, second.reaction.id);
  assert.ok(first.confidence >= 0 && first.confidence <= 1);
  assert.ok(first.score > 0);
});

test("does not mutate the curated catalog", () => {
  assert.equal(Object.isFrozen(engine.catalog), true);
  assert.equal(Object.isFrozen(engine.catalog[0]), true);
});
