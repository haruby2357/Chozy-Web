import { useEffect, useState } from "react";
import EmptyNotifications from "./EmptyNotifications";
import FollowRequestRow from "./FollowRequestRow";

import {
  getMyFollowRequests,
  processFollowRequest,
} from "../../api/domains/follow/request";
import type { FollowRequestItem } from "../../api/domains/follow/request";

async function acceptFollowRequest(requestId: number) {
  console.log("accept requestId:", requestId);
  return { code: 1000 };
}

export default function FollowRequestList() {
  console.log("FollowRequestList mounted");
  const [items, setItems] = useState<FollowRequestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyFollowRequests({ page: 0, size: 20 });

      if (data.code !== 1000) {
        setItems([]);
        return;
      }

      setItems(data.result.items ?? []);
    } catch (e) {
      console.error(e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onAccept = async (requestId: number) => {
    setAcceptingId(requestId);
    try {
      const res = await processFollowRequest(requestId, "ACCEPT");
      if (!res.success) throw new Error(res.message ?? "수락 실패");

      setItems((prev) => prev.filter((x) => x.requestId !== requestId));
    } catch (e) {
      console.error(e);
    } finally {
      setAcceptingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-[#B5B5B5] text-[14px]">불러오는 중...</span>
      </div>
    );
  }

  if (items.length === 0) return <EmptyNotifications />;

  return (
    <div className="flex-1 bg-white">
      {items.map((it) => (
        <div key={it.requestId} className="border-b border-[#F2F2F2]">
          <FollowRequestRow
            profileImageUrl={it.fromUser.profileImageUrl}
            nickname={it.fromUser.nickname}
            loginId={it.fromUser.loginId}
            onAccept={() => onAccept(it.requestId)}
            loading={acceptingId === it.requestId}
          />
        </div>
      ))}
    </div>
  );
}
