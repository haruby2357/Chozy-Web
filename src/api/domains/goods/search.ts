import axiosInstance from "../../axiosInstance";

type ApiResponse<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  timestamp: string;
  result?: T;
};

export const deleteAllRecentKeywords = async () => {
  const { data } = await axiosInstance.delete<ApiResponse<string>>(
    "/home/search/recent",
  );

  if (!data.isSuccess || data.code !== 1000) {
    throw new Error(data.message || "요청에 실패했습니다.");
  }

  return data;
};

export const deleteRecentKeyword = async (keywordId: number) => {
  const { data } = await axiosInstance.delete<ApiResponse<string>>(
    `/home/searches/recent/${keywordId}`,
  );

  if (!data.isSuccess || data.code !== 1000) {
    throw new Error(data.message || "요청에 실패했습니다.");
  }

  return data;
};
