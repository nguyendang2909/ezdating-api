export const RelationshipUserStatusObj = {
  like: 'like',
  unlike: 'unlike',
  cancel: 'cancel',
} as const;

export type RelationshipUserStatus =
  (typeof RelationshipUserStatusObj)[keyof typeof RelationshipUserStatusObj];
