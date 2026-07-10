interface MemberSearchUser {
  displayName: string;
  userName: string;
}

export function matchesMemberSearch(user: MemberSearchUser, searchTerm: string): boolean {
  const query = searchTerm.trim().toLowerCase();
  if (!query) return true;

  return (
    user.displayName.toLowerCase().includes(query) || user.userName.toLowerCase().includes(query)
  );
}
