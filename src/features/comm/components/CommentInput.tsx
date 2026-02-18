import send from "../../../assets/community/send.svg";
import { useEffect, useMemo, useRef, useState } from "react";

type CommentInputProps = {
  profileImg: string;
  onSubmit: (text: string) => void;
  replyTo?: string | null;
  onClearReply?: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  placeholderText?: string;
};

type ApiResponse<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  timestamp: string;
  result: T;
};

type MentionUser = {
  userId: number;
  loginId: string;
  profileImageUrl: string;
};

const MENTION_ENDPOINT = "/community/search/recommed/users";

/** DEV용: 로그인/토큰 없을 때도 UI 동작 확인하기 위한 스위치 */
const USE_MOCK_MENTION = true;

/** 더미 데이터 */
const MOCK_USERS: MentionUser[] = [
  {
    userId: 1,
    loginId: "abc",
    profileImageUrl: "https://i.pravatar.cc/80?img=1",
  },
  {
    userId: 2,
    loginId: "abcd",
    profileImageUrl: "https://i.pravatar.cc/80?img=2",
  },
  {
    userId: 3,
    loginId: "abce",
    profileImageUrl: "https://i.pravatar.cc/80?img=3",
  },
  {
    userId: 4,
    loginId: "abc123",
    profileImageUrl: "https://i.pravatar.cc/80?img=4",
  },
  {
    userId: 5,
    loginId: "abcde",
    profileImageUrl: "https://i.pravatar.cc/80?img=5",
  },
  {
    userId: 6,
    loginId: "abcdef",
    profileImageUrl: "https://i.pravatar.cc/80?img=6",
  },
  {
    userId: 7,
    loginId: "abccgc",
    profileImageUrl: "https://i.pravatar.cc/80?img=7",
  },
];

function useDebounce<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

// 커서 기준으로 "현재 입력 중인 @멘션 쿼리" 추출
function getActiveMention(text: string, cursorPos: number) {
  const uptoCursor = text.slice(0, cursorPos);
  const at = uptoCursor.lastIndexOf("@");
  if (at === -1) return null;

  // 이메일/단어 중간(abc@)만 제외
  const prev = at === 0 ? "" : uptoCursor[at - 1];
  if (/[A-Za-z0-9_]/.test(prev)) return null;

  const afterAt = uptoCursor.slice(at + 1);
  if (/\s/.test(afterAt)) return null;
  if (!/^[A-Za-z0-9_]*$/.test(afterAt)) return null;

  return { start: at, query: afterAt };
}

