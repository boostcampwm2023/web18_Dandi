import { Reaction } from './Reaction';
import defaultImage from '../../assets/image/defaultImage.png';

interface DiaryListProps {
  createdAt: string;
  profileImage: string;
  nickname: string;
  thumbnail: string;
  title: string;
  content: string;
  keywords: string[];
  reactionCount: number;
}

export const DiaryListItem = (props: DiaryListProps) => {
  const formatDateString = (str: string) => {
    const week = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    const DateObject = new Date(str);
    const year = DateObject.getFullYear();
    const month = DateObject.getMonth() + 1;
    const day = DateObject.getDate();
    const date = DateObject.getDay();

    return `${year}년 ${month}월 ${day}일 ${week[date]}`;
  };

  return (
    <div className="bg-[white] border-solid border-2 border-brown rounded-2xl p-3 mb-3">
      <div className="flex justify-between items-center mb-3">
        <p className="text-lg font-bold text-[black]">{props.title}</p>
        <p className="text-sm font-medium text-[black]">{formatDateString(props.createdAt)}</p>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex justify-start">
          <img className="w-[100%] mb-[23px]" src={props.thumbnail} alt="기본 이미지" />
        </div>
        <div className="mb-3 text-sm font-medium text-[black] line-clamp-3 whitespace-pre-wrap">
          <p>{props.content}</p>
        </div>
      </div>
      <div className="flex flex-wrap mb-3 gap-3 text-base text-[black]">
        {props.keywords.map((keyword) => (
          <div className="px-3 py-1 bg-mint rounded-lg">
            <p>#{keyword}</p>
          </div>
        ))}
      </div>
      <Reaction count={props.reactionCount} />
    </div>
  );
};
