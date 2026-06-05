"use client";

import type { CharacterState } from "@/lib/types";
import Image from "next/image";
import { useState } from "react";

const STATE_EMOJI: Record<CharacterState, string> = {
  idle: "🐣",
  happy: "🌟",
  content: "😊",
  sleepy: "😴",
  sad: "🥺",
  celebrating: "✨",
  activity: "💪",
};

interface CharacterSpriteProps {
  state: CharacterState;
  className?: string;
}

export function CharacterSprite({ state, className = "" }: CharacterSpriteProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = `/pet/${state}.png`;

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      aria-hidden
    >
      {!imgFailed ? (
        <Image
          src={src}
          alt=""
          width={160}
          height={160}
          className="animate-bob h-40 w-40 object-contain"
          onError={() => setImgFailed(true)}
          priority
        />
      ) : (
        <span className="animate-bob text-8xl leading-none" role="img">
          {STATE_EMOJI[state]}
        </span>
      )}
    </div>
  );
}
