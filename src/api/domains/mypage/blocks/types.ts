// 마이페이지 차단한 계정 목록 조회
export type BlockedAccountItem = {
  userId: number;
  loginId: string;
  nickname: string;
  profileImageUrl: string | null;
  blockedAt?: string;
};

export type BlockedAccountsResult = {
  items: BlockedAccountItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

// 마이페이지 차단 해제
export type UnblockResult = {
  targetUserId: number;
  isBlocked: false; // 성공 시 false
  unblockedAt: string;
};
