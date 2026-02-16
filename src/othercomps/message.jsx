import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import io from 'socket.io-client';
import {
  BookOpen,
  Send,
  Settings,
  X,
  Reply,
  Users,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import mikugif from '../assets/anime-dance.gif';

const SOCKET_URL = 'https://sc-net.onrender.com';

// Memoized theme colors to avoid recalculation
const AVATAR_COLORS = [
  'from-red-500 to-red-600',
  'from-orange-500 to-orange-600',
  'from-amber-500 to-amber-600',
  'from-yellow-500 to-yellow-600',
  'from-lime-500 to-lime-600',
  'from-green-500 to-green-600',
  'from-emerald-500 to-emerald-600',
  'from-teal-500 to-teal-600',
  'from-cyan-500 to-cyan-600',
  'from-sky-500 to-sky-600',
  'from-blue-500 to-blue-600',
  'from-indigo-500 to-indigo-600',
  'from-violet-500 to-violet-600',
  'from-purple-500 to-purple-600',
  'from-fuchsia-500 to-fuchsia-600',
  'from-pink-500 to-pink-600',
];

// Optimized Settings Modal - reduced animations for speed
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
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentName || '');
      setProfilePic(currentProfilePic || '');
      setPreviewPic(currentProfilePic || '');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, currentName, currentProfilePic]);

  const handleSubmit = useCallback(async () => {
    setIsSaving(true);
    await onSave(name.trim(), profilePic);
    setIsSaving(false);
    onClose();
  }, [name, profilePic, onSave, onClose]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
                <Settings className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white">User Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {previewPic ? (
                  <img
                    src={previewPic}
                    alt="Profile"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border-2 border-gray-600">
                    <svg
                      className="w-12 h-12 text-gray-400"
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
              <div className="flex flex-col space-y-2 flex-1">
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
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg cursor-pointer text-center transition-all shadow-lg hover:shadow-xl"
                >
                  Upload Image
                </label>
                {previewPic && (
                  <button
                    onClick={handleRemovePic}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all shadow-lg"
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
            <label className="block text-sm font-semibold text-gray-300 mb-2">
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
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <p className="mt-2 text-xs text-gray-400">
              Leave empty to use your default tag
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Highly optimized Message Component - minimal re-renders
const Message = React.memo(
  ({ message, onReply, isBeingRepliedTo }) => {
    const [showReplyButton, setShowReplyButton] = useState(false);

    const color = useMemo(() => {
      const tag = message.SenderTag || message.senderTag || 'unknown';
      const hash = tag
        .split('')
        .reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
      return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
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
      if (onReply) {
        onReply(message);
      }
    }, [onReply, message]);

    return (
      <div
        className={`group relative px-4 py-3 rounded-lg mb-2 transition-all ${
          isBeingRepliedTo
            ? 'bg-indigo-900/30 border border-indigo-500/50 shadow-lg shadow-indigo-500/10'
            : 'hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50'
        }`}
        onMouseEnter={() => setShowReplyButton(true)}
        onMouseLeave={() => setShowReplyButton(false)}
      >
        {message.replyTo && (
          <div className="ml-16 mb-2 flex items-center space-x-2 text-xs text-gray-400 bg-gray-800/30 rounded-lg p-2 border-l-2 border-indigo-500">
            <Reply className="w-3 h-3 flex-shrink-0" />
            <span className="flex-shrink-0">Replying to</span>
            <span className="text-gray-300 font-semibold flex-shrink-0">
              {message.replyTo.senderName || 'Anonymous'}
            </span>
            <span className="flex-shrink-0">:</span>
            <span className="text-gray-400 truncate">
              {message.replyTo.content.substring(0, 50)}
              {message.replyTo.content.length > 50 ? '...' : ''}
            </span>
          </div>
        )}
        <div className="flex items-start space-x-3">
          {profilePic ? (
            <img
              src={profilePic}
              alt={displayName}
              className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border-2 border-gray-700 shadow-lg"
            />
          ) : (
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 text-white font-bold text-sm shadow-lg`}
            >
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline space-x-2 flex-wrap">
              <span className="font-bold text-white hover:underline cursor-pointer">
                {displayName}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                #{displayTag}
              </span>
              <span className="text-xs text-gray-500">{formattedTime}</span>
            </div>
            <div className="text-gray-200 mt-1.5 break-words leading-relaxed">
              {message.content}
            </div>
          </div>
          {showReplyButton && !isBeingRepliedTo && onReply && (
            <button
              onClick={handleReplyClick}
              className="opacity-0 group-hover:opacity-100 bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white rounded-lg p-2 flex-shrink-0 transition-all shadow-lg"
              title="Reply to this message"
            >
              <Reply className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for better performance
    return (
      prevProps.message._id === nextProps.message._id &&
      prevProps.isBeingRepliedTo === nextProps.isBeingRepliedTo
    );
  }
);

Message.displayName = 'Message';

// Loading Screen Component
const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-gray-900 via-black to-gray-800">
    <div className="flex flex-col items-center">
      <img
        src={mikugif}
        alt="Loading..."
        className="w-80 h-80 object-contain"
      />
      <p className="mt-4 text-indigo-400 text-xl font-bold animate-pulse">
        Loading Messages...
      </p>
    </div>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4 py-20">
    <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-xl">
      <svg
        className="w-10 h-10 text-gray-600"
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
      <p className="text-lg font-bold text-gray-400">Welcome to #general</p>
      <p className="text-sm mt-1 text-gray-500">
        This is the beginning of the conversation
      </p>
    </div>
  </div>
);

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

  // Load saved user data on mount
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
        _id: `system-${Date.now()}`,
      },
    ]);
  }, []);

  // Socket connection with optimized settings
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 3000,
      timeout: 10000,
      transports: ['websocket', 'polling'],
      autoConnect: true,
      forceNew: false,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);

      const savedName = localStorage.getItem('chatDisplayName');
      const savedProfilePic = localStorage.getItem('chatProfilePic');

      socketRef.current.emit(
        'set_name',
        savedName || '',
        savedProfilePic || ''
      );
      addSystemMessage('🟢 Connected to chat room');
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
      addSystemMessage(`👋 ${name} joined the chat`);
    });

    socketRef.current.on('user_left', (data) => {
      const name = data.name || data.tag || 'Someone';
      addSystemMessage(`👋 ${name} left the chat`);
    });

    socketRef.current.on('online_count', (count) => {
      setOnlineCount(count);
    });

    socketRef.current.on('name_changed', (data) => {
      const savedName = localStorage.getItem('chatDisplayName');

      setDisplayName(data.name);
      setUserTag(data.tag);
      setProfilePic(data.profilePic || '');

      if (data.name === data.tag && savedName && savedName !== data.tag) {
        socketRef.current.emit(
          'set_name',
          savedName,
          localStorage.getItem('chatProfilePic') || ''
        );
      }
    });

    socketRef.current.on('name_error', (error) => {
      addSystemMessage(`❌ Error: ${error}`);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      addSystemMessage('🔴 Disconnected from server');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [addSystemMessage]);

  // Auto-scroll to bottom - optimized with requestAnimationFrame
  useEffect(() => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      });
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
    messageInputRef.current?.focus();
  }, []);

  if (isLoadingMessages) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="h-screen w-full max-w-4xl flex flex-col bg-gray-900/50 backdrop-blur-sm border-l border-r border-gray-800 shadow-2xl">
        {/* Header with original Wallbooks logo */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 px-4 py-4 flex items-center justify-between shadow-lg flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <BookOpen className="text-purple-400 w-8 h-8" />
              </div>
              {isConnected && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
              )}
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Wallbooks</h1>
              <p className="text-gray-400 text-xs">
                {displayName ? `Chatting as ${displayName}` : 'Public Chat'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-gray-800/80 px-4 py-2 rounded-full border border-gray-700">
              <Users className="w-4 h-4 text-green-500" />
              <span className="text-gray-300 text-sm font-semibold">
                {onlineCount}
              </span>
            </div>
          </div>
        </div>

        {/* Messages Container - Optimized scrolling */}
        <div
          ref={messagesEndRef}
          className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black min-h-0 px-2"
          style={{
            scrollBehavior: 'auto', // Faster scrolling
            willChange: 'scroll-position', // GPU acceleration hint
          }}
        >
          <div className="w-full py-2">
            {messages.length === 0 ? (
              <EmptyState />
            ) : (
              messages.map((msg, idx) => {
                if (msg.type === 'system') {
                  return (
                    <div
                      key={msg._id || idx}
                      className="text-center py-2 text-sm text-gray-400 font-medium"
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

        {/* Input Area */}
        <div className="bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 p-4 flex-shrink-0">
          {replyingTo && (
            <div className="mb-3 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg p-3 flex items-center justify-between border border-indigo-500/30">
              <div className="flex items-center space-x-2 text-sm flex-1 min-w-0">
                <Reply className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span className="text-gray-400 flex-shrink-0">Replying to</span>
                <span className="text-white font-bold flex-shrink-0">
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
                className="text-gray-400 hover:text-white ml-2 flex-shrink-0 hover:bg-gray-700 rounded-lg p-1.5 transition-all"
                title="Cancel reply (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex gap-2">
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
                className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 transition-all border border-gray-600 focus:border-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all shadow-lg disabled:shadow-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-gray-400 hover:text-white p-3 hover:bg-gray-700 rounded-xl transition-all border border-gray-600 hover:border-gray-500"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
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

      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: #1f2937;
        }
        div::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}
