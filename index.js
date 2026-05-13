#!/usr/bin/env node

const robot = require("robotjs");
const lyrics = require("./lyrics");

// ── Configuration ──────────────────────────────────────────────
const INTERVAL = parseInt(process.env.INTERVAL) || 3000; // ms between steps
const SPEED    = parseInt(process.env.SPEED)    || 10;  // robotjs speed
let index = 0;

robot.setMouseDelay(0);
robot.setMouseDelay(2);

// ── Helpers ────────────────────────────────────────────────────
function screenCenter() {
  const { width, height } = robot.getScreenSize();
  return { x: Math.floor(width / 2), y: Math.floor(height / 2) };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/** Random jumps within the screen */
function* randomPattern() {
  const { width, height } = robot.getScreenSize();
  while (true) {
    yield {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
  }
}

// ── Main ───────────────────────────────────────────────────────
const generator = randomPattern();
console.log(`▶️  Now playing: Bring Me To Life - Evanescence`);

const { width, height } = robot.getScreenSize();

const timer = setInterval(() => {
  const { x, y } = generator.next().value;
  robot.moveMouse(clamp(x, 0, width - 1), clamp(y, 0, height - 1));
  console.log(lyrics[index]);
  if (index === lyrics.length - 1) {
    index = 0;
  } else {
    index++;
  }
}, INTERVAL);

process.on("SIGINT", () => {
  clearInterval(timer);
  console.log("⏹️  Stopping... Goodbye! 👋 ");
  process.exit(0);
});