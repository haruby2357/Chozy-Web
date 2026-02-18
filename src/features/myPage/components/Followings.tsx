import { useEffect, useState } from "react";
import DetailHeader from "../../../components/DetailHeader";
import FollowTabBar from "./followings/FollowTabBar";
import type { FollowTabKey } from "./followings/FollowTabBar";

import FollowAccount from "./followings/FollowAccount"; // 경로 맞게 수정
import type { FollowStatus } from "./followings/FollowAccount";

import type { FollowUser } from "../../../api/domains/follow/list/types";
import {
  getMyFollowers,
  getMyFollowings,
} from "../../../api/domains/follow/list/api";

type Props = {
  userId: string;
  defaultTab: FollowTabKey; // "followings" | "followers"
};

type ToastState = { text: string; icon?: string } | null;

export default function Followings({ userId, defaultTab }: Props) {
  const [tab, setTab] = useState<FollowTabKey>(defaultTab);

  const [items, setItems] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (text: string, icon?: string) => {
    setToast({ text, icon });
    window.setTimeout(() => setToast(null), 2000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res =
        tab === "followings"
          ? await getMyFollowings({ page: 0, size: 30 })
          : await getMyFollowers({ page: 0, size: 30 });

      setItems(res.result.items ?? []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleChanged = (
    pk: number,
    patch: { isFollowingByMe: boolean; myFollowStatus?: FollowStatus },
  ) => {
    setItems((prev) => {
      // ✅ 팔로잉 탭에서 언팔(또는 요청취소) 성공하면 즉시 목록에서 제거
      if (
        tab === "followings" &&
        patch.isFollowingByMe === false &&
        patch.myFollowStatus !== "REQUESTED"
      ) {
        // REQUESTED는 원래 followings 탭에 거의 안 나오지만 혹시 섞이면 유지/업데이트로 처리해도 됨
        return prev.filter((x) => x.userPk !== pk);
      }

      return prev.map((x) =>
        x.userPk === pk
          ? {
              ...x,
              isFollowingByMe: patch.isFollowingByMe,
              myFollowStatus: patch.myFollowStatus ?? x.myFollowStatus,
            }
          : x,
      );
    });

    // (선택) 서버와 완전 동기화하고 싶으면 여기서 load() 호출해도 됨
    // load();
  };

  return (
    <div className="relative min-h-screen bg-white">
      <DetailHeader title={`@${userId}`} />
      <FollowTabBar value={tab} onChange={setTab} />

      {loading ? (
        <div className="px-4 py-6 text-[#787878]">로딩중...</div>
      ) : items.length === 0 ? (
        <div className="px-4 py-10 text-center text-[#B5B5B5]">
          목록이 없어요.
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[#F2F2F2]">
          {items.map((u) => (
            <FollowAccount
              key={u.userPk}
              variant={tab}
              userPk={u.userPk}
              name={u.nickname}
              userID={`@${u.loginId}`}
              profileImage={u.profileImg}
              isFollowingByMe={u.isFollowingByMe}
              isFollowingMe={u.isFollowingMe}
              myFollowStatus={u.myFollowStatus}
              onChanged={handleChanged}
              showToast={showToast}
            />
          ))}
        </div>
      )}

      {toast && (
        <div className="absolute inset-x-0 bottom-[84px] z-50 px-4">
          <div className="mx-auto w-full">
            <div className="h-12 rounded-[4px] bg-[#787878] px-4 flex items-center gap-[10px]">
              {toast.icon && (
                <img src={toast.icon} alt="" className="w-5 h-5 shrink-0" />
              )}
              <span className="text-[16px] text-white">{toast.text}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
