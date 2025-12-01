import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Reqlist } from '../store/NotiFicationStore/ReqList';
import { useEffect } from 'react';

function Bellicon() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('auth');
  const { loading, error, list } = useSelector((state) => state.ReqList);
  console.log(list.length);

  const count = list.length;

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
      <div className="flex justify-center mb-8">
        <button className="relative inline-block p-3 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-8 h-8 text-gray-700" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 min-w-[1.25rem] flex items-center justify-center">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </button>
      </div>
    </>
  );
}

export default Bellicon;
