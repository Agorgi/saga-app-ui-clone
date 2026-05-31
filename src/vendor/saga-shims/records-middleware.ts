// Wireframe shim for @saga/records-middleware.
//
// The real package defines the shared record domain types (Post, PostContent,
// PostContentType, RecordType, ...) used across backend and web. The UI clone
// renders placeholder `WirePost` data instead, so it does not need those full
// types. It only needs the `RecordType` discriminant and the `POST` constant
// that the action buttons accept for parity with the real call sites — these
// are passed through but never drive logic in the clone (there is no API).
//
// NOTE: the string values here are a documented stand-in for the real enum,
// which lives in the private monorepo (packages/, not vendored here).
export type RecordType = 'post' | 'comment' | 'event' | 'community';

export const POST: RecordType = 'post';
