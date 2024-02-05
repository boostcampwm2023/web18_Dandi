import { Outlet, Navigate } from 'react-router-dom';

import useUserStore from '@store/useUserStore';

import { PAGE_URL } from '@util/constants';

const PrivateRoutes = () => {
  const isLogin = useUserStore().userId !== 0 ? true : false;
  return isLogin ? <Outlet /> : <Navigate to={PAGE_URL.LOGIN} />;
};

export default PrivateRoutes;
