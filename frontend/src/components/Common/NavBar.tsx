import logo from '../../assets/image/logo.svg';
import { NavLink, useNavigate } from 'react-router-dom';

export const NavBar = () => {
  const navigate = useNavigate();

  const logout = () => {
    navigate('/login');
  };

  return (
    <div className="mb-6 flex h-[121px] w-full min-w-[590px] items-center justify-between border-b-[1px] border-solid border-[#C7C1BB]">
      <NavLink to="/" className="ml-[5%]">
        <img src={logo} alt="logo" />
      </NavLink>
      <div className="text-default mr-[10%] flex gap-10">
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
        <p className="cursor-pointer" onClick={logout}>
          로그아웃
        </p>
      </div>
    </div>
  );
};
