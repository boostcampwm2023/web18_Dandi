import dashingAway from '@assets/image/dashingAway.png';

import ProfileItem from '@components/Common/ProfileItem';

import useReactionListQuery from '@hooks/useReactionListQuery';

interface ReactionListProps {
  diaryId: number;
}

interface ReactionedFriendsProps {
  userId: number;
  reaction: string;
  profileImage: string;
  nickname: string;
}

interface GroupedReactions {
  [reaction: string]: ReactionedFriendsProps[];
}

const ReactionList = ({ diaryId }: ReactionListProps) => {
  const { data, isLoading, isError } = useReactionListQuery(diaryId);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching data</p>;
  }

  const groupedReactions: GroupedReactions = data.reactionList.reduce(
    (acc: GroupedReactions, friend: ReactionedFriendsProps) => {
      if (!acc[friend.reaction]) {
        acc[friend.reaction] = [];
      }
      acc[friend.reaction].push(friend);
      return acc;
    },
    {} as GroupedReactions,
  );

  const reactionData = Object.entries(groupedReactions);

  if (reactionData.length === 0) {
    return (
      <div className="flex h-auto w-full flex-col items-center justify-center gap-3 pb-6">
        <img className="w-1/3" src={dashingAway} alt="반응이 없는 그림" />
        <p className="text-2xl font-bold">반응이 없어요.</p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-5">
      <p className="mb-5 text-2xl font-bold">친구들의 반응</p>
      <div className="flex max-h-96 flex-col gap-2 overflow-scroll">
        {reactionData.map(([emoji, friends]) => (
          <div key={emoji} className="flex items-center gap-4">
            <div className="text-4xl">{emoji}</div>
            <ul className="flex w-full flex-wrap rounded-2xl border bg-white p-4">
              {friends.map((friend, index) => (
                <li key={index} className="">
                  <ProfileItem
                    id={friend.userId}
                    img={friend.profileImage}
                    nickName={friend.nickname}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactionList;
