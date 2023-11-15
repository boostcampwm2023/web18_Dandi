import React from 'react';
import '../../globals.css';

interface ProfileItemProps {
  img: string;
  name: string;
}

// 테스트용 임시 img src
// src="https://plchldr.co/i/500x500"
const ProfileItem: React.FC<ProfileItemProps> = ({ img, name }) => {
  return (
    <div className="flex gap-2 items-center w-28 h-16">
      <img className="w-1/2 rounded-full" src={`data:image/png;base64,${img}`} alt="Profile Img" />
      <span className="w-1/2 font-bold text-xl">{name}</span>
    </div>
  );
};

export default ProfileItem;
