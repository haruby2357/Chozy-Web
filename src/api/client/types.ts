// 시간 되면 공통 응답/에러 타입 정의
export type ApiResponse<T> = {
  success: boolean;
  code: number;
  message: string;
  timestamp: string;
  result: T;
};
