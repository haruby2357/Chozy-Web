// Nav
// 현재 pathname을 기준으로 활성 탭 판단하여 아이콘 변경
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import homeOn from "../assets/nav/home-on.svg";
import homeOff from "../assets/nav/home-off.svg";
import commOn from "../assets/nav/comm-on.svg";
import commOff from "../assets/nav/comm-off.svg";
import heartOn from "../assets/nav/heart-on.svg";
import heartOff from "../assets/nav/heart-off.svg";
import myOn from "../assets/nav/my-on.svg";
import myOff from "../assets/nav/my-off.svg";

type NavItem = {
  key: string;
  to: string;
  label: string;
  onSrc: string;
  offSrc: string;
  match: (pathname: string) => boolean;
};

type NavProps = {
  scrollTargetSelector?: string;
};

export default function Nav({ scrollTargetSelector = "" }: NavProps) {
  const { pathname } = useLocation();

  // 아래 스크롤: nav바 숨김, 위로 스크롤: nav바 보이게 -> 화면 어느정도 스크롤 될 때 테스트 필요!
  const [visible, setVisible] = useState(true);
  const lastYRef = useRef(0);
  const THRESHOLD = 8;

  useEffect(() => {
    const target: HTMLElement | Window = scrollTargetSelector
      ? (document.querySelector(scrollTargetSelector) as HTMLElement)
      : window;

    if (!target) return;

    const getY = () =>
      target === window ? window.scrollY : (target as HTMLElement).scrollTop;

    lastYRef.current = getY();

    const onScroll = () => {
      const y = getY();
      const diff = y - lastYRef.current;

      if (Math.abs(diff) < THRESHOLD) return;

      if (diff > 0)
        setVisible(false); // down
      else setVisible(true); // up

      lastYRef.current = y;
    };

    target.addEventListener("scroll", onScroll , { passive: true });
    return () => target.removeEventListener("scroll", onScroll );
  }, [scrollTargetSelector]);

  const items: NavItem[] = [
    {
      key: "home",
      to: "/",
      label: "홈",
      onSrc: homeOn,
      offSrc: homeOff,
      match: (p) => p === "/",
    },
    {
      key: "community",
      to: "/community",
      label: "커뮤니티",
      onSrc: commOn,
      offSrc: commOff,
      match: (p) => p.startsWith("/community"),
    },
    {
      key: "heart",
      to: "/heart",
      label: "찜",
      onSrc: heartOn,
      offSrc: heartOff,
      match: (p) => p.startsWith("/heart"),
    },
    {
      key: "mypage",
      to: "/mypage",
      label: "마이페이지",
      onSrc: myOn,
      offSrc: myOff,
      match: (p) => p.startsWith("/mypage"),
    },
  ];

  const scrollTop = () => {
    const target = scrollTargetSelector
      ? (document.querySelector(scrollTargetSelector) as HTMLElement | null)
      : null;

    if (target) {
      target.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");
  return (
    <nav
      className={[
        "absolute inset-x-0 bottom-0 z-50",
        visible ? "translate-y-0" : "translate-y-full",
        "transition-transform duration-200 ease-out",
      ].join(" ")}
    >
      <div className="py-[11px] bg-white shadow-[0_-4px_10px_0_rgba(0,0,0,0.04)]">
        <ul className="flex flex-row justify-around">
          {items.map((item) => {
            const isActive = item.match(pathname);
            return (
              <li key={item.key} className="flex justify-center">
                <NavLink
                  to={item.to}
                  onClick={(e) => {
                    // 찜 탭인데 로그인 안 된 경우
                    if (item.key === "heart" && !isLoggedIn) {
                      e.preventDefault(); 
                      navigate("/login"); 
                      return;
                    }

                    // 이미 활성 탭이면 스크롤 위로
                    if (isActive) {
                      e.preventDefault();
                      scrollTop();
                    }
                  }}
                >
                  <img src={isActive ? item.onSrc : item.offSrc} alt="" />
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