function renderHighlightedText(text: string) {
  const parts = text.split(/(@[A-Za-z0-9_]+)/g);

  return parts.map((part, i) => {
    if (part.startsWith("@") && /^@[A-Za-z0-9_]+$/.test(part)) {
      return (
        <span key={i} className="text-[#800025] font-semibold">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function renderSuggestionLoginId(loginId: string, query: string) {
  // query가 없으면 전체 기본색
  if (!query) {
    return (
      <span className="text-[16px] font-semibold">
        <span className="text-[#800025]">@</span>
        <span className="text-[#191919]">{loginId}</span>
      </span>
    );
  }

  const lower = loginId.toLowerCase();
  const q = query.toLowerCase();
  const idx = lower.indexOf(q);

  // 매칭이 없으면 기본색
  if (idx === -1) {
    return (
      <span className="text-[16px] font-semibold">
        <span className="text-[#800025]">@</span>
        <span className="text-[#191919]">{loginId}</span>
      </span>
    );
  }

  const before = loginId.slice(0, idx);
  const match = loginId.slice(idx, idx + query.length);
  const after = loginId.slice(idx + query.length);

  return (
    <span className="text-[16px] font-semibold">
      <span className="text-[#800025]">@</span>
      <span className="text-[#191919]">{before}</span>
      <span className="text-[#800025]">{match}</span>
      <span className="text-[#191919]">{after}</span>
    </span>
  );
}

export default function CommentInput({
  profileImg,
  onSubmit,
  replyTo,
  onClearReply,
  placeholderText,
}: CommentInputProps) {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<MentionUser[]>([]);
  const [openSuggest, setOpenSuggest] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  const activeMention = useMemo(() => {
    const el = inputRef.current;
    const cursor = el?.selectionStart ?? text.length;
    return getActiveMention(text, cursor);
  }, [text]);

  const debouncedQuery = useDebounce(activeMention?.query ?? "", 250);

  const syncScroll = () => {
    const input = inputRef.current;
    const hl = highlightRef.current;
    if (!input || !hl) return;
    hl.scrollLeft = input.scrollLeft;
  };

  useEffect(() => {
    if (!activeMention) {
      setOpenSuggest(false);
      setSuggestions([]);
      return;
    }

    if (!debouncedQuery) {
      setOpenSuggest(false);
      setSuggestions([]);
      return;
    }

    // 더미 모드
    if (USE_MOCK_MENTION) {
      const q = debouncedQuery.toLowerCase();
      const list = MOCK_USERS.filter((u) =>
        u.loginId.toLowerCase().includes(q),
      ).slice(0, 6);

      setSuggestions(list);
      setOpenSuggest(list.length > 0);
      return;
    }

    // 실서버 모드
    const ac = new AbortController();

    (async () => {
      try {
        const params = new URLSearchParams();
        params.set("loginId", debouncedQuery);

        const accessToken = localStorage.getItem("accessToken");
        const tokenType = localStorage.getItem("tokenType") ?? "Bearer";

        if (!accessToken) {
          setOpenSuggest(false);
          setSuggestions([]);
          return;
        }

        const res = await fetch(`${MENTION_ENDPOINT}?${params.toString()}`, {
          method: "GET",
          signal: ac.signal,
          headers: {
            Authorization: `${tokenType} ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: ApiResponse<MentionUser[]> = await res.json();
        const list = (data.result ?? []).slice(0, 6);

        setSuggestions(list);
        setOpenSuggest(list.length > 0);
      } catch (e) {
        if ((e as any)?.name === "AbortError") return;
        console.error("멘션 추천 로딩 실패:", e);
        setSuggestions([]);
        setOpenSuggest(false);
      }
    })();

    return () => ac.abort();
  }, [activeMention, debouncedQuery]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
    setOpenSuggest(false);
    setSuggestions([]);
  };

  const applyMention = (loginId: string) => {
    const el = inputRef.current;
    if (!el) return;

    const cursor = el.selectionStart ?? text.length;
    const m = getActiveMention(text, cursor);
    if (!m) return;

    const before = text.slice(0, m.start);
    const after = text.slice(cursor);
    const nextText = `${before}@${loginId} ${after}`;

    setText(nextText);
    setOpenSuggest(false);
    setSuggestions([]);

    requestAnimationFrame(() => {
      const nextPos = before.length + 1 + loginId.length + 1;
      el.focus();
      el.setSelectionRange(nextPos, nextPos);
      syncScroll();
    });
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50">
      {openSuggest && (
        <div
          className="absolute inset-0 bg-black/40 z-[40]"
          onMouseDown={() => setOpenSuggest(false)}
        />
      )}

      {/* 답글 대상 표시 */}
      {replyTo && (
        <div>
          <div className="flex items-center justify-between bg-[#F9F9F9] px-4 py-3">
            <div className="text-[14px] text-[#787878]">
              <span className="font-medium text-[#787878]">@{replyTo}</span>
              <span> 님에게 답글</span>
            </div>

            <button
              type="button"
              className="text-[14px] text-[#B5B5B5]"
              onClick={() => onClearReply?.()}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 연관 프로필 */}
      {openSuggest && (
        <div
          className="
            absolute left-4 right-4 bottom-[68px]
            bg-white rounded-[12px]
            shadow-[0_6px_20px_rgba(0,0,0,0.15)]
            overflow-hidden
            z-[50]
          "
        >
          {suggestions.map((u, idx) => (
            <button
              key={u.userId}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setOpenSuggest(false);
                setSuggestions([]);
                applyMention(u.loginId);
              }}
              className={[
                "w-full flex items-center gap-3 px-4 py-3 text-left",
                "hover:bg-[#F9F9F9]",
                idx !== suggestions.length - 1
                  ? "border-b border-[#F9F9F9]"
                  : "",
              ].join(" ")}
            >
              <img
                src={u.profileImageUrl}
                alt={u.loginId}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              {renderSuggestionLoginId(u.loginId, debouncedQuery)}
            </button>
          ))}
        </div>
      )}

      {/* 입력 바 */}
      <div className="w-full h-[60px] bg-white shadow-[0_-4px_10px_0_rgba(0,0,0,0.04)] px-4 py-3 relative z-[60]">
        <div className="flex items-center gap-3">
          <img
            src={profileImg}
            alt="내 프로필"
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />

          <div className="relative flex-1 h-[24px]">
            <div
              ref={highlightRef}
              className="
                absolute inset-0
                overflow-hidden
                whitespace-nowrap
                text-[16px] font-medium
                text-[#191919]
                pointer-events-none
              "
            >
              {text.length === 0 ? (
                <span className="text-[#B5B5B5]">
                  {placeholderText ?? "게시글에 댓글 남기기"}
                </span>
              ) : (
                renderHighlightedText(text)
              )}
            </div>

            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="
                absolute inset-0 w-full
                bg-transparent
                text-transparent caret-[#191919]
                text-[16px] font-medium
                outline-none
              "
              onScroll={syncScroll}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") {
                  setOpenSuggest(false);
                  setSuggestions([]);
                }
              }}
              onBlur={() => setTimeout(() => setOpenSuggest(false), 150)}
              onFocus={() => {
                if (suggestions.length > 0 && activeMention?.query)
                  setOpenSuggest(true);
              }}
            />
          </div>

          <button type="button" onClick={handleSubmit}>
            <img src={send} alt="전송" />
          </button>
        </div>
      </div>
    </div>
  );
}
