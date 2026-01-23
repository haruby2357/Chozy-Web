import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backIcon from "../../assets/all/back.svg";
import removeTextIcon from "../../assets/community/remove-text.svg";
import checkIcon from "../../assets/community/check.svg";
import HashtagInput from "./components/HashtagInput";
import StarRating from "./components/StarRating";
import ImageUpload from "./components/ImageUpload";
import SubmitButton from "./components/SubmitButton";

export default function ReviewWrite() {
  const navigate = useNavigate();
  const [productLink, setProductLink] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!isFormValid() || isLoading) return;

    setIsLoading(true);
    try {
      // 이미지 객체 생성
      const imgArray = images.map((image) => ({
        fileName: image.name,
        contentType: image.type,
      }));

      const requestBody = {
        productUrl: productLink,
        rating: rating,
        content: review,
        img: imgArray,
      };

      const response = await fetch("/community/reviews/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.isSuccess) {
        setShowSuccess(true);
        // 게시글 상세 페이지로 이동
        setTimeout(() => {
          navigate(`/community/reviews/${data.result.reviewId}`);
        }, 2000);
      } else {
        setToastMessage(data.message || "리뷰 게시에 실패했습니다.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setToastMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // 필수 항목 검증 함수
  const isFormValid = (): boolean => {
    return (
      productLink !== "" &&
      isValidProductLink(productLink) &&
      rating !== 0 &&
      review.trim() !== ""
    );
  };

  const isValidProductLink = (link: string): boolean => {
    if (!link) return false;
    try {
      new URL(link);
      return true;
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

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10">
        <div className="h-12 flex items-center justify-center px-4 relative">
          <button
            onClick={handleBack}
            className="w-6 h-6 flex items-center justify-center flex-shrink-0 absolute left-4"
          >
            <img src={backIcon} className="w-6 h-6" />
          </button>
          <span className="font-pretendard font-semibold text-[18px] leading-none tracking-normal text-center">
            리뷰 작성
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col px-4 py-4 space-y-6">
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
              className="font-medium h-12 w-full px-3 pr-12 border border-[#DADADA] rounded placeholder-[#B5B5B5] text-sm focus:outline-none focus:border-[#800025] focus:text-[#191919]"
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
        <div className="flex flex-col">
          <label className="flex text-zinc-900 text-base font-medium font-['Pretendard'] mb-3 gap-1">
            후기
            <span className="text-rose-900 text-base font-medium font-['Pretendard']">
              *
            </span>
          </label>
          <textarea
            ref={textareaRef}
            placeholder="내용을 작성해 주세요."
            value={review}
            onChange={(e) => setReview(e.target.value.slice(0, 500))}
            maxLength={500}
            className="w-full min-h-[150px] px-3 py-3 border border-[#DADADA] rounded placeholder-[#B5B5B5] text-sm focus:outline-none focus:border-[#800025] focus:text-[#191919] resize-none overflow-hidden"
          />
          <div className="font-pretendard font-normal text-right text-[13px] text-[#B5B5B5]">
            {review.length} / 500
          </div>

          <HashtagInput
            hashtags={hashtags}
            onHashtagsChange={setHashtags}
            onToast={(message) => {
              setToastMessage(message);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 3000);
            }}
          />
        </div>

        {/* 사진 */}
        <ImageUpload images={images} onImagesChange={setImages} />
      </div>

      {/* 게시하기 버튼 */}
      <SubmitButton
        isValid={isFormValid()}
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />

      {/* 성공 모달 */}
      {showSuccess && (
        <div className="fixed inset-0 w-[390px] mx-auto bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="w-full h-[153px] bg-white rounded-2xl flex flex-col items-center gap-6 pt-9">
            <div className="w-10 h-10 bg-[#800025] rounded-full flex items-center justify-center">
              <img src={checkIcon} alt="Check" className="w-4 h-[11px]" />
            </div>
            <p className="text-center text-[#191919] font-medium text-base">
              리뷰를 성공적으로 게시했어요.
            </p>
          </div>
        </div>
      )}

      {/* 토스트 메시지 */}
      {showToast && (
        <div className="fixed bottom-4 w-[390px] mx-auto left-1/2 transform -translate-x-1/2 px-4 z-40">
          <div className="text-white text-base font-medium font-['Pretendard'] bg-zinc-700 px-4 py-4 rounded">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
