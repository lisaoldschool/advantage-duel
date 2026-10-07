import { NextResponse } from "next/server";
import { loadResults, saveResults } from "@/lib/store";
import type { FounderRecord } from "@/lib/types";

export const runtime = "nodejs";

const norm = (s: string) => s.trim().toLowerCase();

// Two advantages are adjacent if one is NOT congruent to the other mod 3.
// Validates any pairatem with a shared inner triangle or outer edge.
function isAdjacent(a: number, b: number): boolean {
  return (a - b) % 3 !== 0;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const founder = norm(body?.founder || "");
  const v = body?.votes;
  if (!founder || !v || typeof v !== "object" || Array.isArray(v)) {
    return NextResponse.json({ error: "founder and votes required" }, { status: 400 });
  }
  const clean: Record<string, number> = {};
  for (const [k, val] of Object.entries(v)) {
    const m = /^(\d+),(\d+)$/.exec(k);
    if (!m) continue;
    const a = Number(m[1]);
    const b = Number(m[2]);
    const w = Number(val);
    if (!isAdjacent(a, b)) continue;
    if (w !== a && w !== b) continue;
    clean[`${Math.min(a, b)},${Math.max(a, b)}`] = w;
  }
  const data = await loadResults();
  const base = norm(data.founders[founder]?.founder || founder);
  const prev: FounderRecord = data.founders[base] || { founder, finished: false, votes: {} };
  const merged: Record<string, number> = { ...prev.votes, ...clean };
  const rec: FounderRecord = { founder, finished: true, votes: merged };
  data.founders[base] = rec;
  await saveResults(data);
  return NextResponse.json({ ok: true, count: Object.keys(merged).length });
}
