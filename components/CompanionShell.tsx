import { CharacterSprite } from "./CharacterSprite";
import type { CharacterState } from "@/lib/types";

interface CompanionShellProps {
  spriteState: CharacterState;
  speech: string;
  children?: React.ReactNode;
}

export function CompanionShell({
  spriteState,
  speech,
  children,
}: CompanionShellProps) {
  return (
    <div className="flex w-full flex-col items-center gap-6 rounded-card border border-surface-container-high/40 bg-surface-container-lowest p-stack-md soft-shadow">
      <CharacterSprite state={spriteState} />
      <p className="max-w-md text-center font-body-lg text-body-lg leading-relaxed text-on-surface">
        {speech}
      </p>
      {children ? <div className="w-full">{children}</div> : null}
    </div>
  );
}
