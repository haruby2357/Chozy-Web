import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HashtagInput from "./components/HashtagInput";
import ImageUpload from "./components/ImageUpload";
import SubmitButton from "./components/SubmitButton";

import backIcon from "../../assets/all/back.svg";
import checkIcon from "../../assets/community/check.svg";

export default function PostWrite() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const isFormValid = (): boolean => {
    return content.trim().length > 0;
  };

  const handleSubmit = async () => {
    if (!isFormValid() || isLoading) return;

    setIsLoading(true);
    try {
      // 이미지 데이터 변환
      const imgData = images.map((file) => ({
        imageUrl: file.name,
        contentType: file.type,
      }));

      // 해시태그를 공백으로 구분된 문자열로 변환
      const hashTagsString = hashtags.join(" ");

      const response = await fetch("/community/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          hashTags: hashTagsString,
          img: imgData,
        }),
      });

      const data = await response.json();
      console.log("응답:", data);

      if (data.isSuccess) {
        console.log("포스트 작성 성공:", data);
        setShowSuccess(true);
        // 2초 후 게시글 상세 페이지로 이동
        setTimeout(() => {
          navigate(`/community/feeds/${data.result.postId}`);
        }, 2000);
      } else {
        throw new Error(data.message || "포스트 작성에 실패했습니다.");
      }
    } catch (error) {
      console.error("포스트 작성 중 오류:", error);
      alert("포스트 작성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10">
        <div className="h-12 flex items-center justify-center px-4 pt-[14px] pb-[13px] relative">
          <button
            onClick={handleBack}
            className="w-6 h-6 flex items-center justify-center flex-shrink-0 absolute left-4"
          >
            <img src={backIcon} className="w-6 h-6" />
          </button>
          <span className="text-center justify-start text-zinc-900 text-lg font-semibold font-['Pretendard']">
            사담 작성
          </span>
        </div>
      </div>

      {/* 본문 */}
      <main className="flex-1 px-4 py-6 flex flex-col gap-3.5 ">
        {/* 글 작성 영역 */}
        <div className="w-full p-3 bg-white rounded outline outline-1 outline-offset-[-1px] outline-zinc-300 focus-within:outline-rose-900 inline-flex flex-col justify-start items-start gap-2.5">
          {/* 프로필 영역 */}
          <div className="w-full inline-flex justify-start items-center gap-2">
            <img
              className="w-9 h-9 rounded-full border border-stone-50"
              src="https://placehold.co/36x36"
              alt="profile"
            />
            <div className="inline-flex flex-col justify-center items-start gap-0.5">
              <div className="text-center justify-start text-zinc-900 text-sm font-medium font-['Pretendard'] leading-5">
                KUIT
              </div>
              <div className="text-center justify-start text-zinc-400 text-[10px] font-normal font-['Pretendard']">
                @KUIT PM
              </div>
            </div>
          </div>

          {/* 입력 영역 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 작성해 주세요."
            className="w-full min-h-32 bg-white text-zinc-900 text-sm font-normal font-['Pretendard'] leading-6 placeholder-zinc-400 resize-none border-none outline-none focus:outline-none"
          />
        </div>

        {/* 글자 수 */}
        <div className="w-full text-right text-zinc-400 text-xs font-normal font-['Pretendard']">
          {content.length}/500
        </div>

        {/* 해시태그 */}
        <div>
          <HashtagInput
            hashtags={hashtags}
            onHashtagsChange={setHashtags}
            onToast={(message) => console.log(message)}
          />
        </div>

        {/* 사진 */}
        <div>
          <ImageUpload images={images} onImagesChange={setImages} />
        </div>
      </main>

      {/* 제출 버튼 */}
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
              사담을 성공적으로 게시했어요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
