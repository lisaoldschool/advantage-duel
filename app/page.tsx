"use client";

import { useCallback, useEffect, useState } from "react";
import { ADVANTAGES } from "@/lib/advantages-data";
import { DUEL_COUNT } from "@/lib/advantages";
import DuelGame from "@/components/DuelGame";
import Lobby from "@/components/Lobby";
import { Trophy, Leaderboard } from "@/components/Screens";

type ResultsPayload = {
  rows: { id: number; name: string; category: string; wins: number }[];
  totalVotes: number;
  founders: { founder: string; finished: boolean; count: number }[];
};

type Screen = "lobby" | "duel" | "trophy" | "peek";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("lobby");
  const [founderName, setFounderName] = useState<string | null>(null);
  const [saving, setSaving] = useState<"saving" | "ok" | "err" | null>(null);
  const [payload, setPayload] = useState<ResultsPayload | null>(null);
  const [lastVotes, setLastVotes] = useState<Record<string, number>>({});

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch("/api/results", { cache: "no-store" });
      if (res.ok) setPayload((await res.json()) as ResultsPayload);
    } catch {}
  }, []);

  useEffect(() => {
    const q = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("founder") : null;
    if (q) {
      setFounderName(q.trim().slice(0, 20));
      setScreen("duel");
    }
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    if (screen !== "peek") return;
    fetchResults();
    const t = setInterval(fetchResults, 5000);
    return () => clearInterval(t);
  }, [screen, fetchResults]);

  const top3For = (votes: Record<string, number>): number[] => {
    const wins: Record<number, number> = {};
    for (const w of Object.values(votes)) wins[w] = (wins[w] || 0) + 1;
    return Object.entries(wins)
      .sort((x, y) => y[1] - x[1] || Number(x[0]) - Number(y[0]))
      .slice(0, 3)
      .map(([id]) => Number(id));
  };

  const userTopThree = top3For(lastVotes);

  const submitVotes = async (votes: Record<string, number>) => {
    if (!founderName) return;
    setSaving("saving");
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ founder: founderName, votes }),
      });
      if (res.ok) {
        setSaving("ok");
        fetchResults();
      } else {
        setSaving("err");
      }
    } catch {
      setSaving("err");
    }
    setTimeout(() => setSaving(null), 1500);
    setScreen("trophy");
  };

  return (
    <>
      {screen === "lobby" && (
        <Lobby
          onStart={(name) => {
            setFounderName(name);
            setScreen("duel");
          }}
          onPeek={() => setScreen("peek")}
        />
      )}

      {screen === "duel" && founderName && (
        <DuelGame
          founderName={founderName}
          onDone={(votes) => {
            setLastVotes(votes);
            submitVotes(votes);
            setFounderName(founderName);
          }}
        />
      )}

      {screen === "duel" && !founderName && (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-400">Loading your duel pit...</p>
        </div>
      )}

      {screen === "trophy" && founderName && (
        <>
          <Trophy
            founderName={founderName}
            top3={userTopThree}
            onHome={() => setScreen("lobby")}
            onPeek={() => setScreen("peek")}
          />
          {saving === "saving" && (
            <p className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-battle-ink px-4 py-2 text-xs font-semibold text-white shadow-lg">
              Saving your duels...
            </p>
          )}
          {saving === "ok" && (
            <p className="animate-pop-cards fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
              All {DUEL_COUNT} results saved!
            </p>
          )}
          {saving === "err" && (
            <p className="animate-pop-cards fixed bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
              Save failed. Reach out and we&apos;ll sort it.
            </p>
          )}
        </>
      )}

      {screen === "peek" && <Leaderboard payload={payload} onHome={() => setScreen("lobby")} />}
    </>
  );
}
