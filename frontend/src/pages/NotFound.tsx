import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import chick from '@assets/image/chick.png';

import Button from '@components/Common/Button';

const NotFound = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    setTimeout(() => {
      goToHome();
    }, 3000);
  }, []);

  return (
    <main className="from-mint to-body flex h-screen w-screen flex-col items-center justify-center gap-5 bg-gradient-to-b">
      <img src={chick} alt="고개를 갸우뚱거리며 움직이는 병아리 이미지" />
      <p className="text-4xl font-bold">앗! 여긴 어디지?</p>
      <div className="text-center">
        <p>저런, 길을 잃으셨군요!</p>
        <p>걱정하지 마세요, 3초 뒤 홈으로 이동시켜 드릴게요.</p>
      </div>
      <Button type="normal" text="바로 홈으로 이동하기" onClick={goToHome} />
    </main>
  );
};

export default NotFound;
