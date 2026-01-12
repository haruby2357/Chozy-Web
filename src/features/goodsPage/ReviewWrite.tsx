import { useState } from "react";
import { useNavigate } from "react-router-dom";
import starIcon from "../../assets/community/star.svg";
import backIcon from "../../assets/all/back.svg";

export default function ReviewWrite() {
  const navigate = useNavigate();
  const [productLink, setProductLink] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      setImages(Array.from(files).slice(0, 4 - images.length));
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10">
        <div
          className="flex items-center justify-center px-4 relative"
          style={{ height: "48px" }}
        >
          <button
            onClick={handleBack}
            className="flex items-center justify-center flex-shrink-0 absolute left-4"
            style={{ width: "24px", height: "24px" }}
          >
            <span style={{ fontSize: "20px" }}>&lt;</span>
          </button>
          <h1
            style={{
              fontFamily: "Pretendard",
              fontWeight: 600,
              fontSize: "18px",
              lineHeight: "100%",
              letterSpacing: "0%",
              textAlign: "center",
            }}
          >
            리뷰 작성
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-6">
        {/* 상품 링크 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            상품 링크 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="상품 링크를 입력해 주세요."
            value={productLink}
            onChange={(e) => setProductLink(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-sm focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* 별점 */}
        <div>
          <label className="block text-sm font-medium mb-3">
            별점 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className="relative w-8 h-8 cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const newRating = x < rect.width / 2 ? star - 0.5 : star;
                  setRating(newRating);
                }}
              >
                {/* 비어있는 별 배경 */}
                <img
                  src={starIcon}
                  alt=""
                  className="w-full h-full opacity-20"
                />
                {/* 채워진 별 */}
                {rating >= star && (
                  <img
                    src={starIcon}
                    alt=""
                    className="w-full h-full absolute top-0 left-0"
                  />
                )}
                {/* 반 채워진 별 */}
                {rating > star - 1 && rating < star && (
                  <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
                    <img src={starIcon} alt="" className="w-full h-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 후기 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            후기 <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="내용을 작성해 주세요."
            value={review}
            onChange={(e) => setReview(e.target.value.slice(0, 500))}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 text-sm focus:outline-none focus:border-gray-500 resize-none h-32"
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {review.length} / 500
          </div>
        </div>

        {/* 사진 */}
        <div>
          <label className="block text-sm font-medium mb-3">
            사진 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {images.map((_, index) => (
              <div
                key={index}
                className="relative w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center"
              >
                <span className="text-gray-500 text-sm">이미지</span>
              </div>
            ))}
            {images.length < 4 && (
              <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <span className="text-2xl text-gray-400">+</span>
              </label>
            )}
          </div>
          <div className="text-right text-xs text-gray-500 mt-2">
            {images.length} / 4
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4">
        <button className="w-full py-3 bg-gray-300 text-white rounded-lg font-medium">
          게시하기
        </button>
      </div>
    </div>
  );
}
