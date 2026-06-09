// Open Roles V1: front-end data-shape spec (no backend yet).
//
// A host lists roles they need filled on an event (and, later, an interest
// check), and people apply with a short message. A host with no specific roles
// can still flip "open to crew applications" to take general requests. Saved
// applicants accumulate into the host's crew database. Persistence, the apply
// pipeline, and notifications are future backend work; these shapes back the
// wireframe and are the contract a backend would implement against.

export interface OpenRole {
  id: string;
  title: string;
  count?: number;
  note?: string;
  status?: 'open' | 'filled';
}

export type ApplicationStatus = 'pending' | 'saved' | 'declined';

export interface RoleApplication {
  id: string;
  // null = a general "open to crew" application, not tied to a specific role.
  roleId: string | null;
  applicantName: string;
  applicantHandle: string;
  message: string;
  status: ApplicationStatus;
}

export interface SavedCrewMember {
  id: string;
  name: string;
  handle: string;
  fromRole?: string;
  fromEvent?: string;
  note?: string;
}

export function generateRoleId(): string {
  return `role_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
