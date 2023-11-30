import API_PATH from '@util/apiPath';

export const getFriendList = async (userId: number) => {
  try {
    const response = await fetch(API_PATH.FRIEND.list(userId), {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('친구목록 조회에 실패했습니다.', error);
  }
};

export const recommendFriend = async (nickname: string) => {
  try {
    const response = await fetch(API_PATH.FRIEND.search(nickname), {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('내 친구목록 검색에 실패했습니다.', error);
  }
};

export const getRequestList = async (userId: number) => {
  try {
    const response = await fetch(API_PATH.FRIEND.request(userId), {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('진행중인 친구 요청목록 조회에 실패했습니다.', error);
  }
};

export const getSearchUserList = async (nickname: string) => {
  try {
    const response = await fetch(API_PATH.USER.searchUser(nickname), {
      credentials: 'include',
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('새로운 유저검색에 실패했습니다.', error);
  }
};

export const requestFriend = async (receiverId: number) => {
  try {
    const response = await fetch(API_PATH.FRIEND.send(receiverId), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ receiverId }),
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
  } catch (error) {
    console.error('친구요청에 실패했습니다.', error);
  }
};
