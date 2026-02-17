import { useEffect, useState } from "react";
import DetailHeader from "../../../../components/DetailHeader";
import Account from "./Account";
import emptyIcon from "../../../../assets/all/Empty_favorite_icon.svg";
import { mypageApi } from "../../../../api";

type UiBlockedAccount = {
  id: number;
  name: string;
  userID: string;
  profileImageUrl: string | null;
};

export default function BlockedAccounts() {
  const [items, setItems] = useState<UiBlockedAccount[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);

        const data = await mypageApi.getBlockedAccounts({ page: 0, size: 20 });

        if (data.code !== 1000) {
          setItems([]);
          return;
        }

        const next = (data.result.items ?? []).map((it) => ({
          id: it.userId,
          name: it.nickname,
          userID: `@${it.loginId}`,
          profileImageUrl: it.profileImageUrl,
        }));

        setItems(next);
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const handleUnblocked = (targetUserId: number) => {
    setItems((prev) => prev.filter((x) => x.id !== targetUserId));
  };

  if (loading) {
    return (
      <div>
        <DetailHeader title="차단한 계정" />
        <div className="h-[calc(100vh-48px)] bg-white flex items-center justify-center">
          <p className="text-[#B5B5B5] text-[14px]">로딩중...</p>
        </div>
      </div>
    );
  }

  const hasBlockedAccounts = items.length > 0;

  return (
    <div>
      <DetailHeader title="차단한 계정" />
      {hasBlockedAccounts ? (
        <div className="h-[calc(100vh-48px)] bg-white py-3">
          <p className="px-4 text-[#B5B5B5] text-[14px]">{items.length}명</p>

          {items.map((account) => (
            <Account
              key={account.id}
              targetUserId={account.id}
              name={account.name}
              userID={account.userID}
              profileImage={account.profileImageUrl}
              onUnblocked={handleUnblocked}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-48px)] bg-white gap-5">
          <img src={emptyIcon} alt="목록없음" />
          <p className="text-[#787878] text-[16px]">차단한 계정이 없어요.</p>
        </div>
      )}
    </div>
  );
}
