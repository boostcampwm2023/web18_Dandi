export const NAVER_LOGIN_FORM_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${
  import.meta.env.VITE_NAVER_CLIENT_ID
}&state=${import.meta.env.VITE_NAVER_CLIENT_SECRET}&redirect_uri=${
  import.meta.env.VITE_NAVER_CALLBACK_URL
}&scope=name,email,profile_image,nickname`;

export const naverLogin = async (code: string, state: string) => {
  try {
    const response = await fetch('http://223.130.146.253:3000/auth/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({
        code,
        state,
        socialType: 'naver',
      }),
    });

    if (!response.ok) throw new Error('올바른 네트워크 응답이 아닙니다.');
    const { id } = await response.json();
    return id;
  } catch (error) {
    console.error('로그인에 실패했습니다.', error);
  }
};
