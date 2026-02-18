import { useEffect, useState } from "react";
import up from "../../../assets/all/up.svg";

type Props = {
  scrollTargetSelector?: string;
  multiplier?: number;
};

export default function ScrollToTop({
  scrollTargetSelector,
  multiplier = 2,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = scrollTargetSelector
      ? (document.querySelector(scrollTargetSelector) as HTMLElement | null)
      : null;

    const getScrollTop = () =>
      el ? el.scrollTop : window.scrollY || document.documentElement.scrollTop;

    const onScroll = () => {
      const threshold = window.innerHeight * multiplier;
      setVisible(getScrollTop() >= threshold);
    };

    // 초기 체크
    onScroll();

    // 이벤트 등록
    if (el) el.addEventListener("scroll", onScroll, { passive: true });
    else window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (el) el.removeEventListener("scroll", onScroll);
      else window.removeEventListener("scroll", onScroll);
    };
  }, [scrollTargetSelector, multiplier]);

  const scrollToTop = () => {
    const el = scrollTargetSelector
      ? (document.querySelector(scrollTargetSelector) as HTMLElement | null)
      : null;

    if (el) {
      el.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="맨 위로"
      className="
        absolute right-4 bottom-6 z-50
        w-12 h-12 rounded-full
        bg-white 
        shadow-[0_8px_20px_rgba(0,0,0,0.18)]
        flex items-center justify-center
        active:scale-95 transition
      "
    >
      <img src={up} alt="상단" />
    </button>
  );
}
