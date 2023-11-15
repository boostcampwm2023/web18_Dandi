import '../../globals.css';

interface ProfileItemProps {
  img: string;
  name: string;
}

const ProfileItem = ({ img, name }: ProfileItemProps) => {
  return (
    <div className="flex gap-2 items-center w-28 h-16">
      <img className="w-1/2 rounded-full" src={img} alt="Profile Img" />
      <span className="w-1/2 font-bold text-xl">{name}</span>
    </div>
  );
};

export default ProfileItem;
