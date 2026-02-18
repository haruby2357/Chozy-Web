import { useState } from "react";
import FeedEtcSheet from "./FeedEtcSheet";
import type { UiFeedUser } from "../../../api/domains/community/feedDetail";
import dummyProfile from "../../../assets/all/dummyProfile.svg";

type FollowStatus = "FOLLOWING" | "REQUESTED" | "NOT_FOLLOWING" | string;

type Props = {
  feedId: number;
  user: UiFeedUser;
  isMine: boolean;

  isFollowing: boolean;
  followStatus?: FollowStatus;

  onToggleFollow: () => void;
  etcIcon: string;
};

export default function FeedHeader({
  feedId,
  isMine,
  user,
  isFollowing,
  followStatus,
  onToggleFollow,
  etcIcon,
}: Props) {
  const [openEtc, setOpenEtc] = useState(false);

  const isRequested = followStatus === "REQUESTED";
  const followingLike = isFollowing || isRequested;
  const buttonText = followingLike
    ? isRequested
      ? "요청중"
      : "팔로우 중"
    : "팔로우";

  return (
    <>
      <div className="flex flex-row justify-between items-center px-3 py-4">
        <div className="flex flex-row gap-[8px]">
          <img
            src={user.profileImg ?? dummyProfile}
            alt="프로필"
            className="w-10 h-10 rounded-[40px] border border-[#F9F9F9]"
          />
          <div className="flex flex-col gap-[2px]">
            <span className="text-[#191919] text-[14px] font-medium">
              {user.userName}
            </span>
            <span className="text-[#B5B5B5] text-[12px]">@{user.userId}</span>
          </div>
        </div>

        <div className="flex flex-row gap-[8px]">
          {!isMine && (
            <button
              type="button"
              onClick={onToggleFollow}
              className={
                followingLike
                  ? "flex items-center justify-center px-2 py-1 bg-white w-20 h-7 rounded-[40px] text-[14px] text-[#787878] border border-[#DADADA]"
                  : "flex items-center justify-center px-2 py-1 bg-[#800025] w-14 h-7 rounded-[40px] text-[14px] text-[#FFF]"
              }
            >
              {buttonText}
            </button>
          )}

          <button type="button" onClick={() => setOpenEtc(true)}>
            <img src={etcIcon} alt="더보기" />
          </button>
        </div>
      </div>

      <FeedEtcSheet
        open={openEtc}
        onClose={() => setOpenEtc(false)}
        isMine={isMine}
        feedId={feedId}
        authorUserPk={user.userPk}
      />
    </>
  );
}
