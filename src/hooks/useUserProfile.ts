// Wireframe clone: production fetches a user's profile (display name + handle) by id.
// Here there is no backend, so we return a deterministic placeholder. Callers fall back
// to the raw id when this is undefined; we always return a value so cards show a name.
// Signature mirrors the production hook so callers stay verbatim.
export interface UserProfileSummary {
  displayName?: string;
  userName?: string;
}

export function useUserProfile(_userId: string | undefined): UserProfileSummary | undefined {
  return { displayName: 'Creator name', userName: 'creator' };
}
