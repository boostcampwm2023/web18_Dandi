import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '@pages/Login';
import Home from '@pages/Home';
import Feed from '@pages/Feed';
import MyDiary from '@pages/MyDiary';
import Edit from '@pages/Edit';
import Detail from '@pages/Detail';
import AuthLogin from '@pages/OAuthLogin';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home/:userId" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/my-diary" element={<MyDiary />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/detail/:diaryId" element={<Detail />} />
        <Route path="/auth" element={<AuthLogin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
