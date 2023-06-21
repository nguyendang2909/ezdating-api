export const ORelationshipUserStatus = {
  like: 1,
  unlike: 0,
} as const;

export type RelationshipUserStatus =
  (typeof ORelationshipUserStatus)[keyof typeof ORelationshipUserStatus];
