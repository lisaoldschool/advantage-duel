import { promises as fs } from "fs";
import { join } from "path";
import type { FounderRecord } from "./types";
import { ADVANTAGES } from "./advantages-data";

const BLOB_PATH = "results.json";
const LOCAL_PATH = join(process.cwd(), ".votes", "results.json");

function getToken(): string | null {
  return process.env.BLOB_READ_WRITE_TOKEN || null;
}

export async function loadResults(): Promise<{
  founders: Record<string, FounderRecord>;
}> {
  const token = getToken();
  if (!token) {
    try {
      const raw = await fs.readFile(LOCAL_PATH, "utf-8");
      return JSON.parse(raw) as { founders: Record<string, FounderRecord> };
    } catch {
      return { founders: {} };
    }
  }
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: BLOB_PATH, token });
    const found = blobs.find((b) => b.pathname === BLOB_PATH);
    if (!found) return { founders: {} };
    const res = await fetch(found.url, { cache: "no-store" });
    if (!res.ok) return { founders: {} };
    return (await res.json()) as { founders: Record<string, FounderRecord> };
  } catch {
    return { founders: {} };
  }
}

export async function saveResults(data: {
  founders: Record<string, FounderRecord>;
}): Promise<void> {
  const token = getToken();
  if (!token) {
    try {
      await fs.mkdir(join(process.cwd(), ".votes"), { recursive: true });
      await fs.writeFile(LOCAL_PATH, JSON.stringify(data), "utf-8");
    } catch {}
    return;
  }
  try {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATH, JSON.stringify(data), {
      access: "public",
      addRandomSuffix: false,
      token,
    });
  } catch {
    return;
  }
}

export function aggregate(data: { founders: Record<string, FounderRecord> }) {
  const counts: Record<number, number> = {};
  const h2h: Record<string, number> = {};
  for (const rec of Object.values(data.founders || {})) {
    for (const [pairKey, winnerId] of Object.entries(rec.votes || {})) {
      const [a, b] = pairKey.split(",").map(Number);
      counts[winnerId] = (counts[winnerId] || 0) + 1;
      h2h[`${winnerId},${a === winnerId ? b : a}`] =
        (h2h[`${winnerId},${a === winnerId ? b : a}`] || 0) + 1;
    }
  }
  const rows = ADVANTAGES.map((a) => ({
    id: a.id,
    name: a.name,
    category: a.category,
    wins: counts[a.id] || 0,
  }));
  rows.sort((x, y) => y.wins - x.wins || x.id - y.id);
  return { rows, h2h, totalVotes: Object.values(data.founders || {}).length };
}
