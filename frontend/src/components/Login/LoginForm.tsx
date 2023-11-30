import { Link } from 'react-router-dom';
import logo from '@assets/image/logo.svg';
import naverLogin from '@assets/image/naverLogin.svg';
import { NAVER_LOGIN_FORM_URL } from '@util/constants';

const LoginForm = () => {
  return (
    <div className="border-default relative flex  w-1/4 flex-col items-center justify-center gap-9 rounded-2xl bg-white py-16 shadow-[0_0_20px_0_rgba(0,0,0,0.25)]">
      <img src={logo} alt="메인 로고" className="w-1/4" />
      <p className="text-default font-bold">SNS로 빠르게 단디 시작하기</p>
      <Link to={NAVER_LOGIN_FORM_URL} className="flex w-1/2 justify-center">
        <img src={naverLogin} alt="네이버 로그인 버튼" className="w-4/5 rounded-lg" />
      </Link>
    </div>
  );
};

export default LoginForm;
