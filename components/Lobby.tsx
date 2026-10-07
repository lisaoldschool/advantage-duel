"use client";

import { useState } from "react";

type Props = {
  onStart: (name: string) => void;
  onPeek: () => void;
};

export default function Lobby({ onStart, onPeek }: Props) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Tell us who you are first.");
      return;
    }
    if (trimmed.length > 20) {
      setError("Keep it short, like a duel should be (20 chars max).");
      return;
    }
    onStart(trimmed);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-2 text-5xl">⚔️</div>
      <h1 className="text-4xl font-extrabold tracking-tight text-battle-ink sm:text-5xl">
        Advantage Duel
      </h1>
      <p className="mt-3 text-base leading-relaxed text-gray-500">
        Obvious has 9 marketing advantages. You&apos;ll settle them head to head in{" "}
        <span className="font-semibold text-battle-ink">36 quick duels</span>, and
        we&apos;ll crown the company&apos;s top 3 at the end.
      </p>

      <div className="mt-8 flex w-full flex-col items-center gap-2 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
          Who&apos;s dueling?
        </p>
        <div className="mt-1 flex w-full gap-2">
          <button
            onClick={() => onStart("Jon")}
            className="flex-1 rounded-full bg-battle-ink px-5 py-3 font-semibold text-white transition hover:bg-black hover:scale-105"
          >
            I&apos;m Jon
          </button>
          <button
            onClick={() => onStart("David")}
            className="flex-1 rounded-full bg-battle-pink px-5 py-3 font-semibold text-white transition hover:bg-pink-600 hover:scale-105"
          >
            I&apos;m David
          </button>
        </div>
        <div className="mt-3 flex w-full items-center gap-2">
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Or type a name..."
            maxLength={20}
            className="w-full flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-center outline-none placeholder:text-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
          />
          <button
            onClick={submit}
            className="shrink-0 rounded-2xl bg-gray-100 px-5 py-3 font-semibold text-battle-ink transition hover:bg-gray-200"
          >
            Go
          </button>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>

      <button
        onClick={onPeek}
        className="mt-6 text-sm font-medium text-gray-400 underline decoration-dashed underline-offset-4 transition hover:text-pink-500"
      >
        Just here to peek at the scoreboard?
      </button>
      <p className="mt-2 text-xs text-gray-400">
        Votes are saved live. Come back anytime, your progress is safe.
      </p>
    </div>
  );
}
