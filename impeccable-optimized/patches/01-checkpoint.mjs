#!/usr/bin/env node
/**
 * Patch 1 — Gate enforcement script for craft (and other multi-gate flows).
 *
 * Converts the disciplinary warning in craft.md ("Compressing gates 2 through 4
 * because the shape brief felt complete is the dominant failure mode of this
 * flow") into a mechanical check that fails fast.
 *
 * Stores state in .impeccable/gates/<command>.json so the LLM cannot bypass
 * it by claiming success — the harness sees a non-zero exit code and the
 * model has to STOP.
 *
 * Place at: scripts/checkpoint.mjs
 *
 * Usage:
 *   node scripts/checkpoint.mjs --gate=2 --status=confirmed [--command=craft]
 *   node scripts/checkpoint.mjs --check --gate=4 [--command=craft]
 *   node scripts/checkpoint.mjs --reset [--command=craft]
 *
 * Exit codes:
 *   0 = OK (gate marked / check passed)
 *   1 = trying to advance past an unconfirmed prior gate
 *   2 = invalid arguments
 *   3 = state file unreadable / corrupted
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import process from "node:process";

const args = parseArgs(process.argv.slice(2));
const command = args.command ?? "craft";
const stateDir = resolve(process.cwd(), ".impeccable", "gates");
const statePath = join(stateDir, `${command}.json`);

// Per-command gate definitions. Extend here when other multi-gate commands need enforcement.
const GATE_DEFINITIONS = {
  craft: [
    { id: 1, name: "shape-brief-confirmed",      requires: [] },
    { id: 2, name: "direction-questions-answered", requires: [1] },
    { id: 3, name: "palette-confirmed",          requires: [1, 2] },
    { id: 4, name: "mock-direction-approved",    requires: [1, 2, 3] },
  ],
  // Add other multi-gate commands here as they emerge:
  // teach: [...]
  // document: [...]
};

if (!GATE_DEFINITIONS[command]) {
  console.error(`No gate definition for command: ${command}`);
  console.error(`Defined: ${Object.keys(GATE_DEFINITIONS).join(", ")}`);
  process.exit(2);
}

ensureDir(stateDir);

if (args.reset) {
  writeFileSync(statePath, JSON.stringify({ command, gates: {} }, null, 2));
  console.log(`Reset gates for ${command}`);
  process.exit(0);
}

const state = loadState();

if (args.check) {
  const gateId = Number(args.gate);
  if (!Number.isInteger(gateId) || gateId < 1) {
    console.error("--check requires --gate=<n>");
    process.exit(2);
  }
  const def = GATE_DEFINITIONS[command].find((g) => g.id === gateId);
  if (!def) {
    console.error(`No gate ${gateId} defined for ${command}`);
    process.exit(2);
  }
  const missing = def.requires.filter((req) => state.gates[req] !== "confirmed");
  if (missing.length > 0) {
    console.error(
      `Cannot proceed to gate ${gateId} (${def.name}). ` +
      `Prior gates unconfirmed: ${missing.join(", ")}. ` +
      `Run: node scripts/checkpoint.mjs --gate=<n> --status=confirmed`
    );
    process.exit(1);
  }
  console.log(`OK — gate ${gateId} (${def.name}) is reachable`);
  process.exit(0);
}

if (args.gate && args.status) {
  const gateId = Number(args.gate);
  const def = GATE_DEFINITIONS[command].find((g) => g.id === gateId);
  if (!def) {
    console.error(`No gate ${gateId} defined for ${command}`);
    process.exit(2);
  }
  if (args.status !== "confirmed" && args.status !== "pending") {
    console.error(`--status must be 'confirmed' or 'pending'`);
    process.exit(2);
  }
  const missing = def.requires.filter((req) => state.gates[req] !== "confirmed");
  if (args.status === "confirmed" && missing.length > 0) {
    console.error(
      `Cannot confirm gate ${gateId} (${def.name}) — ` +
      `prior gates unconfirmed: ${missing.join(", ")}`
    );
    process.exit(1);
  }
  state.gates[gateId] = args.status;
  state.updatedAt = new Date().toISOString();
  writeFileSync(statePath, JSON.stringify(state, null, 2));
  console.log(`Gate ${gateId} (${def.name}) → ${args.status}`);
  process.exit(0);
}

console.error(
  "Usage:\n" +
  "  --gate=<n> --status=<confirmed|pending> [--command=<name>]\n" +
  "  --check --gate=<n> [--command=<name>]\n" +
  "  --reset [--command=<name>]"
);
process.exit(2);

// ─── helpers ────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const out = {};
  for (const arg of argv) {
    if (arg === "--check" || arg === "--reset") {
      out[arg.slice(2)] = true;
    } else if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      if (eq > 0) out[arg.slice(2, eq)] = arg.slice(eq + 1);
      else out[arg.slice(2)] = true;
    }
  }
  return out;
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  // also create a .gitignore so gate state doesn't pollute commits
  const gi = join(dirname(dir), ".gitignore");
  if (!existsSync(gi)) writeFileSync(gi, "gates/\n");
}

function loadState() {
  if (!existsSync(statePath)) {
    return { command, gates: {}, createdAt: new Date().toISOString() };
  }
  try {
    return JSON.parse(readFileSync(statePath, "utf8"));
  } catch {
    console.error(`Corrupted state at ${statePath} — resetting`);
    return { command, gates: {}, createdAt: new Date().toISOString() };
  }
}
