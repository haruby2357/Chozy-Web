import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DetailHeader from "../../components/DetailHeader";
import SubmitButton from "../../components/SubmitButton";
import Toast from "../../components/Toast";
import SuccessModal from "../../components/SuccessModal";
import HashtagInput from "./components/HashtagInput";
import { mypageApi } from "../../api";
import defaultProfile from "../../assets/mypage/defaultProfile.svg";
import etcIcon from "../../assets/community/etc.svg";
import { getUserIdFromToken } from "../../api/auth";
import { createPost } from "../../api/domains/community/actions";
import {
  getFeedDetail,
  mapApiResultToUi,
} from "../../api/domains/community/feedDetail";
import StarRating from "./components/StarRating";

export default function QuoteWrite() {
  const navigate = useNavigate();
  const { feedId } = useParams<{ feedId: string }>();
  const numericFeedId = feedId ? parseInt(feedId, 10) : 0;

  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [quoteFeed, setQuoteFeed] = useState<any>(null);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 현재 사용자 정보 로드
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await mypageApi.getMyProfile();
        if (data.code === 1000) {
          setCurrentUser(data.result);
        }
      } catch (error) {
        console.error("프로필 로드 실패:", error);
      }
    };
    loadUserProfile();
  }, []);

  // 인용할 피드 정보 로드
  useEffect(() => {
    const loadFeedDetail = async () => {
      try {
        setLoadingFeed(true);
        const data = await getFeedDetail(numericFeedId);
        if (data?.result) {
          const uiData = mapApiResultToUi(data.result);
          setQuoteFeed(uiData.feed);
        }
      } catch (error) {
        console.error("피드 로드 실패:", error);
        showToastMessage("게시글을 불러올 수 없습니다.");
      } finally {
        setLoadingFeed(false);
      }
    };

    if (numericFeedId > 0) {
      loadFeedDetail();
    }
  }, [numericFeedId]);

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const showToastMessage = (
    message: string,
    type: "success" | "error" = "error",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    handleResizeHeight();
  }, [content]);

  const isFormValid = (): boolean => {
    return content.trim().length > 0;
  };

  const handleSubmit = async () => {
    const userId = getUserIdFromToken();

    if (!userId) {
      showToastMessage("로그인 정보가 필요합니다. 다시 로그인해주세요.");
      return;
    }

    if (!isFormValid() || isLoading) return;

    setIsLoading(true);
    try {
      const requestBody = {
        content: content,
        hashTags: hashtags,
        img: [],
        quoteId: numericFeedId, // 인용할 게시글 ID
      };

      const data = await createPost(userId, requestBody);

      if (data.code === 1000) {
        setShowSuccess(true);
        setTimeout(() => {
          const newFeedId = data.result.feedId;
          navigate(`/community/feeds/${newFeedId}`);
        }, 2000);
      } else {
        showToastMessage(data.message || "인용글 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      showToastMessage("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingFeed) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-zinc-400">로드 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      <DetailHeader title="인용하기" />

      <main className="flex-1 p-4 flex flex-col gap-3.5">
        {/* 글 작성 영역 (프로필 + 텍스트 + 인용글) */}
        <div className="w-full p-3 bg-white rounded outline outline-1 outline-offset-[-1px] outline-zinc-300 focus-within:outline-rose-900 flex flex-col justify-start items-stretch gap-2">
          {/* 프로필 영역 */}
          <div className="flex w-full inline-flex justify-start items-center gap-2">
            <img
              className="w-9 h-9 rounded-full border border-stone-50 object-cover"
              src={currentUser?.profileImageUrl ?? defaultProfile}
              alt="profile"
            />
            <div className="inline-flex flex-col justify-center items-start gap-0.5">
              <div className="text-center justify-start text-zinc-900 text-sm font-medium font-['Pretendard'] leading-5">
                {currentUser?.nickname || "닉네임"}
              </div>
              <div className="text-center justify-start text-zinc-400 text-[10px] font-normal font-['Pretendard']">
                @{currentUser?.loginId || "userid"}
              </div>
            </div>
          </div>

          {/* 입력 영역 */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 500))}
            maxLength={500}
            placeholder="내용을 작성해 주세요."
            className="w-full h-[25px] mb-5 text-zinc-900 text-sm font-normal font-['Pretendard'] bg-white leading-6 placeholder-zinc-400 resize-none overflow-hidden border-none outline-none focus:outline-none focus:placeholder-transparent caret-rose-900"
          />

          {/* 인용할 글 영역 */}
          {quoteFeed && (
            <div className="w-full aspect-square max-h-[360px] p-3 bg-zinc-50 rounded-lg border-zinc-200 flex flex-col overflow-y-auto">
              {/* 인용 글 헤더 */}
              <div className="inline-flex justify-start items-center gap-2 mb-3">
                <img
                  className="w-8 h-8 rounded-full border border-stone-50 object-cover"
                  src={quoteFeed.user.profileImg ?? defaultProfile}
                  alt="author"
                />
                <div className="inline-flex flex-col justify-center items-start gap-0.5">
                  <div className="text-zinc-900 text-sm font-medium font-['Pretendard']">
                    {quoteFeed.user.userName}
                  </div>
                  <div className="text-zinc-400 text-xs font-normal font-['Pretendard']">
                    @{quoteFeed.user.userId}
                  </div>
                </div>
                <button className="ml-auto">
                  <img src={etcIcon} className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              {/* 인용 글 제목/내용 */}
              {quoteFeed.type === "REVIEW" &&
                (quoteFeed.content as any).title && (
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-rose-900 text-sm font-semibold font-['Pretendard']">
                      {(() => {
                        const link = (quoteFeed.content as any).link;
                        if (link?.includes("coupang")) return "쿠팡";
                        if (link?.includes("aliexpress")) return "알리";
                        return "";
                      })()}
                    </h3>
                    <h3 className="text-zinc-900 text-sm font-medium font-['Pretendard']">
                      {(quoteFeed.content as any).title}
                    </h3>
                  </div>
                )}

              {/* 리뷰인 경우 별점 표시 */}
              {quoteFeed.type === "REVIEW" &&
                (quoteFeed.content as any).rating && (
                  <div className="mb-2 flex items-center gap-2">
                    <StarRating
                      rating={(quoteFeed.content as any).rating}
                      isInteractive={false}
                    />
                    <div className="text-zinc-400 text-xs font-normal font-['Pretendard']">
                      {(quoteFeed.content as any).rating}
                    </div>
                  </div>
                )}

              {/* 인용 글 본문 */}
              <div className=" text-zinc-900 text-sm font-normal font-['Pretendard'] line-clamp-3 mb-3">
                {quoteFeed.content.text}
              </div>

              {/* 인용 글 이미지 */}
              <img
                className="w-48 h-48 rounded border border-stone-50 flex-shrink-0"
                src="https://placehold.co/200x200"
                alt="인용 이미지"
              />
            </div>
          )}
        </div>

        {/* 글자 수 */}
        <div className="w-full text-right text-zinc-400 text-xs font-normal font-['Pretendard']">
          {content.length}/500
        </div>

        {/* 해시 태그 */}
        <div className="flex flex-col">
          <HashtagInput
            hashtags={hashtags}
            onHashtagsChange={setHashtags}
            onToast={(message) => {
              setToast({ message, type: "error" });
              setTimeout(() => setToast(null), 3000);
            }}
          />
        </div>
      </main>

      {/* 제출 버튼 */}
      <div className="fixed bottom-5 w-[min(100vw,calc(100dvh*9/16))] mx-auto left-1/2 -translate-x-1/2 px-4 z-40">
        <SubmitButton
          label="게시하기"
          isValid={isFormValid()}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          className="relative w-full"
        />
      </div>

      {/* 성공 모달 */}
      <SuccessModal
        isOpen={showSuccess}
        message="인용글을 성공적으로 게시했어요."
      />

      {/* 토스트 메시지 */}
      <Toast toast={toast} />
    </div>
  );
}
