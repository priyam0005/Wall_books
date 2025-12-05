import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ReqAction } from '../store/NotiFicationStore/ReqList';
import { UserPlus, X, Check } from 'lucide-react';

export default function NotificationCard({ user }) {
  const token = localStorage.getItem('auth');
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionTaken, setActionTaken] = useState(null);

  const handleAccept = async (data) => {
    setIsProcessing(true);
    console.log(data.id);
    const resultAction = await dispatch(
      ReqAction({ token: token, type: data.type, senderId: data.id })
    );

    if (ReqAction.fulfilled.match(resultAction)) {
      console.log('the request got accepted');
      setActionTaken('accepted');
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    } else if (ReqAction.pending.match(resultAction)) {
      console.log('wait user....');
    } else if (ReqAction.rejected.match(resultAction)) {
      console.log('the request got rejected for some reason');
      setIsProcessing(false);
    }
  };

  const handleDecline = async (data) => {
    setIsProcessing(true);
    console.log(data.id);
    const resultAction = await dispatch(
      ReqAction({ token: token, type: data.type, senderId: data.id })
    );

    if (ReqAction.fulfilled.match(resultAction)) {
      setActionTaken('declined');
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#111111] rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 overflow-hidden group">
      <div className="p-4 md:p-5">
        <div className="flex items-start gap-4">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            <img
              src={user.profilePic}
              alt={user.displayName}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-gray-800 group-hover:ring-gray-700 transition-all duration-300"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center ring-2 ring-[#111111]">
              <UserPlus className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Name and Message */}
            <div className="mb-3">
              <h3 className="text-white text-base md:text-lg font-semibold mb-1 truncate">
                {user.displayName}
              </h3>
              <p className="text-gray-400 text-sm">wants to connect with you</p>
            </div>

            {/* Action Buttons */}
            {actionTaken === null ? (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() =>
                    handleAccept({ id: user.userId, type: 'accept' })
                  }
                  disabled={isProcessing}
                  className="flex-1 min-w-[100px] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  {isProcessing ? 'Processing...' : 'Accept'}
                </button>
                <button
                  onClick={() =>
                    handleDecline({ id: user.userId, type: 'reject' })
                  }
                  disabled={isProcessing}
                  className="flex-1 min-w-[100px] px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                  Decline
                </button>
              </div>
            ) : (
              <div
                className={`px-4 py-2.5 rounded-lg text-sm font-medium text-center ${
                  actionTaken === 'accepted'
                    ? 'bg-green-900/30 text-green-400 border border-green-800/50'
                    : 'bg-red-900/30 text-red-400 border border-red-800/50'
                }`}
              >
                {actionTaken === 'accepted'
                  ? '✓ Request Accepted'
                  : '✗ Request Declined'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
