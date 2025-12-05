import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Reqlist } from '../store/NotiFicationStore/ReqList';
import { useEffect } from 'react';
import NotificationCard from './notification';
import { Bell, BellOff } from 'lucide-react';

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
      <div className="min-h-screen bg-black pb-20 md:pb-8">
        {/* Header */}
        <div className="bg-[#0a0a0a] border-b border-gray-800 sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 rounded-lg border border-gray-800">
                  <Bell className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white">
                    Notifications
                  </h1>
                  {list && list.length > 0 && (
                    <p className="text-xs md:text-sm text-gray-400 mt-0.5">
                      {list.length} pending{' '}
                      {list.length === 1 ? 'request' : 'requests'}
                    </p>
                  )}
                </div>
              </div>

              {list && list.length > 0 && (
                <div className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-full">
                  <span className="text-white text-sm font-semibold">
                    {list.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {list && list.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 md:py-32 px-4">
            <div className="mb-6">
              <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800">
                <BellOff className="w-12 h-12 md:w-14 md:h-14 text-gray-600" />
              </div>
            </div>
            <h3 className="text-white text-lg md:text-xl font-semibold mb-2">
              All caught up!
            </h3>
            <p className="text-gray-400 text-sm md:text-base text-center max-w-sm">
              No new notifications yet. We'll let you know when something
              arrives.
            </p>
          </div>
        )}

        {/* Notifications List */}
        {list && list.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">
            <div className="space-y-3 md:space-y-4">
              {list.map((user) => (
                <NotificationCard key={user.userId} user={user} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Friendlist;
