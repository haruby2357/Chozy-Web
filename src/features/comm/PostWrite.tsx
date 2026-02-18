import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DetailHeader from "../../components/DetailHeader";
import SubmitButton from "../../components/SubmitButton";
import Toast from "../../components/Toast";
import SuccessModal from "../../components/SuccessModal";
import HashtagInput from "./components/HashtagInput";
import ImageUpload from "./components/ImageUpload";
import { mypageApi } from "../../api";
import defaultProfile from "../../assets/mypage/defaultProfile.svg";
import { getUserIdFromToken } from "../../api/auth";
import { createPost } from "../../api/domains/community/actions";

export default function PostWrite() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const showToast = (message: string, type: "success" | "error" = "error") => {
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
      showToast("로그인 정보가 필요합니다. 다시 로그인해주세요.");
      return;
    }

    if (!isFormValid() || isLoading) return;

    setIsLoading(true);
    try {
      const requestBody = {
        content: content,
        hashTags: hashtags, // 배열을 JSON 문자열로 변환
        img: [], // 이미지는 null로 처리
      };

      const data = await createPost(userId, requestBody);

      // 성공 코드 1000 확인 (공통 컨벤션)
      if (data.code === 1000) {
        setShowSuccess(true);
        setTimeout(() => {
          const feedId = data.result.feedId; // result 자체가 feedId임
          navigate(`/community/feeds/${feedId}`);
        }, 2000);
      } else {
        setToast({
          message: data.message || "게시글 등록에 실패했습니다.",
          type: "error",
        });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (error) {
      console.error(error);
      setToast({ message: "네트워크 오류가 발생했습니다.", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      <DetailHeader title="사담 작성" />

      {/* 본문 */}
      <main className="flex-1 px-4 py-6 flex flex-col gap-3.5 ">
        {/* 글 작성 영역 */}
        <div className="w-full p-3 bg-white rounded outline outline-1 outline-offset-[-1px] outline-zinc-300 focus-within:outline-rose-900 inline-flex flex-col justify-start items-start gap-2.5">
          {/* 프로필 영역 */}
          <div className="w-full inline-flex justify-start items-center gap-2">
            <img
              className="w-9 h-9 rounded-full border border-stone-50 object-cover"
              src={currentUser?.profileImageUrl ?? defaultProfile}
              alt="profile"
            />
            <div className="inline-flex flex-col justify-center items-start gap-0.5">
              <div className="text-center justify-start text-zinc-900 text-sm font-medium font-['Pretendard'] leading-5">
                {currentUser?.nickname || "닉네임"}{" "}
              </div>
              <div className="text-center justify-start text-zinc-400 text-[10px] font-normal font-['Pretendard']">
                @{currentUser?.loginId || "userid"}{" "}
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
            className="w-full min-h-32 bg-white text-zinc-900 text-sm font-normal font-['Pretendard'] leading-6 placeholder-zinc-400 resize-none overflow-hidden border-none outline-none focus:outline-none focus:placeholder-transparent caret-rose-900"
          />
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

        {/* 사진 */}
        <div>
          <ImageUpload images={images} onImagesChange={setImages} />
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
        message="사담을 성공적으로 게시했어요."
      />

      {/* 토스트 메시지 */}
      <Toast toast={toast} />
    </div>
  );
}
