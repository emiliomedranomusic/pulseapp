"use client";

import type { CharacterState } from "@/lib/types";
import { MASCOT_SRC } from "@/lib/pet";
import Image from "next/image";

interface CharacterSpriteProps {
  /** Kept for API compatibility; all states use the same mascot asset. */
  state: CharacterState;
  className?: string;
  /**
   * default — 192px mobile / 256px desktop
   * large   — 240px mobile / 320px desktop (Looking Back hero)
   */
  size?: "default" | "large";
}

const SIZE_CLASS: Record<NonNullable<CharacterSpriteProps["size"]>, string> = {
  default: "h-48 w-48 md:h-64 md:w-64",
  large: "h-60 w-60 md:h-80 md:w-80",
};

export function CharacterSprite({
  state: _state,
  className = "",
  size = "default",
}: CharacterSpriteProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      aria-hidden
    >
      <Image
        src={MASCOT_SRC}
        alt=""
        width={320}
        height={320}
        className={`object-contain ${SIZE_CLASS[size]}`}
        priority
      />
    </div>
  );
}
