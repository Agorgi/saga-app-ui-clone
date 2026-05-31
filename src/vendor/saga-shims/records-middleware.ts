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

// Wireframe stand-ins for the post-content union the real package exports. The
// real types carry uploaded asset ids/urls and Quill Delta ops; the clone's
// post-creation flow only moves local preview strings (object URLs, plain text)
// between steps. Names mirror the production types so the section components
// read identically to app-web; the shapes are simplified for the no-backend clone.
export type RichTextContent = { type: 'richText'; text: string };
export type ImageContent = { type: 'image'; images: string[]; description: string };
export type VideoContent = {
  type: 'video';
  video: string;
  previewImage?: string;
  description: string;
};
export type PostContentUpload = RichTextContent | ImageContent | VideoContent;

// Minimal Post stand-in for collab/parent-post references in the create flow.
export type Post = { id: string; name: string };
