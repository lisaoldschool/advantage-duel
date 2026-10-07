"use client";

import { useState } from "react";
import { ADVANTAGES } from "@/lib/advantages-data";
import { DUEL_COUNT } from "@/lib/advantages";

/* ---------------- Personal trophy screen ---------------- */

const CONFETTI = ["🎉", "🏆", "⚔️", "✨", "🎊", "💛"];

export function Trophy({
  founderName,
  top3,
  onHome,
  onPeek,
}: {
  founderName: string;
  top3: number[];
  onHome: () => void;
  onPeek: () => void;
}) {
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 py-12 text-center">
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className="animate-confetti pointer-events-none absolute text-2xl"
          style={{ left: `${8 + i * 14}%`, animationDelay: `${i * 180}ms` }}
        >
          {c}
        </span>
      ))}
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-pink-500">
        All {DUEL_COUNT} duels settled
      </p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-battle-ink sm:text-5xl">
        Your top 3, {founderName}
      </h1>
      <p className="mt-2 text-base text-gray-500">Champion energy. The scoreboard is waiting.</p>

      <div className="mt-8 flex w-full flex-col gap-4">
        {top3.map((id, i) => (
          <div
            key={id}
            className={`flex items-center gap-4 rounded-3xl border p-6 text-left shadow-sm ${
              i === 0
                ? "border-yellow-300 bg-yellow-50"
                : i === 1
                  ? "border-gray-200 bg-white"
                  : "border-orange-200 bg-orange-50"
            }`}
          >
            <span className="text-4xl">{medals[i]}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                #{i + 1} overall
              </p>
              <h3 className="text-lg font-bold text-battle-ink">{ADVANTAGES[id].name}</h3>
              <p className="mt-1 text-sm text-gray-500">{ADVANTAGES[id].def}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <button
          onClick={onPeek}
          className="rounded-full bg-battle-pink px-6 py-3 font-semibold text-white transition hover:scale-105 hover:bg-pink-600"
        >
          See the combined leaderboard
        </button>
        <button
          onClick={onHome}
          className="rounded-full bg-gray-100 px-6 py-3 font-semibold text-battle-ink transition hover:bg-gray-200"
        >
          Back to the start
        </button>
      </div>
    </div>
  );
}

/* ---------------- Combined leaderboard ---------------- */

type ResultsPayload = {
  rows: { id: number; name: string; category: string; wins: number }[];
  totalVotes: number;
  founders: { founder: string; finished: boolean; count: number }[];
};

const PODIUM_STYLES = [
  { height: "h-32", bg: "bg-gradient-to-t from-yellow-300 to-yellow-200", medal: "🥇" },
  { height: "h-24", bg: "bg-gradient-to-t from-gray-200 to-gray-100", medal: "🥈" },
  { height: "h-16", bg: "bg-gradient-to-t from-orange-200 to-orange-100", medal: "🥉" },
];

const REASONS: Record<string, string> = {
  "Network Effects or Product Virality":
    "Every new user makes the product better. Growth compounds instead of costing more.",
  "Free Plan or Trial":
    "Free users become proof. The funnel fills itself and upgrades happen inside the product.",
  "Wedge Into a Larger Market":
    "Start with a team that loves you, expand with their help. Concentric growth with a built-in referral engine.",
  "Integrations / Co-marketing":
    "Partner with products our audience already trusts and multiply reach without building an audience from zero.",
  "Channel Partnerships & Sales":
    "Turn the ecosystem into a salesforce. Partners sell because it pays them to.",
  "Forcing Function: Trends or Regulations":
    "When the market is already looking, being the answer at the exact moment of need is priceless.",
  "Audience Seeks Community or Educational Content":
    "Own the place our audience already gathers and trust arrives before the pitch.",
  "Founder Story or Founder/Market Fit":
    "The founders are the message. When the story is real, distribution follows.",
  "Ability to Create or Own a Category":
    "Name the category and the category names us. The market comes looking.",
};

function linkedInPost(top3: { id: number; name: string; category: string; wins: number }[]) {
  const podium = top3.slice(0, 3);
  const lines = [
    "We asked our founders to settle a debate: which marketing advantages actually matter most at Obvious?",
    "",
    "No committees. No decks. Just 36 head to head duels. May the best advantage win.",
    "",
  ];
  const medals = ["🥇", "🥈", "🥉"];
  podium.forEach((a, i) => {
    lines.push(`${medals[i]} ${i + 1}. ${a.name}`);
    lines.push(`   ${REASONS[a.name] || ""}`);
    lines.push("");
  });
  lines.push("Huge credit to the team who turned these levers into real distribution. More duels coming soon.");
  lines.push("");
  lines.push("What would YOUR top advantage be? Drop it in the comments 👇");
  return lines.join("\n");
}

export function Leaderboard({
  payload,
  onHome,
}: {
  payload: ResultsPayload | null;
  onHome: () => void;
}) {
  const [copied, setCopied] = useState<"post" | null>(null);
  const top3 = payload?.rows.slice(0, 3) || [];
  const rest = payload?.rows.slice(3) || [];
  const engaged = payload?.founders.filter((f) => f.count > 0).length || 0;
  const podiumOrder = [1, 0, 2];

  const copyPost = async () => {
    const text = linkedInPost(payload?.rows || []);
    try {
      await navigator.clipboard.writeText(text);
      setCopied("post");
      setTimeout(() => setCopied(null), 2200);
    } catch {}
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10">
      <div className="text-center">
        <div className="mb-1 text-5xl">🏆</div>
        <h1 className="text-3xl font-extrabold tracking-tight text-battle-ink sm:text-4xl">
          {engaged > 0 ? `Obvious's top advantages (from ${engaged} ${engaged === 1 ? "voter" : "voters"})` : "The scoreboard awaits"}
        </h1>
        <p className="mt-2 text-sm text-gray-500">Live results. Updates as votes come in.</p>
      </div>

      {(!payload || top3.length === 0) && (
        <div className="mt-10 rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-2xl">🥊</p>
          <p className="mt-3 font-semibold text-battle-ink">No duels settled yet.</p>
          <p className="mt-1 text-sm text-gray-500">
            Be the first: Jon and David each run their 36 duels, and this leaderboard fills in live.
          </p>
          <button
            onClick={onHome}
            className="mt-5 rounded-full bg-battle-pink px-6 py-2.5 font-semibold text-white transition hover:bg-pink-600"
          >
            Start dueling
          </button>
        </div>
      )}

      {payload && top3.length > 0 && (
        <div className="mt-8">
          <div className="flex items-end justify-center gap-2 sm:gap-4">
            {podiumOrder.map((rankIdx) => {
              const adv = top3[rankIdx];
              if (!adv) return <div key={rankIdx} className="flex-1" />;
              const style = PODIUM_STYLES[rankIdx];
              return (
                <div key={rankIdx} className="flex w-full flex-col items-center justify-end">
                  <span className="mb-1 text-2xl">{style.medal}</span>
                  <div
                    className={`w-full rounded-t-2xl border border-gray-200 bg-white p-3 text-center shadow-sm ${style.height}`}
                  >
                    <p className="text-sm font-bold leading-tight text-battle-ink">{adv.name}</p>
                    <p className="mt-1 text-xs text-gray-400">{adv.wins} wins</p>
                  </div>
                  <div className={`w-full ${style.bg} rounded-b-sm`} />
                </div>
              );
            })}
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            {rest.map((row, i) => (
              <div
                key={row.id}
                className="flex items-center gap-3 border-b border-gray-100 px-5 py-3 last:border-b-0"
              >
                <span className="w-6 text-sm font-bold text-gray-300">{i + 4}</span>
                <span className="flex-1 text-sm font-medium text-battle-ink">{row.name}</span>
                <span className="text-xs text-gray-400">{row.wins} wins</span>
              </div>
            ))}
          </div>

          {payload.founders.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {payload.founders.map((f) => (
                <span
                  key={f.founder}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    f.finished
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-gray-200 bg-gray-50 text-gray-500"
                  }`}
                >
                  {f.finished ? "✅" : "⏳"} {f.founder}: {f.count}/{DUEL_COUNT}
                </span>
              ))}
            </div>
          )}

          {engaged > 0 && top3.length >= 3 && (
            <div className="mt-8 rounded-3xl border border-violet-200 bg-violet-50 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-battle-ink">LinkedIn post, ready to fly</p>
                  <p className="text-xs text-gray-500">
                    Announce the winners. One click to copy, paste into LinkedIn.
                  </p>
                </div>
                <button
                  onClick={copyPost}
                  className="shrink-0 rounded-full bg-violet-600 px-5 py-2.5 font-semibold text-white transition hover:scale-105 hover:bg-violet-700"
                >
                  {copied === "post" ? "Copied! ✨" : "Generate post"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-10 text-center">
        <button
          onClick={onHome}
          className="text-sm font-medium text-gray-400 underline decoration-dashed underline-offset-4 transition hover:text-pink-500"
        >
          Head back to the duels
        </button>
      </div>
    </div>
  );
}
