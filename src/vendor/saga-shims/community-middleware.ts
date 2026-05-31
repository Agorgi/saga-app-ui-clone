// Wireframe shim for @saga/community-middleware.
//
// The real package carries the community domain's shared types and contracts.
// The UI clone only needs the CommunityMemberRole enum so CommunityRoleBadge
// can render the "Owner" / "Mod" chips with the exact same source code.
//
// NOTE: the numeric values below are a documented stand-in. The source-of-truth
// enum lives in the private monorepo (packages/, not vendored into this clone).
// CommunityRoleBadge only relies on ordering (MEMBER < MODERATOR < ADMIN) for
// its `role >= MODERATOR` guard and on ADMIN / MODERATOR being distinct keys for
// its config lookup, so these illustrative values are sufficient for a wireframe.
// If this clone is ever wired to real data, replace these with the real enum.
export enum CommunityMemberRole {
  MEMBER = 0,
  MODERATOR = 1,
  ADMIN = 2,
}
