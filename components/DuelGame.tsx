"use client";

import { useMemo, useState, useEffect } from "react";
import { ADVANTAGES } from "@/lib/advantages-data";
import { DUEL_COUNT } from "@/lib/advantages";

type Props = {
  founderName: string;
  onDone: (votes: Record<string, number>) => void;
};

const TOTAL_DUELS = DUEL_COUNT;

function makePairs(): [number, number][] {
  const pairs: [number, number][] = [];
  for (let i = 0; i < ADVANTAGES.length; i++) {
    for (let j = i + 1; j < ADVANTAGES.length; j++) {
      pairs.push([i, j]);
    }
  }
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Product-led growth": "bg-teal-100 text-teal-800 border-teal-200",
  "Market / Ecosystem": "bg-orange-100 text-orange-800 border-orange-200",
  "Brand / Marketing": "bg-violet-100 text-violet-800 border-violet-200",
  "GTM strategy": "bg-blue-100 text-blue-800 border-blue-200",
  Timing: "bg-yellow-100 text-yellow-900 border-yellow-200",
};

function CategoryBadge({ cat }: { cat: string }) {
  return (
    <span
      className={`inline-block self-start rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${CATEGORY_COLORS[cat] || "bg-gray-100 text-gray-700 border-gray-200"}`}
    >
      {cat}
    </span>
  );
}

export default function DuelGame({ founderName, onDone }: Props) {
  const pairs = useMemo(() => makePairs(), []);
  const [step, setStep] = useState(0);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    if (step >= TOTAL_DUELS) {
      onDone(votes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  if (step >= TOTAL_DUELS) {
    return null;
  }

  const [a, b] = pairs[step];

  const card = (advId: number) => (
    <button
      key={advId}
      onClick={() => {
        setPicked(advId);
        setTimeout(() => {
          setVotes((v) => ({ ...v, [`${a},${b}`]: advId }));
          setPicked(null);
          setStep((s) => s + 1);
        }, 350);
      }}
      className={`flex w-full flex-col gap-4 rounded-3xl border px-6 py-8 text-left transition-all duration-300 sm:px-8 ${
        picked === advId
          ? "animate-burst scale-[1.03] border-pink-400 bg-white shadow-xl"
          : picked !== null
            ? "scale-95 border-gray-100 bg-gray-50 opacity-30"
            : "border-gray-200 bg-white shadow-sm hover:-translate-y-1 hover:border-pink-200 hover:shadow-xl"
      }`}
    >
      <CategoryBadge cat={ADVANTAGES[advId].category} />
      <h3 className="text-xl font-bold leading-snug text-battle-ink sm:text-2xl">
        {ADVANTAGES[advId].name}
      </h3>
      <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
        {ADVANTAGES[advId].def}
      </p>
    </button>
  );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-4 py-8">
      <div key={step} className="animate-pop-cards mb-10 flex w-full max-w-md flex-col items-center gap-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-400">
          {founderName}&apos;s duel pit
        </p>
        <h1 className="text-2xl font-bold text-battle-ink">
          Duel {step + 1} of {TOTAL_DUELS}
        </h1>
        <div className="mt-2 h-2 w-56 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-pink-500 transition-all duration-300"
            style={{ width: `${(step / TOTAL_DUELS) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-sm italic text-gray-400">May the best advantage win.</p>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
        {card(a)}
        {card(b)}
      </div>

      <p className="mt-8 text-sm text-gray-400">{picked ? "Locked in!" : "Which one wins for Obvious?"}</p>
    </div>
  );
}
