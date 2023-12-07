import { useNavigate } from 'react-router-dom';

import { PAGE_URL } from '@util/constants';

interface ProfileItemProps {
  id: number;
  img?: string;
  nickName?: string;
}

const ProfileItem = ({ id, img, nickName }: ProfileItemProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex h-16 w-28 cursor-pointer items-center gap-2"
      onClick={() => navigate(PAGE_URL.HOME + id)}
    >
      <img
        className="border-brown h-12 w-12 rounded-full border border-solid object-cover"
        src={img}
        alt="Profile Img"
      />
      <span className="w-1/2 text-lg ">{nickName}</span>
    </div>
  );
};

export default ProfileItem;
