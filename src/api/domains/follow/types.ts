export type FollowStatus = "FOLLOWING" | "REQUESTED" | "NONE";

export type FollowResponse = {
  targetUserId: number;
  followStatus: Exclude<FollowStatus, "NONE">;
  requestId: number | null;
  requestedAt: string | null;
};

export type UnfollowResponse = {
  targetUserId: number;
  followStatus: "NONE";
  canceledRequestId: number | null;
  processedAt: string | null;
};
