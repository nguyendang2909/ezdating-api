export const ORelationshipUserStatus = {
  like: 'like',
  unlike: 'unlike',
  cancel: 'cancel',
} as const;

export type RelationshipUserStatus =
  (typeof ORelationshipUserStatus)[keyof typeof ORelationshipUserStatus];
