import axiosInstance from "../../axiosInstance";
import type { LikeItem, LikesResponse } from "./types";

function getUserIdFromTokenOrThrow(): number {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("accessToken이 없습니다.");

  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as {
      sub?: string | number;
    };

    if (payload.sub === undefined || payload.sub === null) {
      throw new Error("token payload에 sub가 없습니다.");
    }

    const userId = Number(payload.sub);
    if (Number.isNaN(userId) || userId <= 0) {
      throw new Error("token payload의 sub가 유효한 userId가 아닙니다.");
    }

    return userId;
  } catch {
    throw new Error("accessToken에서 userId(sub)를 파싱할 수 없습니다.");
  }
}

export type LikesQuery = {
  search?: string;
  page?: number;
  size?: number;
};

export async function getLikes(query: LikesQuery = {}): Promise<LikeItem[]> {
  const userId = getUserIdFromTokenOrThrow();

  const search = query.search ?? "";
  const page = query.page ?? 0;
  const size = query.size ?? 100;

  // 1안: flat query
  const { data } = await axiosInstance.get<LikesResponse>("/likes", {
    params: { userId, search, page, size },
  });

  return data.result.result.items;
}

export async function setLike(productId: number, like: boolean): Promise<void> {
  const userId = getUserIdFromTokenOrThrow();

  await axiosInstance.post(
    "/likes",
    { productId, like },
    { params: { userId } },
  );
}
