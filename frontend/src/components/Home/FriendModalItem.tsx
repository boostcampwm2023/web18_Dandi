import { useNavigate } from 'react-router-dom';

interface FriendModalItemProps {
  email: string;
  profileImage: string;
  nickname: string;
  userId: string;
  type: string;
}

const FriendModalItem = ({ email, profileImage, nickname, userId, type }: FriendModalItemProps) => {
  const navigate = useNavigate();
  const goFriendHome = () => {
    navigate(`/home/${userId}`);
  };

  const getButtonElement = (type: string) => {
    if (type === 'list') {
      return (
        <button className="bg-mint w-[80%] rounded-md border-none px-2 py-1 text-[0.7rem] font-bold">
          친구 삭제
        </button>
      );
    }
    if (type === 'received') {
      return (
        <div className="flex gap-2">
          <button className="bg-red w-full rounded-md border-none px-2 py-1 text-[0.7rem] font-bold text-white">
            거절
          </button>
          <button className="bg-mint w-full rounded-md border-none px-2 py-1 text-[0.7rem] font-bold">
            수락
          </button>
        </div>
      );
    }

    if (type === 'send') {
      return (
        <button className="bg-red w-[80%] rounded-md border-none px-2 py-1 text-[0.7rem] font-bold text-white">
          신청 취소
        </button>
      );
    }
  };

  const buttonContent = getButtonElement(type);

  return (
    <div className="mb-5 mr-3 flex">
      <img
        className="mr-3 h-16 w-16 cursor-pointer rounded-full"
        onClick={goFriendHome}
        src={profileImage}
        alt={`${nickname} 프로필 이미지`}
      />
      <div className="flex flex-col">
        <p className="text-sm font-bold">{nickname}</p>
        <p className="text-gray text-xs">{email}</p>
        {buttonContent}
      </div>
    </div>
  );
};

export default FriendModalItem;
