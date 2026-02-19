import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomSheet from "./BottomSheet";
import SheetRow from "./SheetRow";

import notInterestedIcon from "../../../assets/community/notInterested.svg";
import blockIcon from "../../../assets/community/block.svg";
import editIcon from "../../../assets/community/edit.svg";
import deleteIcon from "../../../assets/community/delete.svg";

import ConfirmDeleteModal from "./ConfirmDeleteModal";
import SuccessModal from "../../../components/SuccessModal";
import { deleteFeed } from "../../../api/domains/community/etc/api";
import { blockUser } from "../../../api/domains/community/etc/blocks/api";
import { muteUser } from "../../../api/domains/community/etc/mutes";

type Props = {
  open: boolean;
  onClose: () => void;
  isMine: boolean;

  // 고정 액션을 위해 필요한 식별자만 받자
  feedId: number;
  authorUserPk: number;
  onBlocked?: () => void;
};

export default function FeedEtcSheet({
  open,
  onClose,
  isMine,
  feedId,
  authorUserPk,
  onBlocked,
}: Props) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [doneOpen, setDoneOpen] = useState(false);
  const [blockDoneOpen, setBlockDoneOpen] = useState(false);
  const [muteDoneOpen, setMuteDoneOpen] = useState(false);

  const handleEdit = () => {
    onClose();
  };

  console.log("delete feedId:", feedId);

  // 삭제하기
  const onClickDelete = () => {
    onClose();
    setConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    if (deleting) return;
    setConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (deleting) return;

    try {
      setDeleting(true);
      await deleteFeed(feedId);

      setConfirmOpen(false);
      setDoneOpen(true);

      window.setTimeout(() => {
        setDoneOpen(false);
        navigate(-1);
      }, 900);
    } catch (e: any) {
      console.error("게시글 삭제 실패:", e);
      alert(e?.message ?? "게시글 삭제에 실패했어요.");
    } finally {
      setDeleting(false);
    }
  };

  // 차단
  const handleBlock = async () => {
    onClose();

    try {
      const data = await blockUser(authorUserPk);
      console.log("blockUser response:", data);

      if (data.code !== 1000) {
        throw new Error(data.message ?? "차단에 실패했어요.");
      }

      setBlockDoneOpen(true);

      window.setTimeout(async () => {
        setBlockDoneOpen(false);
        onBlocked?.();
        navigate("/community", { replace: true });
      }, 900);
    } catch (e: any) {
      console.error("차단 실패:", e);
      alert(e?.message ?? "차단에 실패했어요.");
    }
  };

  // 관심없음
  const handleNotInterested = async () => {
    onClose();

    try {
      const data = await muteUser(authorUserPk);
      console.log("muteUser response:", data);

      if (data.code !== 1000) {
        throw new Error(data.message ?? "관심 없음 처리에 실패했어요.");
      }

      setMuteDoneOpen(true);

      window.setTimeout(async () => {
        setMuteDoneOpen(false);
        onBlocked?.();
        navigate("/community", { replace: true });
      }, 900);
    } catch (e: any) {
      console.error("관심 없음 실패:", e);
      alert(e?.message ?? "관심 없음 처리에 실패했어요.");
    }
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
                onClick={onClickDelete}
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

      <ConfirmDeleteModal
        open={confirmOpen}
        title="정말 삭제하시겠어요?"
        confirmText={deleting ? "삭제중..." : "예"}
        cancelText="아니요"
        confirmDisabled={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <SuccessModal isOpen={doneOpen} message="삭제를 완료했어요." />
      <SuccessModal isOpen={blockDoneOpen} message="차단 완료되었습니다." />
      <SuccessModal isOpen={muteDoneOpen} message="처리 완료되었습니다." />
    </>
  );
}
