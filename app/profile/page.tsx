"use client";

import { AppShell } from "@/components/AppShell";
import { SoftCard } from "@/components/ui/SoftCard";
import type { Profile } from "@/lib/types";

export default function ProfilePage() {
  return (
    <AppShell>
      {({ profile }) => <ProfileContent profile={profile} />}
    </AppShell>
  );
}

function ProfileContent({ profile }: { profile: Profile }) {
  return (
    <main className="mx-auto w-full max-w-content px-margin-mobile py-stack-lg md:px-margin-desktop">
      <h1 className="font-display text-display text-on-surface mb-stack-md">Profile</h1>
      <SoftCard className="space-y-4">
        <p className="font-body-lg">
          <span className="font-label-lg text-on-surface-variant">Name:</span> {profile.name}
        </p>
        <p className="font-body-lg">
          <span className="font-label-lg text-on-surface-variant">Buddy:</span> {profile.pet_name}
        </p>
        <p className="font-body-lg">
          <span className="font-label-lg text-on-surface-variant">Streak:</span> 🔥 {profile.streak} days
        </p>
        {profile.birthdate ? (
          <p className="font-body-md text-on-surface-variant">Birthday: {profile.birthdate}</p>
        ) : null}
      </SoftCard>
    </main>
  );
}
