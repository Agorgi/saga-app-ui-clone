import { type WireCrewMember, wireCrew } from '@/data/fixtures';
import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';

interface CrewContextValue {
  crew: WireCrewMember[];
  isSaved: (id: string) => boolean;
  toggleSaved: (member: WireCrewMember) => void;
}

const CrewContext = createContext<CrewContextValue | null>(null);

// Wireframe: an in-memory crew store seeded from the fixture. Saving an applicant
// from the host review adds them here, and the /crew page reads from the same
// store, so the loop is convincing within a session. No persistence (resets on
// reload), which is fine for a clickable prototype.
export function CrewProvider({ children }: { children: ReactNode }) {
  const [crew, setCrew] = useState<WireCrewMember[]>(() => wireCrew);

  const value = useMemo<CrewContextValue>(
    () => ({
      crew,
      isSaved: (id) => crew.some((m) => m.id === id),
      toggleSaved: (member) =>
        setCrew((prev) =>
          prev.some((m) => m.id === member.id)
            ? prev.filter((m) => m.id !== member.id)
            : [member, ...prev],
        ),
    }),
    [crew],
  );

  return <CrewContext.Provider value={value}>{children}</CrewContext.Provider>;
}

export function useCrew(): CrewContextValue {
  const ctx = useContext(CrewContext);
  if (!ctx) {
    throw new Error('useCrew must be used within a CrewProvider');
  }
  return ctx;
}
