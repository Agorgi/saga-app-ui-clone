// Wireframe shim for @saga/events-middleware.
//
// The real package is a shared backend/web contract: event domain enums, types,
// and validation constants. The clone's event-creation UI only references the
// field-length caps and the personnel-role enum, so that's all this stubs.
// The caps below are placeholder limits — they drive maxLength attributes and
// the description character counter, nothing more. No validation, no backend.

export const EVENT_NAME_MAX_LENGTH = 100;
export const EVENT_DESCRIPTION_MAX_LENGTH = 2000;

export const EVENT_PERSONNEL_ROLE = {
  CO_HOST: 'CO_HOST',
  STAFF: 'STAFF',
} as const;

export type EventPersonnelRole = (typeof EVENT_PERSONNEL_ROLE)[keyof typeof EVENT_PERSONNEL_ROLE];
