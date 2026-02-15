import { useMemo, useState, useRef, useLayoutEffect } from "react";
import etc from "../../../assets/community/etc.svg";
import comment from "../../../assets/community/comment.svg";
import quotation from "../../../assets/community/quotation.svg";
import goodOn from "../../../assets/community/good-on.svg";
import goodOff from "../../../assets/community/good-off.svg";
import badOn from "../../../assets/community/bad-on.svg";
import badOff from "../../../assets/community/bad-off.svg";

import type { CommentItem } from "../types";

function formatCommentDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const now = new Date();

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const isSameYear = date.getFullYear() === now.getFullYear();

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const DD = String(date.getDate()).padStart(2, "0");

  const YY = String(date.getFullYear()).slice(2);

  //오늘
  if (isSameDay) {
    return `${hh}:${mm}`; // ex) 15:20
  }

  //올해 (오늘 제외)
  if (isSameYear) {
    return `${MM}.${DD}`; // ex) 01.05
  }

  //이전 연도
  return `${YY}.${MM}.${DD}`; // ex) 25.12.24
}

function flattenRepliesToOneLevel(list: CommentItem[]): CommentItem[] {
  const out: CommentItem[] = [];

  const dfs = (arr: CommentItem[]) => {
    for (const c of arr) {
      out.push(c);
      const kids = c.comment ?? [];
      if (kids.length > 0) dfs(kids);
    }
  };

  dfs(list);
  return out;
}

