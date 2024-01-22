import { useRef, useState } from 'react';

import useUpdateProfileMutation from '@hooks/useUpdateProfileMutation';

interface ProfileEditProps {
  profileImage: string;
  nickname: string;
}

const ProfileEdit = ({ profileImage, nickname }: ProfileEditProps) => {
  const userId = localStorage.getItem('userId') as string;

  const [newNickname, setNewNickname] = useState('');
  const [imageSrc, setImageSrc] = useState(profileImage);
  const [newProfileImage, setNewProfileImage] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateMutation = useUpdateProfileMutation(userId);

  const onChangeNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewNickname(e.target.value);
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewProfileImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    }
  };

  const onSubmit = () => {
    if (!newNickname && !newProfileImage) return;

    const formData = new FormData();

    if (newNickname) {
      formData.append('nickname', newNickname);
    }
    if (newProfileImage) {
      formData.append('profileImage', newProfileImage);
    }
    updateMutation.mutate(formData);
    setNewNickname('');
  };

  return (
    <div className="px-5">
      <p className="mb-20 text-2xl font-bold">내 정보 수정</p>
      <div className="relative mb-5 flex flex-col items-center">
        <div className="group relative cursor-pointer text-center" onClick={openFileInput}>
          <img
            className="mb-10 h-52 w-52 rounded-full object-cover group-hover:brightness-75"
            src={imageSrc}
            alt={`${nickname} 프로필 이미지`}
          />
          <p className="h-h2 invisible absolute top-2/3 w-full text-white group-hover:visible">
            이미지 변경
          </p>
        </div>

        <input ref={fileInputRef} className="hidden" type="file" onChange={onChangeFile} />

        <input
          className="border-brown mb-3 h-10 w-1/2 rounded-xl border pl-3 outline-none"
          type="text"
          name="friendSearch"
          id="friendSearch"
          placeholder={nickname}
          value={newNickname}
          onChange={onChangeNickname}
        />
        <button className="bg-mint w-1/2 rounded-xl py-2 font-bold" onClick={onSubmit}>
          수정하기
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;
