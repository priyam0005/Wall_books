import { useDispatch } from 'react-redux';
import { ShowProfile } from '../store/userProfile/getProfile';
import { PostUser } from '../store/profile';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function UserCard({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = async () => {
    let userId = user.userId._id;
    console.log(userId);
    await dispatch(ShowProfile({ userId }));
    navigate('/Profilia');
  };

  return (
    <button onClick={handleClick}>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center hover:bg-gray-750 hover:border-blue-500 transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
          <img
            src={user.profilePic}
            alt={user.displayName}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="text-blue-400 font-semibold text-lg mb-1 hover:text-blue-300 transition-colors">
          {user.displayName}
        </h3>
        <p className="text-gray-400 text-sm">@{user.userId.username}</p>
      </div>
    </button>
  );
}

export default UserCard;
