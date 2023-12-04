import { Outlet, Navigate } from 'react-router-dom';
import { PAGE_URL } from '@util/constants';

const AuthRoutes = () => {
  const isLogin =
    localStorage.getItem('userId') && localStorage.getItem('userId') !== 'undefined' ? true : false;
  return isLogin ? <Navigate to={PAGE_URL.HOME} /> : <Outlet />;
};

export default AuthRoutes;
