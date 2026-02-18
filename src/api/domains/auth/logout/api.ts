import axiosInstance from "../../../axiosInstance";
import type { ApiResponse } from "../../../client/types";

export type LogoutResult = {
  loggedOut: boolean;
  logoutAt: string;
};

export async function logout() {
  const res = await axiosInstance.post<ApiResponse<LogoutResult>>(
    "/auth/logout",
    null,
    { withCredentials: true },
  );
  return res.data;
}
