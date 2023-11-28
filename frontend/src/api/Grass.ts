import API_PATH from '@/util/apiPath';

const getGrass = async (userId: number) => {
  try {
    const response = await fetch(API_PATH.DIARY.grass(userId), {
      credentials: 'include',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default getGrass;
