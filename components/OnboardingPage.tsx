"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppNav } from "@/components/AppNav";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { CharacterSprite } from "@/components/CharacterSprite";
import { updateProfile } from "@/lib/db";
import type { Profile } from "@/lib/types";

interface OnboardingPageProps {
  profile: Profile;
}

export function OnboardingPage({ profile }: OnboardingPageProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [petName, setPetName] = useState("Cloudy");
  const [birthdate, setBirthdate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("What should I call you?");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateProfile(profile.id, {
        name: name.trim(),
        pet_name: petName.trim() || "Pulse",
        birthdate: birthdate || null,
      });
      router.push("/today");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <AppNav profile={profile} hideLinks />
      <main className="mx-auto flex w-full max-w-content flex-grow flex-col items-center px-margin-mobile pb-stack-lg pt-24 md:px-margin-desktop md:pt-28">
        <div className="mb-stack-lg animate-bob">
          <CharacterSprite state="happy" />
        </div>
        <div className="mb-stack-lg text-center">
          <h1 className="font-display text-display text-on-surface mb-2">
            Welcome to Pulse{name.trim() ? `, ${name.trim()}` : ""}!
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Let&apos;s set up your cozy wellness space.
          </p>
        </div>
        <div className="soft-shadow w-full max-w-md rounded-card border border-surface-variant/30 bg-surface-container-lowest p-stack-lg">
          <form className="space-y-stack-md" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="mb-2 ml-4 block font-label-lg text-label-lg text-on-surface-variant">
                Your name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Emilio"
                className="w-full rounded-full border-2 border-primary-fixed bg-surface px-6 py-4 font-body-md transition-all focus:border-primary-container focus:ring-4 focus:ring-primary-container/20"
              />
            </div>
            <div>
              <label htmlFor="buddy" className="mb-2 ml-4 block font-label-lg text-label-lg text-on-surface-variant">
                Name your buddy
              </label>
              <input
                id="buddy"
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Cloudy"
                className="w-full rounded-full border-2 border-primary-fixed bg-surface px-6 py-4 font-body-md transition-all focus:border-primary-container focus:ring-4 focus:ring-primary-container/20"
              />
            </div>
            <div>
              <label htmlFor="birthday" className="mb-2 ml-4 block font-label-lg text-label-lg text-on-surface-variant">
                Your birthday
              </label>
              <input
                id="birthday"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full rounded-full border-2 border-primary-fixed bg-surface px-6 py-4 font-body-md"
              />
            </div>
            {error ? <p className="text-sm text-error">{error}</p> : null}
            <PrimaryButton type="submit" fullWidth disabled={saving} className="mt-stack-md">
              {saving ? "Saving…" : "Let's begin →"}
            </PrimaryButton>
          </form>
        </div>
        <div className="mt-stack-lg flex gap-3">
          <div className="h-2 w-12 rounded-full bg-primary" />
          <div className="h-2 w-12 rounded-full bg-surface-variant" />
          <div className="h-2 w-12 rounded-full bg-surface-variant" />
        </div>
      </main>
    </div>
  );
}
