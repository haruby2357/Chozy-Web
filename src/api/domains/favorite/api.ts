import axios from "axios";
import axiosInstance from "../../axiosInstance";
import type { ApiEnvelope, LikeItem } from "./types";

function getUserIdFromToken(): string | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.sub ? String(payload.sub) : null;
  } catch {
    return null;
  }
}

export async function getLikes(search?: string): Promise<LikeItem[]> {
  try {
    const { data } = await axiosInstance.get<ApiEnvelope<LikeItem[]>>(
      "/likes",
      {
        params: search ? { search } : undefined,
      },
    );
    return data.result ?? [];
  } catch (err: unknown) {
    if (!axios.isAxiosError(err)) throw err;

    const userId = getUserIdFromToken();
    if (!userId) throw err;

    const { data } = await axiosInstance.get<ApiEnvelope<LikeItem[]>>(
      "/likes",
      {
        params: { ...(search ? { search } : {}), userId },
      },
    );
    return data.result ?? [];
  }
}

export async function setLike(productId: number, like: boolean): Promise<void> {

  try {
    await axiosInstance.post("/likes", { productId, like });
    return;
  } catch (err: unknown) {
    if (!axios.isAxiosError(err)) throw err;

    const userId = getUserIdFromToken();
    if (!userId) throw err;

    await axiosInstance.post(
      "/likes",
      { productId, like },
      { params: { userId } },
    );
  }
}
