import { NavLink, useNavigate } from 'react-router-dom';
import logo from '@assets/image/text_logo.webp';

import { logout } from '@api/Login';

const NavBar = () => {
  const navigate = useNavigate();

  const onClickLogout = async () => {
    const isLogout = await logout();

    if (isLogout) {
      localStorage.setItem('userId', '');
      navigate('/login');
    }
  };

  return (
    <div className="w-full">
      <div className="border-brown mb-6 hidden h-[110px]  w-full min-w-[590px] items-center justify-between border-b-[1px] border-solid bg-[#E4EEE8] sm:flex">
        <NavLink to="/" className="ml-[5%]">
          <img src={logo} alt="메인로고" className="w-24" />
        </NavLink>
        <div className="text-default mr-[10%] flex gap-10 text-lg">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
            <p>홈</p>
          </NavLink>
          <NavLink to="/feed" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
            <p>피드</p>
          </NavLink>
          <NavLink to="/edit" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
            <p>일기 쓰기</p>
          </NavLink>
          <NavLink to="/my-diary" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
            <p>내 일기</p>
          </NavLink>
          <p className="cursor-pointer" onClick={onClickLogout}>
            로그아웃
          </p>
        </div>
      </div>
      <div className="text-default fixed bottom-0 left-0 z-50 flex   w-full justify-between gap-10 bg-[#E4EEE8]  p-5 text-sm  sm:hidden ">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
          <p>홈</p>
        </NavLink>
        <NavLink to="/feed" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
          <p>피드</p>
        </NavLink>
        <NavLink to="/edit" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
          <p>일기 쓰기</p>
        </NavLink>
        <NavLink to="/my-diary" className={({ isActive }) => (isActive ? 'font-bold' : '')}>
          <p>내 일기</p>
        </NavLink>
        <p className="cursor-pointer" onClick={onClickLogout}>
          로그아웃
        </p>
      </div>
    </div>
  );
};

export default NavBar;
