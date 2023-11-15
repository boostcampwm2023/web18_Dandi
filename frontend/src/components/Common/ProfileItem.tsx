import '../../globals.css';

interface ProfileItemProps {
  img: string;
  name: string;
}

const ProfileItem = ({ img, name }: ProfileItemProps) => {
  return (
    <div className="flex h-16 w-28 items-center gap-2">
      <img className="w-1/2 rounded-full" src={img} alt="Profile Img" />
      <span className="w-1/2 text-xl font-bold">{name}</span>
    </div>
  );
};

export default ProfileItem;
