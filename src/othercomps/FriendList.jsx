import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Reqlist } from '../store/NotiFicationStore/ReqList';
import { useEffect } from 'react';
import NotificationCard from './notification';

function Friendlist() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('auth');
  const { loading, error, list } = useSelector((state) => state.ReqList);
  console.log(list.length);

  const mine = async () => {
    const resultAction = await dispatch(Reqlist({ token }));
    if (Reqlist.fulfilled.match(resultAction)) {
      console.log('we should have our reqList data ');
    } else if (Reqlist.pending.match(resultAction)) {
    } else {
      console.log(error);
    }
  };

  console.log(list.length);

  useEffect(() => {
    mine();
  }, [token, dispatch]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-4xl pl-3 mx-auto   py-4">
            <h1 className="text-xl font-semibold text-white">Notifications</h1>
          </div>
        </div>

        {list && list.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">No notifications yet</p>
          </div>
        )}

        {list.map((user) => {
          return (
            <div className="max-w-4xl mx-auto px-4 py-2" key={user.userId}>
              <div className="space-y-2 ">
                <NotificationCard
                  key={user.userId}
                  user={user}
                ></NotificationCard>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Friendlist;
