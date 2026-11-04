const test = require("node:test");
const assert = require("node:assert/strict");
const visuals = require("./reaction-visuals.js");
const engine = require("./reaction-engine.js");

test("every curated reaction maps to a distinct visual scene", () => {
  const themes = engine.catalog.map(item => visuals.buildVisual(item).theme);
  assert.equal(themes.length, engine.catalog.length);
  assert.ok(themes.every(Boolean));
  assert.equal(new Set(themes).size, engine.catalog.length);
});

test("visual cards use curated copy rather than echoing private message text", () => {
  const visual = visuals.buildVisual(engine.classify("I love this secret private detail"));
  assert.equal(visual.theme, "soft");
  assert.equal(visual.caption.includes("secret private detail"), false);
});

test("unknown reactions safely use the fallback scene", () => {
  assert.equal(visuals.buildVisual({ id: "unknown" }).theme, "spark");
});
