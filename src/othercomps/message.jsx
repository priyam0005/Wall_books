import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import io from 'socket.io-client';
import { BookOpen } from 'lucide-react';
import mikugif from '../assets/anime-dance.gif';

const SOCKET_URL = 'https://sc-net.onrender.com';

function SettingsModal({
  isOpen,
  onClose,
  currentName,
  currentProfilePic,
  onSave,
}) {
  const [name, setName] = useState(currentName || '');
  const [profilePic, setProfilePic] = useState(currentProfilePic || '');
  const [previewPic, setPreviewPic] = useState(currentProfilePic || '');
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    setName(currentName || '');
    setProfilePic(currentProfilePic || '');
    setPreviewPic(currentProfilePic || '');
  }, [isOpen, currentName, currentProfilePic]);

  const handleSubmit = useCallback(() => {
    onSave(name.trim(), profilePic);
    onClose();
  }, [name, profilePic, onSave, onClose]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePic(base64String);
        setPreviewPic(base64String);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemovePic = useCallback(() => {
    setProfilePic('');
    setPreviewPic('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">User Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {previewPic ? (
                  <img
                    src={previewPic}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="profile-pic-upload"
                />
                <label
                  htmlFor="profile-pic-upload"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded cursor-pointer text-center"
                >
                  Upload Image
                </label>
                {previewPic && (
                  <button
                    onClick={handleRemovePic}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Max size: 5MB. Supports JPG, PNG, GIF
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your display name"
              maxLength="20"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-2 text-xs text-gray-400">
              Leave empty to use your default tag
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Message = React.memo(({ message, onReply, isBeingRepliedTo }) => {
  const [showReplyButton, setShowReplyButton] = useState(false);

  const color = useMemo(() => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500',
      'bg-emerald-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-sky-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-purple-500',
      'bg-fuchsia-500',
      'bg-pink-500',
    ];
    const tag = message.SenderTag || message.senderTag || 'unknown';
    const hash = tag
      .split('')
      .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return colors[Math.abs(hash) % colors.length];
  }, [message.SenderTag, message.senderTag]);

  const displayName = message.SenderName || message.senderName || 'Anonymous';
  const displayTag = message.SenderTag || message.senderTag || 'unknown';
  const profilePic = message.profilePic || message.senderProfilePic;

  const initials = useMemo(() => {
    if (displayName && displayName !== displayTag) {
      return displayName.substring(0, 2).toUpperCase();
    }
    return displayTag.substring(0, 2).toUpperCase();
  }, [displayName, displayTag]);

  const formattedTime = useMemo(() => {
    return new Date(message.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [message.timestamp]);

  const handleReplyClick = useCallback(() => {
    if (onReply && typeof onReply === 'function') {
      onReply(message);
    }
  }, [onReply, message]);

  return (
    <div
      className={`group relative px-4 py-3 border border-gray-800 rounded-lg mb-2 ${
        isBeingRepliedTo
          ? 'bg-indigo-900 bg-opacity-30 border-indigo-500'
          : 'hover:bg-gray-800 hover:bg-opacity-40 hover:border-gray-700'
      }`}
      onMouseEnter={() => setShowReplyButton(true)}
      onMouseLeave={() => setShowReplyButton(false)}
    >
      {message.replyTo && (
        <div className="ml-16 mb-1 flex items-center space-x-2 text-xs text-gray-500">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          <span>
            Replying to{' '}
            <span className="text-gray-400 font-semibold">
              {message.replyTo.senderName || 'Anonymous'}
            </span>
            : {message.replyTo.content.substring(0, 50)}
            {message.replyTo.content.length > 50 ? '...' : ''}
          </span>
        </div>
      )}
      <div className="flex items-start space-x-3 px-4 py-2">
        {profilePic ? (
          <img
            src={profilePic}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm`}
          >
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline space-x-2">
            <span className="font-semibold text-white hover:underline cursor-pointer">
              {displayName}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              #{displayTag}
            </span>
            <span className="text-xs text-gray-500">{formattedTime}</span>
          </div>
          <div className="text-gray-300 mt-1 break-words">
            {message.content}
          </div>
        </div>
        {showReplyButton && !isBeingRepliedTo && onReply && (
          <button
            onClick={handleReplyClick}
            className="opacity-0 group-hover:opacity-100 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded p-1.5 flex-shrink-0"
            title="Reply to this message"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

Message.displayName = 'Message';

export default function PublicChat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userTag, setUserTag] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [profilePic, setProfilePic] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    const savedName = localStorage.getItem('chatDisplayName');
    const savedProfilePic = localStorage.getItem('chatProfilePic');

    if (savedName) setDisplayName(savedName);
    if (savedProfilePic) setProfilePic(savedProfilePic);
  }, []);

  const addSystemMessage = useCallback((text) => {
    setMessages((prev) => [
      ...prev,
      {
        type: 'system',
        content: text,
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);

      const savedName = localStorage.getItem('chatDisplayName');
      const savedProfilePic = localStorage.getItem('chatProfilePic');

      socketRef.current.emit(
        'set_name',
        savedName || '',
        savedProfilePic || ''
      );
      addSystemMessage('Connected to chat room');
    });

    socketRef.current.on('public_chat_history', (msgs) => {
      setMessages(msgs.reverse());
      setIsLoadingMessages(false);
    });

    socketRef.current.on('received_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on('user_joined', (data) => {
      const name = data.name || data.tag || 'Someone';
      addSystemMessage(`${name} joined the chat`);
    });

    socketRef.current.on('user_left', (data) => {
      const name = data.name || data.tag || 'Someone';
      addSystemMessage(`${name} left the chat`);
    });

    socketRef.current.on('online_count', (count) => {
      setOnlineCount(count);
    });

    socketRef.current.on('name_changed', (data) => {
      console.log('Server confirmed name change:', data);

      const savedName = localStorage.getItem('chatDisplayName');

      setDisplayName(data.name);
      setUserTag(data.tag);
      setProfilePic(data.profilePic || '');

      if (data.name === data.tag && savedName && savedName !== data.tag) {
        console.log('Server returned default tag. Re-enforcing saved name...');
        socketRef.current.emit(
          'set_name',
          savedName,
          localStorage.getItem('chatProfilePic') || ''
        );
      }
    });

    socketRef.current.on('name_error', (error) => {
      console.error('Name change error:', error);
      addSystemMessage(`Error: ${error}`);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      addSystemMessage('Disconnected from server');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [addSystemMessage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSendMessage = useCallback(() => {
    const message = messageInput.trim();
    if (message && socketRef.current) {
      const messageData = {
        content: message,
        profilePic: profilePic || null,
        replyTo: replyingTo
          ? {
              id: replyingTo._id || replyingTo.id,
              senderName: replyingTo.SenderName || replyingTo.senderName,
              content: replyingTo.content,
            }
          : null,
      };
      socketRef.current.emit('send_public_message', messageData);
      setMessageInput('');
      setReplyingTo(null);
    }
  }, [messageInput, profilePic, replyingTo]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      } else if (e.key === 'Escape') {
        setReplyingTo(null);
      }
    },
    [handleSendMessage]
  );

  const handleSaveName = useCallback((name, newProfilePic) => {
    console.log('User manually saving name:', name);

    setDisplayName(name);
    setProfilePic(newProfilePic);

    if (newProfilePic) {
      localStorage.setItem('chatProfilePic', newProfilePic);
    } else {
      localStorage.removeItem('chatProfilePic');
    }

    if (name) {
      localStorage.setItem('chatDisplayName', name);
    } else {
      localStorage.removeItem('chatDisplayName');
    }

    if (socketRef.current) {
      socketRef.current.emit('set_name', name || '', newProfilePic || '');
    }
  }, []);

  const handleReply = useCallback((message) => {
    setReplyingTo(message);
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, []);

  return (
    <div className="h-screen flex items-center justify-center from-gray-900 via-black to-gray-800">
      {isLoadingMessages && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-85">
          <div className="flex flex-col items-center">
            <img
              src={mikugif}
              alt="Loading..."
              className="w-80 h-80 object-contain"
            />
            <p className="mt-4 text-cyan-400 text-xl font-semibold">
              Loading Messages...
            </p>
          </div>
        </div>
      )}

      <div className="h-screen w-full max-w-4xl flex flex-col bg-gray-900 border-l border-r border-gray-800">
        <div className="from-gray-900 via-black to-gray-800 border-b border-gray-700 px-4 py-3 flex items-center rounded-lg justify-between shadow-lg flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <BookOpen className="text-purple-400 w-8 h-8" />
              </div>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">WallBooks</h1>
              <p className="text-gray-400 text-xs">
                {displayName ? `Chatting as ${displayName}` : 'Public Chat'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 from-gray-900 via-black to-gray-800 bg-opacity-50 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-300 text-sm font-medium">
              {onlineCount} online
            </span>
          </div>
        </div>

        <div
          ref={messagesEndRef}
          className="flex-1 overflow-y-auto from-slate-900 via-black to-slate-800 min-h-0"
        >
          <div className="w-full">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4 py-20">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium">Welcome to #general</p>
                  <p className="text-sm mt-1">
                    This is the beginning of the conversation
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => {
                if (msg.type === 'system') {
                  return (
                    <div
                      key={idx}
                      className="text-center py-2 text-sm text-gray-500"
                    >
                      {msg.content}
                    </div>
                  );
                }

                const msgId = msg._id || msg.id;
                const replyId = replyingTo?._id || replyingTo?.id;
                const isReplied =
                  msgId && replyId && msgId.toString() === replyId.toString();

                return (
                  <Message
                    key={msgId || idx}
                    message={msg}
                    onReply={handleReply}
                    isBeingRepliedTo={isReplied}
                  />
                );
              })
            )}
          </div>
        </div>

        <div className="bg-gray-800 border-t border-gray-700 p-4 flex-shrink-0">
          {replyingTo && (
            <div className="mb-3 bg-gray-700 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm flex-1 min-w-0">
                <svg
                  className="w-4 h-4 text-indigo-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                <span className="text-gray-400 flex-shrink-0">Replying to</span>
                <span className="text-white font-semibold flex-shrink-0">
                  {replyingTo.SenderName ||
                    replyingTo.senderName ||
                    'Anonymous'}
                </span>
                <span className="text-gray-400 flex-shrink-0">:</span>
                <span className="text-gray-300 truncate">
                  {replyingTo.content}
                </span>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-400 hover:text-white ml-2 flex-shrink-0"
                title="Cancel reply (ESC)"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          <div className="flex">
            <div className="w-full relative">
              <input
                ref={messageInputRef}
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  replyingTo ? 'Reply to message...' : 'Message #general'
                }
                maxLength="500"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg ml-2"
              title="Settings"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentName={displayName}
          currentProfilePic={profilePic}
          onSave={handleSaveName}
        />
      </div>
    </div>
  );
}
