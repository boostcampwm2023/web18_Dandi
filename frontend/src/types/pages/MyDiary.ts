export type viewTypes = 'Day' | 'Week' | 'Month';
export type searchOptionsType = '키워드' | '제목 + 내용';

export const isViewTypes = (type: string): type is viewTypes => {
  return type === 'Day' || type === 'Week' || type === 'Month';
};
