import ReceivedRequest from '@components/Home/ReceivedRequest';
import SendRequest from '@components/Home/SendRequest';

interface FriendRequestProps {
  userId: number;
}

const FriendRequest = ({ userId }: FriendRequestProps) => {
  return (
    <div className="px-5">
      <div>
        <p className="mb-6 text-2xl font-bold">받은 신청</p>
        <div className="flex flex-wrap justify-between">
          <SendRequest userId={userId} />
        </div>
      </div>

      <div>
        <p className="mb-6 text-2xl font-bold">보낸 신청</p>
        <div className="flex flex-wrap justify-between">
          <ReceivedRequest userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default FriendRequest;
