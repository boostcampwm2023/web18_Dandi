import { Outlet, Navigate } from 'react-router-dom';

import useUserStore from '@store/useUserStore';

import { PAGE_URL } from '@util/constants';

const AuthRoutes = () => {
  const isLogin = useUserStore().userId !== 0 ? true : false;
  return isLogin ? <Navigate to={PAGE_URL.HOME} /> : <Outlet />;
};

export default AuthRoutes;
