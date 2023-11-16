import '../../globals.css';
import logo from '../../assets/image/logo.svg';
import naverLogin from '../../assets/image/naverLogin.svg';

const LoginForm = () => {
  return (
    <div className="border-default relative flex h-60 w-1/4 flex-col items-center justify-center gap-5 rounded-2xl border bg-[#fff] p-4 shadow-[0_0_20px_0_rgba(0,0,0,0.25)]">
      <img src={logo} alt="logo" className="w-1/4" />
      <span className="font-bold text-[#000]">SNS로 빠르게 단디 시작하기</span>
      <button className="w-1/2 items-center">
        <img src={naverLogin} alt="login" />
      </button>
    </div>
  );
};

export default LoginForm;
