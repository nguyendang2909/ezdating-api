export enum EContactStatus {
  // blocked = 'blocked',
  rejected = 'rejected',
  cancelled = 'cancelled',
  pending = 'pending',
  accepted = 'accepted',
}

export const contactStatusRules: Record<
  'me' | 'other',
  Record<EContactStatus, EContactStatus[]>
> = {
  me: {
    [EContactStatus.accepted]: [EContactStatus.cancelled],
    [EContactStatus.pending]: [EContactStatus.cancelled],
    [EContactStatus.cancelled]: [EContactStatus.pending],
    [EContactStatus.rejected]: [EContactStatus.pending],
  },
  other: {
    [EContactStatus.accepted]: [EContactStatus.cancelled],
    [EContactStatus.pending]: [
      EContactStatus.accepted,
      EContactStatus.rejected,
    ],
    [EContactStatus.cancelled]: [EContactStatus.pending],
    [EContactStatus.rejected]: [EContactStatus.pending],
  },
};
