import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '@pages/Login';
import Home from '@pages/Home';
import Feed from '@pages/Feed';
import MyDiary from '@pages/MyDiary';
import Edit from '@pages/Edit';
import Detail from '@pages/Detail';
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/my-diary" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
