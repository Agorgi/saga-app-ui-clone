// Neutral placeholder avatars for the wireframe clone.
//
// The vendored Avatar falls back to an external dicebear URL when no avatars
// are supplied. To keep the wireframe free of real/remote images, we feed the
// AvatarProvider a few neutral gray silhouette SVGs (inline data URIs). Avatar
// picks one deterministically per user seed, so the feed shows subtle variety
// while staying obviously a placeholder.

function silhouette(bg: string, fg: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<rect width="100" height="100" fill="${bg}"/>` +
    `<circle cx="50" cy="40" r="16" fill="${fg}"/>` +
    `<path d="M22 84c0-16 12-26 28-26s28 10 28 26z" fill="${fg}"/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const placeholderAvatars: string[] = [
  silhouette('#52525b', '#a1a1aa'),
  silhouette('#3f3f46', '#9ca3af'),
  silhouette('#4b5563', '#9ca3af'),
  silhouette('#44444c', '#a8a8b3'),
];
