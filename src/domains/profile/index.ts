// Wireframe clone: the production barrel also re-exports the profile API helpers
// from `@saga/api-web` (getUserProfile, updateUserProfile, etc.). The clone has
// no backend, so those are dropped — only the UI surface is exported here.

// Context
export { ProfileProvider, useProfile } from './context/ProfileContext';
export { ProfileEditSection } from './sections/ProfileEditSection/ProfileEditSection';
// Sections
export { ProfileHeaderSection } from './sections/ProfileHeaderSection/ProfileHeaderSection';
export type { TabKey } from './sections/ProfileTabsSection/ProfileTabsSection';
export { ProfileTabsSection } from './sections/ProfileTabsSection/ProfileTabsSection';

// UI Components
export { EditableProfilePicture } from './ui/EditableProfilePicture/EditableProfilePicture';
export { ProfileEditForm } from './ui/ProfileEditForm/ProfileEditForm';
export { ProfileHeader } from './ui/ProfileHeader/ProfileHeader';
export { ProfileState } from './ui/ProfileState/ProfileState';
