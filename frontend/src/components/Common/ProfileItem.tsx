import { useNavigate } from "react-router-dom";
import { PAGE_URL } from "@util/constants";

interface ProfileItemProps {
  id: number;
  img: string;
  nickName: string;
}

const ProfileItem = ({ id, img, nickName }: ProfileItemProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(PAGE_URL.HOME + id);
  }
  return (
    <div className="flex h-16 w-28 items-center gap-2 cursor-pointer" onClick={handleClick}>
      <img className="h-12 w-12 rounded-full object-cover" src={img} alt="Profile Img" />
      <span className="w-1/2 text-lg ">{nickName}</span>
    </div>
  );
};

export default ProfileItem;
