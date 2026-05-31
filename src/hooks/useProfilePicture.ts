// Wireframe: there is no backend, so a user's profile picture is never fetched.
// Avatar falls back to a deterministic placeholder when this returns undefined.
// The userId param is kept to mirror the production hook signature so callers
// (ProfilePictureIcon) stay verbatim.
export function useProfilePicture(_userId: string | undefined): string | undefined {
  return undefined;
}