export default function CommentRow({
  item,
  depth = 0,
  lastAvatarRef,
  onToggleReaction,
  onReplyClick,
}: {
  item: CommentItem;
  depth?: number;
  lastAvatarRef?: React.RefObject<HTMLImageElement | null>;
  onToggleReaction: (commentId: number, like: boolean) => void;
  onReplyClick?: (loginId: string, parentCommentId: number) => void;
}) {
  const isChild = depth > 0;

  const rawChildren = item.comment ?? [];

  const childrenForRender = useMemo(() => {
    if (depth !== 0) return [];
    return flattenRepliesToOneLevel(rawChildren);
  }, [rawChildren, depth]);

  const hasRenderableChildren = childrenForRender.length > 0;

  const DEFAULT_PREVIEW = 2;
  const [showAllReplies, setShowAllReplies] = useState(false);

  const previewReplies = useMemo(() => {
    if (!hasRenderableChildren) return [];
    if (showAllReplies) return childrenForRender;
    return childrenForRender.slice(0, DEFAULT_PREVIEW);
  }, [childrenForRender, hasRenderableChildren, showAllReplies]);

  const hiddenCount = Math.max(childrenForRender.length - DEFAULT_PREVIEW, 0);

  const showReplyTo = isChild && item.quote;

  const parentAvatarRef = useRef<HTMLImageElement | null>(null);
  const repliesWrapRef = useRef<HTMLDivElement | null>(null);
  const lastChildAvatarRef = useRef<HTMLImageElement | null>(null);

  const [lineStyle, setLineStyle] = useState<{
    top: number;
    height: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (!hasRenderableChildren) return;

    const parentEl = parentAvatarRef.current;
    const wrapEl = repliesWrapRef.current;
    const lastEl = lastChildAvatarRef.current;

    if (!parentEl || !wrapEl || !lastEl) return;

    const wrapRect = wrapEl.getBoundingClientRect();
    const parentRect = parentEl.getBoundingClientRect();
    const lastRect = lastEl.getBoundingClientRect();

    const parentCenterY = parentRect.top + parentRect.height / 2;
    const lastCenterY = lastRect.top + lastRect.height / 2;

    setLineStyle({
      top: parentCenterY - wrapRect.top,
      height: Math.max(0, lastCenterY - parentCenterY),
    });
  }, [hasRenderableChildren, previewReplies.length, showAllReplies]);

  return (
    <div className="bg-white px-2 py-3">
      <div className="flex justify-between">
        <img
          ref={lastAvatarRef ?? parentAvatarRef}
          src={item.user.profileImg}
          alt="프로필"
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />

        <div className="flex-1 pl-2">
          <div className="flex items-center gap-[6px]">
            <span className="text-[14px] font-medium text-[#191919]">
              {item.user.userName}
            </span>
            <span className="text-[12px] text-[#B5B5B5]">
              @{item.user.userId}
            </span>
            <span className="text-[12px] text-[#B5B5B5]">
              {formatCommentDate(item.createdAt)}
            </span>
          </div>

          {showReplyTo && (
            <div className="mt-1 pl-1 text-[14px] text-[#787878]">
              <span className="font-medium">@{item.quote}</span>
              <span>님에게 답글</span>
            </div>
          )}

          <div className="mt-1 text-[14px] text-[#191919] whitespace-pre-line">
            {item.content}
          </div>

          <div className="mt-4 flex items-center gap-3 text-[12px] text-[#575757]">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isChild) return;

                  onReplyClick?.(item.user.userId, item.commentId);
                }}
                className="flex items-center gap-[3px] leading-none"
              >
                <span className="w-6 h-6 flex items-center justify-center shrink-0">
                  <img src={comment} alt="댓글수" className="w-6 h-6 block" />
                </span>
                <span className="text-[13px] leading-none">
                  {item.counts.comments}
                </span>
              </button>

              {/* 인용 */}
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-[3px] leading-none"
              >
                <span className="w-6 h-6 flex items-center justify-center shrink-0">
                  <img src={quotation} alt="인용수" className="w-6 h-6 block" />
                </span>
                <span className="text-[13px] leading-none">
                  {item.counts.quotes}
                </span>
              </button>

              {/* 좋아요 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleReaction(item.commentId, true);
                }}
                className="flex items-center gap-[3px] leading-none"
              >
                <span className="w-6 h-6 flex items-center justify-center shrink-0 pb-[5px] pl-1 pr-[3px]">
                  <img
                    src={item.myState.reaction === "LIKE" ? goodOn : goodOff}
                    alt="좋아요수"
                    className="w-6 h-6 block"
                  />
                </span>
                <span className="text-[13px] leading-none">
                  {item.counts.likes}
                </span>
              </button>

              {/* 싫어요 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleReaction(item.commentId, false);
                }}
                className="flex items-center gap-[3px] leading-none"
              >
                <span className="w-6 h-6 flex items-center justify-center shrink-0 pt-[5px] pl-1 pr-[3px]">
                  <img
                    src={item.myState.reaction === "DISLIKE" ? badOn : badOff}
                    alt="싫어요수"
                    className="w-6 h-6 block"
                  />
                </span>
                <span className="text-[13px] leading-none">
                  {item.counts.dislikes}
                </span>
              </button>
            </div>
          </div>

          {/* 답글 목록 */}
          {depth === 0 && hasRenderableChildren && (
            <div ref={repliesWrapRef} className="mt-3 relative">
              {lineStyle && (
                <div
                  className="absolute w-px bg-[#DADADA]"
                  style={{
                    left: -28,
                    top: lineStyle.top + 32,
                    height: lineStyle.height - 32,
                  }}
                />
              )}

              <div className="pl-4">
                {previewReplies.map((child, idx) => (
                  <CommentRow
                    key={child.commentId}
                    item={child}
                    depth={1} // ✅ 무조건 1단 답글로 렌더
                    onToggleReaction={onToggleReaction}
                    onReplyClick={onReplyClick}
                    lastAvatarRef={
                      idx === previewReplies.length - 1
                        ? lastChildAvatarRef
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {!showAllReplies && hiddenCount > 0 && (
            <button
              type="button"
              className="mt-2 w-full text-center text-[14px] font-medium text-[#575757]"
              onClick={() => setShowAllReplies(true)}
            >
              답글 {childrenForRender.length - DEFAULT_PREVIEW}개 더보기
            </button>
          )}
        </div>

        <button
          type="button"
          className="w-6 h-6 flex items-center justify-center shrink-0"
          onClick={() => console.log("more", item.commentId)}
        >
          <img src={etc} alt="더보기" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
