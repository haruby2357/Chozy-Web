// Nav
// 현재 pathname을 기준으로 활성 탭 판단하여 아이콘 변경
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import homeOn from "../assets/Nav/home-on.svg";
import homeOff from "../assets/Nav/home-off.svg";
import commOn from "../assets/Nav/comm-on.svg";
import commOff from "../assets/Nav/comm-off.svg";
import heartOn from "../assets/Nav/heart-on.svg";
import heartOff from "../assets/Nav/heart-off.svg";
import myOn from "../assets/Nav/my-on.svg";
import myOff from "../assets/Nav/my-off.svg";

type NavItem = {
  key: string;
  to: string;
  label: string;
  onSrc: string;
  offSrc: string;
  match: (pathname: string) => boolean;
};

export default function Nav() {
  const { pathname } = useLocation();

  const [visible, setVisible] = useState(true);
  const lastYRef = useRef(0);
  const THRESHOLD = 8;

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastYRef.current;

      if (Math.abs(diff) < THRESHOLD) return;

      if (diff > 0) setVisible(false);
      else setVisible(true);

      lastYRef.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items: NavItem[] = [
    {
      key: "home",
      to: "/goods",
      label: "홈",
      onSrc: homeOn,
      offSrc: homeOff,
      match: (p) => p.startsWith("/goods"),
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

  return (
    <nav
      className={[
        "fixed inset-x-0 bottom-0 z-50",
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
                <NavLink to={item.to}>
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
