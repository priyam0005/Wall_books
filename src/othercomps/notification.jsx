import React from 'react';
import { useDispatch } from 'react-redux';
import { ReqAction } from '../store/NotiFicationStore/ReqList';
import { Reqlist } from '../store/NotiFicationStore/ReqList';

export default function NotificationCard({ user }) {
  const token = localStorage.getItem('auth');
  const dispatch = useDispatch();
  const handleAccept = async (data) => {
    console.log(data.id);
    const resultAction = await dispatch(
      ReqAction({ token: token, type: data.type, senderId: data.id })
    );

    if (ReqAction.fulfilled.match(resultAction)) {
      console.log('the request got accepted');
    } else if (ReqAction.pending.match(resultAction)) {
      console.log('wait user....');
    } else if (ReqAction.rejected.match(resultAction)) {
      console.log('the request got rejected for some reason');
    }
  };

  const handleDecline = async (data) => {
    console.log(data.id);
    await dispatch(
      ReqAction({ token: token, type: data.type, senderId: data.id })
    );
  };

  return (
    <div className="w-full max-w-md bg-zinc-800 rounded-lg overflow-hidden flex">
      {/* Profile Picture */}
      <div className="w-16 h-full flex-shrink-0">
        <img
          src={user.profilePic}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
        <div className="mb-3">
          <h3 className="text-fuchsia-400 text-base font-medium mb-0.5">
            {user.displayName}
          </h3>
          <p className="text-white text-sm">wants to connect with you</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleAccept({ id: user.userId, type: 'accept' })}
            className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            Accept
          </button>
          <button
            onClick={() => handleDecline({ id: user.userId, type: 'reject' })}
            className="px-4 py-1.5 bg-zinc-700 text-white rounded text-sm font-medium hover:bg-zinc-600 transition-colors flex-shrink-0"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
