import { useState } from "react";
import DetailHeader from "../../../components/DetailHeader";
import FollowTabBar from "./followings/FollowTabBar";
import type { FollowTabKey } from "./followings/FollowTabBar";

type Props = {
  userId: string;
  defaultTab: FollowTabKey;
};

export default function Followings({ userId, defaultTab }: Props) {
  const [tab, setTab] = useState<FollowTabKey>(defaultTab);

  return (
    <>
      <DetailHeader title={`@${userId}`} />
      <FollowTabBar value={tab} onChange={setTab} />
    </>
  );
}
