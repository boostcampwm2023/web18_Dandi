import { Outlet, Navigate } from 'react-router-dom';
import { PAGE_URL } from '@util/constants';

const AuthRoutes = () => {
  const isLogin = localStorage.getItem('userId') ? true : false;
  return !isLogin ? <Outlet /> : <Navigate to={PAGE_URL.HOME} />;
};

export default AuthRoutes;
