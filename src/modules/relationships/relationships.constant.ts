export const RelationshipUserStatuses = {
  like: 'like',
  unlike: 'unlike',
  cancel: 'cancel',
  block: 'block',
} as const;

export type RelationshipUserStatus =
  (typeof RelationshipUserStatuses)[keyof typeof RelationshipUserStatuses];
