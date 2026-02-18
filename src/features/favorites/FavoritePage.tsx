import Nav from "../../components/Nav";
import emptyIcon from "../../assets/all/Empty_favorite_icon.svg";
import FavoritesHeader from "./FavoritesHeader";

export default function FavoritePage() {
  const hasFavorites = false; // 추후 로컬/서버 연동 시 교체

  return (
    <div className="h-full flex flex-col bg-white">
        <FavoritesHeader />

      <main className="flex-1 bg-white">
        {hasFavorites ? (
          // 이후 "찜 목록" UI 구현
          <div className="h-full flex items-center justify-center">
            <span className="text-[#191919] text-[16px]">찜 목록</span>
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
    </div>
  );
}
