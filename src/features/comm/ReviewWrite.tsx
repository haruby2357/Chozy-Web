import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DetailHeader from "../../components/DetailHeader";
import SubmitButton from "../../components/SubmitButton";
import Toast from "../../components/Toast";
import SuccessModal from "../../components/SuccessModal";
import removeTextIcon from "../../assets/community/remove-text.svg";
import Textarea from "./components/Textarea";
import HashtagInput from "./components/HashtagInput";
import StarRating from "./components/StarRating";
import ImageUpload from "./components/ImageUpload";
import { getUserIdFromToken } from "../../api/auth";
import { createReview } from "../../api/domains/community/actions";

export default function ReviewWrite() {
  const navigate = useNavigate();
  const [productLink, setProductLink] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      showToast("로그인 정보가 필요합니다.");
      return;
    }

    if (!isFormValid() || isLoading) return;

    setIsLoading(true);
    try {
      // vendor 판단
      const url = new URL(productLink);
      const vendor = url.hostname.includes("coupang.com") ? "쿠팡" : "알리";

      const requestBody = {
        title: title,
        content: review,
        vendor: vendor,
        rating: rating,
        productUrl: productLink,
        hashTags: hashtags,
        img: [],
      };

      const data = await createReview(userId, requestBody);
      if (data.success || data.code === 1000) {
        setShowSuccess(true);
        setTimeout(() => {
          const feedId = data.result.feedId;
          navigate(`/community/feeds/${feedId}`);
        }, 2000);
      } else {
        showToast(data.message || "리뷰 게시에 실패했습니다.");
      }
    } catch (error) {
      showToast("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 필수 항목 검증 함수
  const isFormValid = (): boolean => {
    return (
      title.trim() !== "" &&
      productLink !== "" &&
      isValidProductLink(productLink) &&
      rating !== 0 &&
      review.trim() !== ""
    );
  };

  const isValidProductLink = (link: string): boolean => {
    if (!link) return false;
    try {
      const url = new URL(link);
      // 도메인만 간단하게 체크
      const isCoupang = url.hostname.includes("coupang.com");
      const isAli = url.hostname.includes("aliexpress.com");
      return isCoupang || isAli;
    } catch {
      return false;
    }
  };

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleResizeHeight();
  }, [review]);

  const showToast = (message: string, type: "success" | "error" = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      <DetailHeader title="리뷰 작성" />

      {/* Content */}
      <div className="flex flex-col px-4 py-4 space-y-6">
        {/* 상품 제목 입력란 추가 */}
        <div className="flex flex-col">
          <label className="flex text-zinc-900 text-base font-medium mb-3 gap-1">
            상품 제목 <span className="text-rose-900">*</span>
          </label>
          <input
            type="text"
            placeholder="상품명을 입력해 주세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 w-full px-3 border border-[#DADADA] rounded text-sm focus:outline-none focus:border-[#800025] caret-rose-900"
          />
        </div>

        {/* 상품 링크 */}
        <div className="flex flex-col">
          <label className="flex text-zinc-900 text-base font-medium font-['Pretendard'] mb-3 gap-1">
            상품 링크
            <span className="text-rose-900 text-base font-medium font-['Pretendard']">
              *
            </span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="상품 링크를 입력해 주세요."
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              className="font-medium h-12 w-full px-3 pr-12 border border-[#DADADA] rounded placeholder-[#B5B5B5] text-sm focus:outline-none focus:border-[#800025] focus:text-[#191919] caret-rose-900"
            />
            {productLink && (
              <button
                onClick={() => setProductLink("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
              >
                <img src={removeTextIcon} alt="Clear" className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* 제대로 된 링크 검증 */}
          {productLink && !isValidProductLink(productLink) && (
            <p className="text-red-500 text-xs mt-2">
              url 형식에 맞지 않습니다.
            </p>
          )}
        </div>

        {/* 별점 */}
        <div className="flex flex-col">
          <label className="flex text-zinc-900 text-base font-medium font-['Pretendard'] mb-3 gap-1">
            별점
            <span className="text-rose-900 text-base font-medium font-['Pretendard']">
              *
            </span>
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            isInteractive={true}
          />
        </div>

        {/* 후기 */}
        <Textarea
          review={review}
          onReviewChange={setReview}
          textareaRef={textareaRef}
        />

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

        {/* 사진 */}
        <ImageUpload images={images} onImagesChange={setImages} />

        {/* 게시하기 버튼 */}
        <div className="fixed bottom-5 w-[min(100vw,calc(100dvh*9/16))] mx-auto left-1/2 -translate-x-1/2 px-4 z-40">
          <SubmitButton
            label="게시하기"
            isValid={isFormValid()}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            className="relative w-full"
          />
        </div>
      </div>

      {/* 성공 모달 */}
      <SuccessModal
        isOpen={showSuccess}
        message="리뷰를 성공적으로 게시했어요."
      />

      {/* 토스트 메시지 */}
      <Toast toast={toast} />
    </div>
  );
}
