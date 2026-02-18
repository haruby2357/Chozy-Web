import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomSheet from "./BottomSheet";
import SheetRow from "./SheetRow";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import SuccessModal from "../../../components/SuccessModal";

import notInterestedIcon from "../../../assets/community/notInterested.svg";
import blockIcon from "../../../assets/community/block.svg";
import editIcon from "../../../assets/community/edit.svg";
import deleteIcon from "../../../assets/community/delete.svg";

type Props = {
  open: boolean;
  onClose: () => void;
  isMine: boolean;

  // 고정 액션을 위해 필요한 식별자만 받자
  feedId: number;
  authorUserId: string; // 차단/관심없음 대상이 작성자라면
};

export default function FeedEtcSheet({
  open,
  onClose,
  isMine,
  feedId,
  authorUserId,
}: Props) {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEdit = () => {
    onClose();
  };

  const handleDelete = async () => {
    onClose();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    onClose();

    try {
      // TODO: API 호출로 게시글 삭제
      // const res = await deletePost(feedId);
      // if (res.code === 1000) {
      //   setShowSuccess(true);
      //   setTimeout(() => {
      //     navigate(-1);
      //   }, 2000);
      // }

      // 임시로 성공 모달 표시
      setShowSuccess(true);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleNotInterested = async () => {
    onClose();
    console.log("not interested", feedId);
  };

  const handleBlock = async () => {
    onClose();
    const ok = window.confirm(`@${authorUserId} 님을 차단할까요?`);
    if (!ok) return;

    console.log("block", authorUserId);
  };

  return (
    <>
      <BottomSheet open={open} onClose={onClose}>
        <div className="overflow-hidden">
          {isMine ? (
            <div className="divide-y divide-[#F2F2F2]">
              <SheetRow label="수정하기" icon={editIcon} onClick={handleEdit} />
              <SheetRow
                label="삭제하기"
                icon={deleteIcon}
                danger
                onClick={handleDelete}
              />
            </div>
          ) : (
            <div className="divide-y divide-[#F2F2F2]">
              <SheetRow
                label="관심 없음"
                icon={notInterestedIcon}
                onClick={handleNotInterested}
              />
              <SheetRow
                label="차단하기"
                icon={blockIcon}
                onClick={handleBlock}
              />
            </div>
          )}
        </div>
      </BottomSheet>

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <SuccessModal isOpen={showSuccess} message="삭제를 완료했어요" />
    </>
  );
}
