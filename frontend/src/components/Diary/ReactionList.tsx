import { useQuery } from '@tanstack/react-query';

import { getReactionList } from '@api/Reaction';

import ProfileItem from '@components/Common/ProfileItem';

interface ReactionListProps {
  diaryId: number;
}

interface ReactionedFriendsProps {
  reaction: string;
  profileImage: string;
  nickname: string;
}

interface GroupedReactions {
  [reaction: string]: ReactionedFriendsProps[];
}

const ReactionList = ({ diaryId }: ReactionListProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['reactionList', diaryId],
    queryFn: () => getReactionList(diaryId),
  });
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

  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xl font-bold">친구들의 반응</p>
      {Object.entries(groupedReactions).map(([emoji, friends]) => (
        <div key={emoji} className="flex items-center gap-4">
          <div className="text-4xl">{emoji}</div>
          <ul className="flex w-full flex-wrap rounded-2xl border bg-white p-4">
            {friends.map((friend, index) => (
              <li key={index} className="">
                <ProfileItem img={friend.profileImage} nickName={friend.nickname} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ReactionList;
