import ProfileItem from '@components/Common/ProfileItem';

interface ReactionedFriendsProps {
  emoji: string;
  img: string;
  nickName: string;
}

interface GroupedReactions {
  [emoji: string]: ReactionedFriendsProps[];
}

const ReactionList = () => {
  const reactionedFriends = [
    {
      emoji: '😀',
      img: 'img',
      nickName: '윤주',
    },
    {
      emoji: '😀',
      img: 'img',
      nickName: '도훈',
    },
    {
      emoji: '😀',
      img: 'img',
      nickName: '종현',
    },
    {
      emoji: '😁',
      img: 'img',
      nickName: '효종',
    },
    {
      emoji: '😁',
      img: 'img',
      nickName: '수현',
    },
  ];

  const groupedReactions: GroupedReactions = reactionedFriends.reduce((acc, friend) => {
    if (!acc[friend.emoji]) {
      acc[friend.emoji] = [];
    }
    acc[friend.emoji].push(friend);
    return acc;
  }, {} as GroupedReactions);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-2xl font-bold">친구들의 반응</p>
      {Object.entries(groupedReactions).map(([emoji, friends]) => (
        <div key={emoji} className="flex items-center gap-4">
          <div className="text-4xl">{emoji}</div>
          <ul className="flex w-full flex-wrap rounded-2xl border bg-white p-4">
            {friends.map((friend, index) => (
              <li key={index} className="">
                <ProfileItem img={friend.img} nickName={friend.nickName} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ReactionList;
