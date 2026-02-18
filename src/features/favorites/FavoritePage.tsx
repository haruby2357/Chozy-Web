import { useEffect, useRef, useState } from "react";

import Nav from "../../components/Nav";
import emptyIcon from "../../assets/all/Empty_favorite_icon.svg";
import FavoritesHeader from "./FavoritesHeader";

import FavoriteToast from "./components/FavoriteToast";

import { getLikes, setLike } from "../../api/domains/favorite/api";
import type { LikeItem } from "../../api/domains/favorite/types";

import Product from "../goodsPage/components/Product";

export default function FavoritePage() {
  const [likes, setLikesState] = useState<LikeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastOpen(true);

    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastOpen(false), 1800);
  };

  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      try {
        const list = await getLikes();
        if (!alive) return;
        setLikesState(list);
      } catch {
        if (!alive) return;
        setLikesState([]);
      }

      if (!alive) return;
      setLoading(false);
    };

    run();

    return () => {
      alive = false;
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleRemoveFavorite = async (productId: number) => {
    const prev = likes;
    setLikesState((cur) => cur.filter((x) => x.productId !== productId));

    try {
      await setLike(productId, false);
      showToast("찜을 해제했어요.");
    } catch {
      setLikesState(prev);
    }
  };

  const hasFavorites = likes.length > 0;

  return (
    <div className="h-full flex flex-col bg-white">
      <FavoritesHeader />

      <main className="flex-1 bg-white">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <span className="text-[#B5B5B5] text-[14px]">불러오는 중…</span>
          </div>
        ) : hasFavorites ? (
          <div className="px-4 pt-4 pb-6">
            <div className="grid grid-cols-2 gap-x-3 gap-y-4">
              {likes.map((item) => (
                <Product
                  key={item.productId}
                  size="md"
                  productId={item.productId}
                  name={item.name}
                  originalPrice={item.originalPrice}
                  discountRate={item.discountRate}
                  imageUrl={item.imageUrl}
                  productUrl={item.productUrl}
                  status={true} // 찜 여부
                  isSoldOut={item.status} // 명세서 status = 품절 여부
                  onToggleLike={handleRemoveFavorite}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center px-4 text-center">
            <div className="flex flex-col items-center gap-[20px] -translate-y-10">
              <img
                src={emptyIcon}
                alt=""
                className="w-[100px] h-[100px] object-contain"
              />
              <p className="text-[#575757] text-[16px] font-medium leading-[24px]">
                찜한 상품이 없어요.
              </p>
            </div>
          </div>
        )}
      </main>

      <Nav />

      <FavoriteToast open={toastOpen} message={toastMessage} />
    </div>
  );
}
