export type FollowStatus = "FOLLOWING" | "REQUESTED" | "INACTIVE" | "NONE";

export type FollowResponse = {
  targetUserId: number;
  followStatus: FollowStatus;
  processedAt: string;
};

export type UnfollowResponse = {
  targetUserId: number;
  followStatus: FollowStatus;
  unfollowedAt: string | null;
  processedAt: string;
};
