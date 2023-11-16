export const login = async () => {
  const response = await fetch('http://223.130.146.253:3000/auth/naver/login');

  if (response.ok) {
    console.log('로그인 성공!');
  }
};
