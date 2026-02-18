import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Followings from "./components/Followings";
import type { FollowTabKey } from "./components/followings/FollowTabBar";

type LocationState = {
  userId?: string;
  defaultTab: FollowTabKey;
};

export default function FollowingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  useEffect(() => {
    if (!state.userId) {
      navigate("/login", { replace: true });
    }
  }, [state.userId, navigate]);

  if (!state.userId) return null;

  return <Followings userId={state.userId} defaultTab={state.defaultTab} />;
}
