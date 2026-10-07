import { NextResponse } from "next/server";
import { loadResults, aggregate } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const data = await loadResults();
  const agg = aggregate(data);
  const founders = Object.values(data.founders).map((f) => ({
    founder: f.founder,
    finished: f.finished,
    count: Object.keys(f.votes).length,
  }));
  return NextResponse.json({
    rows: agg.rows,
    totalVotes: agg.totalVotes,
    founders,
    h2h: agg.h2h,
  });
}
