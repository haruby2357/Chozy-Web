// 커뮤니티 사진 업로드 컴포넌트

import cameraIcon from "../../../assets/community/review-camera.svg";
import closeImgIcon from "../../../assets/community/close-img.svg";

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

export default function ImageUpload({
  images,
  onImagesChange,
}: ImageUploadProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 4 - images.length);
      onImagesChange([...images, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col">
      <label className="flex text-zinc-900 text-base font-medium font-['Pretendard'] mb-3 gap-1">
        사진
      </label>
      <div className="flex gap-1">
        {images.length < 4 && (
          <label className="relative w-15 h-15 aspect-square border-2 border-[#DADADA] rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <img src={cameraIcon} className="w-8 h-8" />
          </label>
        )}
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-15 h-15 aspect-square rounded flex items-center justify-center overflow-hidden"
          >
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-[2px] right-[2px] flex items-center justify-center z-10"
            >
              <img src={closeImgIcon} alt="Remove" className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      <div className="font-pretendard font-normal text-right text-[13px] text-[#B5B5B5] mt-2">
        {images.length} / 4
      </div>
    </div>
  );
}
