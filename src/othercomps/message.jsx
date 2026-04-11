import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import io from 'socket.io-client';
import {
  Send,
  Settings,
  X,
  Reply,
  Users,
  Loader2,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import mikugif from '../assets/anime-dance.gif';

const SOCKET_URL = import.meta.env.VITE_API_BASE;

console.log(SOCKET_URL);

// ─── Poetic anonymous name generator ──────────────────────────────────────────
const ADJECTIVES = [
  'Weary',
  'Silent',
  'Drifting',
  'Hollow',
  'Amber',
  'Fading',
  'Pale',
  'Restless',
  'Soft',
  'Distant',
  'Velvet',
  'Ashen',
  'Twilight',
  'Wandering',
  'Forgotten',
  'Gentle',
  'Quiet',
  'Ancient',
  'Fleeting',
  'Mossy',
];
const NOUNS = [
  'Snowflake',
  'Lantern',
  'Tide',
  'Ember',
  'Canopy',
  'Sparrow',
  'Mist',
  'Shore',
  'Petal',
  'Horizon',
  'Cobblestone',
  'Reed',
  'Willow',
  'Compass',
  'Current',
  'Ash',
  'Feather',
  'Solstice',
  'Bark',
  'Thistle',
];
const SUFFIXES = [
  'in the Rain',
  'at Midnight',
  'Waiting for the Wind',
  'by the Window',
  'Before Dawn',
  'in Still Water',
  'Under Neon',
  'on the Rooftop',
  'Beyond the Map',
  'in Passing',
];

function generatePoeticName(seed) {
  const hash = (seed || 'anon')
    .split('')
    .reduce((acc, c) => c.charCodeAt(0) + ((acc << 5) - acc), 0);
  const abs = Math.abs(hash);
  const adj = ADJECTIVES[abs % ADJECTIVES.length];
  const noun = NOUNS[Math.floor(abs / ADJECTIVES.length) % NOUNS.length];
  const suffix =
    SUFFIXES[
      Math.floor(abs / (ADJECTIVES.length * NOUNS.length)) % SUFFIXES.length
    ];
  return `${adj} ${noun} ${suffix}`;
}

// ─── Geometric SVG avatar ──────────────────────────────────────────────────────
const PALETTE = [
  ['#7F77DD', '#AFA9EC'],
  ['#1D9E75', '#5DCAA5'],
  ['#D85A30', '#F0997B'],
  ['#378ADD', '#85B7EB'],
  ['#D4537E', '#ED93B1'],
  ['#BA7517', '#EF9F27'],
  ['#639922', '#97C459'],
  ['#A32D2D', '#E24B4A'],
];

function GeometricAvatar({ seed, size = 44, typingSpeed = 0 }) {
  const hash = useMemo(() => {
    return (seed || 'anon')
      .split('')
      .reduce((acc, c) => c.charCodeAt(0) + ((acc << 5) - acc), 0);
  }, [seed]);
  const abs = Math.abs(hash);
  const [c1, c2] = PALETTE[abs % PALETTE.length];
  const pulse = typingSpeed > 0;

  const shapes = useMemo(() => {
    const r = abs;
    return [
      {
        type: 'polygon',
        points: `${22 + (r % 8)},4 ${40 - (r % 6)},18 ${32 + (r % 5)},38 ${12 - (r % 4)},34 ${6 + (r % 7)},16`,
      },
      { type: 'circle', cx: 16 + (r % 12), cy: 16 + (r % 10), r: 7 + (r % 5) },
      {
        type: 'rect',
        x: 22 + (r % 8),
        y: 22 + (r % 6),
        w: 12 + (r % 8),
        h: 12 + (r % 6),
      },
    ];
  }, [abs]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      style={{
        borderRadius: '12px',
        flexShrink: 0,
        filter: pulse ? `drop-shadow(0 0 6px ${c1}88)` : 'none',
        transition: 'filter 0.4s ease',
      }}
    >
      <rect width="44" height="44" fill={c2} rx="12" />
      <polygon points={shapes[0].points} fill={c1} opacity="0.85" />
      <circle
        cx={shapes[1].cx}
        cy={shapes[1].cy}
        r={shapes[1].r}
        fill={c2}
        opacity="0.7"
      />
      <rect
        x={shapes[2].x}
        y={shapes[2].y}
        width={shapes[2].w}
        height={shapes[2].h}
        fill={c1}
        opacity="0.6"
        rx="3"
      />
    </svg>
  );
}

// ─── Slow-drifting ambient background ─────────────────────────────────────────
function AmbientBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        className="ambient-orb orb-a"
        style={{
          position: 'absolute',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #534AB722 0%, transparent 70%)',
          top: '-10vw',
          left: '-10vw',
        }}
      />
      <div
        className="ambient-orb orb-b"
        style={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #1D9E7518 0%, transparent 70%)',
          bottom: '-5vw',
          right: '-5vw',
        }}
      />
      <div
        className="ambient-orb orb-c"
        style={{
          position: 'absolute',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #D85A3014 0%, transparent 70%)',
          top: '30%',
          left: '40%',
        }}
      />
      <style>{`
        @keyframes driftA {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(4vw, 3vw) scale(1.05); }
          66% { transform: translate(-3vw, 5vw) scale(0.97); }
        }
        @keyframes driftB {
          0%,100% { transform: translate(0,0) scale(1); }
          40% { transform: translate(-5vw,-3vw) scale(1.08); }
          70% { transform: translate(3vw,-5vw) scale(0.95); }
        }
        @keyframes driftC {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(3vw, -4vw) scale(1.04); }
        }
        .orb-a { animation: driftA 28s ease-in-out infinite; }
        .orb-b { animation: driftB 35s ease-in-out infinite; }
        .orb-c { animation: driftC 22s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

// ─── Ink-reveal message animation ─────────────────────────────────────────────
const InkMessage = React.memo(({ children, isNew }) => {
  return (
    <motion.div
      initial={isNew ? { filter: 'blur(8px)', opacity: 0, y: 6 } : false}
      animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
});
InkMessage.displayName = 'InkMessage';

// ─── Typing ripple indicator ───────────────────────────────────────────────────
function TypingRipple({ name }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 16px',
        opacity: 0.7,
      }}
    >
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#7F77DD',
              animation: `rippleDot 1.2s ease-in-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
        {name} is writing…
      </span>
      <style>{`
        @keyframes rippleDot {
          0%,60%,100% { transform: scale(1); opacity: 0.5; }
          30% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Settings Modal ────────────────────────────────────────────────────────────
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
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);
      setPreviewPic(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemovePic = useCallback(() => {
    setProfilePic('');
    setPreviewPic('');
    if (fileInputRef.current) fileInputRef.current.value = '';
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
                  className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg cursor-pointer text-center transition-all shadow-lg"
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
              placeholder="Leave empty for a poetic anonymous name"
              maxLength="20"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <p className="mt-2 text-xs text-gray-400">
              Leave empty to receive a unique poetic identity
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

// ─── Message Component ─────────────────────────────────────────────────────────
const Message = React.memo(
  ({ message, onReply, isBeingRepliedTo, isNew, typingSpeed }) => {
    const [showReplyButton, setShowReplyButton] = useState(false);

    const tag = message.SenderTag || message.senderTag || 'unknown';

    // Derive poetic display name — only if name equals tag (i.e. no custom name set)
    const rawName = message.SenderName || message.senderName || tag;
    const displayName = rawName === tag ? generatePoeticName(tag) : rawName;
    const profilePic = message.profilePic || message.senderProfilePic;

    const formattedTime = useMemo(() => {
      return new Date(message.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }, [message.timestamp]);

    const handleReplyClick = useCallback(() => {
      if (onReply) onReply(message);
    }, [onReply, message]);

    // Frosted glass bubble style
    const bubbleStyle = {
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: isBeingRepliedTo
        ? '1px solid rgba(127,119,221,0.5)'
        : '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px',
      padding: '10px 14px',
      marginBottom: '8px',
      transition: 'background 0.2s, border 0.2s',
      boxShadow: isBeingRepliedTo ? '0 0 20px rgba(127,119,221,0.12)' : 'none',
      cursor: 'default',
    };

    return (
      <InkMessage isNew={isNew}>
        <div
          style={bubbleStyle}
          onMouseEnter={() => setShowReplyButton(true)}
          onMouseLeave={() => setShowReplyButton(false)}
        >
          {message.replyTo && (
            <div className="ml-14 mb-2 flex items-center space-x-2 text-xs text-gray-400 bg-gray-800/30 rounded-lg p-2 border-l-2 border-indigo-500">
              <Reply className="w-3 h-3 flex-shrink-0" />
              <span className="flex-shrink-0">Replying to</span>
              <span className="text-gray-300 font-semibold flex-shrink-0">
                {message.replyTo.senderName || 'Anonymous'}
              </span>
              <span className="flex-shrink-0">:</span>
              <span className="text-gray-400 truncate">
                {message.replyTo.content.substring(0, 50)}
                {message.replyTo.content.length > 50 ? '…' : ''}
              </span>
            </div>
          )}

          <div className="flex items-start space-x-3">
            {profilePic ? (
              <img
                src={profilePic}
                alt={displayName}
                className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-gray-700 shadow-lg"
                style={{ width: 44, height: 44, borderRadius: 12 }}
              />
            ) : (
              <GeometricAvatar seed={tag} size={44} typingSpeed={typingSpeed} />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline space-x-2 flex-wrap">
                <span className="font-bold text-white text-sm">
                  {displayName}
                </span>
                <span className="text-xs text-gray-500 font-mono">#{tag}</span>
                <span className="text-xs text-gray-500">{formattedTime}</span>
              </div>
              <div className="text-gray-200 mt-1.5 break-words leading-relaxed text-sm">
                {message.content}
              </div>
            </div>

            {showReplyButton && !isBeingRepliedTo && onReply && (
              <button
                onClick={handleReplyClick}
                className="bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white rounded-lg p-2 flex-shrink-0 transition-all shadow-lg"
                title="Reply to this message"
                style={{ opacity: 1 }}
              >
                <Reply className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </InkMessage>
    );
  },
  (prev, next) =>
    prev.message._id === next.message._id &&
    prev.isBeingRepliedTo === next.isBeingRepliedTo &&
    prev.isNew === next.isNew
);
Message.displayName = 'Message';

// ─── Loading Screen ────────────────────────────────────────────────────────────
const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-gray-900 via-black to-gray-800">
    <div className="flex flex-col items-center">
      <img src={mikugif} alt="Loading…" className="w-80 h-80 object-contain" />
      <p className="mt-4 text-indigo-400 text-xl font-bold animate-pulse">
        Loading Messages…
      </p>
    </div>
  </div>
);

// ─── Empty State ───────────────────────────────────────────────────────────────
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

// ─── Main Component ────────────────────────────────────────────────────────────
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
  // typingUsers: { [socketId]: { name, tag, speed } }
  const [typingUsers, setTypingUsers] = useState({});
  const [newMessageIds, setNewMessageIds] = useState(new Set());

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const messageInputRef = useRef(null);
  const typingTimerRef = useRef(null);
  const lastKeystrokeRef = useRef(0);

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
      addSystemMessage('Connected to chat room');
    });

    socketRef.current.on('public_chat_history', (msgs) => {
      setMessages(msgs.reverse());
      setIsLoadingMessages(false);
    });

    socketRef.current.on('received_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      setNewMessageIds((prev) => new Set([...prev, msg._id]));
      // Remove "new" flag after animation
      setTimeout(() => {
        setNewMessageIds((prev) => {
          const next = new Set(prev);
          next.delete(msg._id);
          return next;
        });
      }, 800);
      // Remove typing indicator for sender
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[msg.socketId || msg.SenderTag || msg.senderTag];
        return next;
      });
    });

    socketRef.current.on('user_typing', (data) => {
      // data: { socketId, tag, name, speed }
      setTypingUsers((prev) => ({
        ...prev,
        [data.socketId || data.tag]: data,
      }));
      // Auto-clear after 3s of no updates
      setTimeout(() => {
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[data.socketId || data.tag];
          return next;
        });
      }, 3000);
    });

    socketRef.current.on('user_stopped_typing', (data) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[data.socketId || data.tag];
        return next;
      });
    });

    socketRef.current.on('user_joined', (data) => {
      addSystemMessage(`${data.name || data.tag || 'Someone'} joined`);
    });
    socketRef.current.on('user_left', (data) => {
      addSystemMessage(`${data.name || data.tag || 'Someone'} left`);
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
      addSystemMessage(`Error: ${error}`);
    });
    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      addSystemMessage('Disconnected from server');
    });

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [addSystemMessage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      });
    }
  }, [messages.length]);

  // Emit typing events with speed
  const handleInputChange = useCallback((e) => {
    setMessageInput(e.target.value);
    const now = Date.now();
    const speed = now - lastKeystrokeRef.current;
    lastKeystrokeRef.current = now;

    if (socketRef.current) {
      socketRef.current.emit('typing', { speed });
    }

    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      if (socketRef.current) socketRef.current.emit('stopped_typing');
    }, 2000);
  }, []);

  const handleSendMessage = useCallback(() => {
    const message = messageInput.trim();
    if (message && socketRef.current) {
      socketRef.current.emit('send_public_message', {
        content: message,
        profilePic: profilePic || null,
        replyTo: replyingTo
          ? {
              id: replyingTo._id || replyingTo.id,
              senderName: replyingTo.SenderName || replyingTo.senderName,
              content: replyingTo.content,
            }
          : null,
      });
      setMessageInput('');
      setReplyingTo(null);
      clearTimeout(typingTimerRef.current);
      if (socketRef.current) socketRef.current.emit('stopped_typing');
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
    if (newProfilePic) localStorage.setItem('chatProfilePic', newProfilePic);
    else localStorage.removeItem('chatProfilePic');
    if (name) localStorage.setItem('chatDisplayName', name);
    else localStorage.removeItem('chatDisplayName');
    if (socketRef.current)
      socketRef.current.emit('set_name', name || '', newProfilePic || '');
  }, []);

  const handleReply = useCallback((message) => {
    setReplyingTo(message);
    messageInputRef.current?.focus();
  }, []);

  const typingList = useMemo(() => Object.values(typingUsers), [typingUsers]);
  const myTag = userTag;
  const activeTypers = typingList.filter((u) => u.tag !== myTag);

  if (isLoadingMessages) return <LoadingScreen />;

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #0d0d14 0%, #0a0a0f 50%, #0d1014 100%)',
        position: 'relative',
      }}
    >
      <AmbientBackground />

      <div
        style={{
          height: '100vh',
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(10,10,16,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Header — no green dot */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageCircle
                style={{ color: '#AFA9EC', width: 28, height: 28 }}
              />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>
                Async Chat
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                {displayName
                  ? `speaking as ${displayName}`
                  : 'you are anonymous'}
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.05)',
              padding: '8px 16px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Users style={{ width: 14, height: 14, color: '#5DCAA5' }} />
            <span
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {onlineCount}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messagesEndRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            minHeight: 0,
            padding: '8px 12px',
            scrollBehavior: 'auto',
          }}
        >
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            messages.map((msg, idx) => {
              if (msg.type === 'system') {
                return (
                  <div
                    key={msg._id || idx}
                    style={{
                      textAlign: 'center',
                      padding: '6px',
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.25)',
                      fontStyle: 'italic',
                    }}
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
                  isNew={newMessageIds.has(msgId)}
                  typingSpeed={0}
                />
              );
            })
          )}

          {/* Typing ripple indicators */}
          {activeTypers.map((u) => (
            <TypingRipple key={u.tag} name={generatePoeticName(u.tag)} />
          ))}
        </div>

        {/* Input Area */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: '16px',
            flexShrink: 0,
            backdropFilter: 'blur(12px)',
          }}
        >
          {replyingTo && (
            <div
              style={{
                marginBottom: 12,
                background: 'rgba(127,119,221,0.1)',
                borderRadius: 10,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid rgba(127,119,221,0.25)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Reply
                  style={{
                    width: 14,
                    height: 14,
                    color: '#AFA9EC',
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Replying to
                </span>
                <span
                  style={{ color: 'white', fontWeight: 700, flexShrink: 0 }}
                >
                  {replyingTo.SenderName ||
                    replyingTo.senderName ||
                    'Anonymous'}
                </span>
                <span
                  style={{
                    color: 'rgba(255,255,255,0.3)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {replyingTo.content}
                </span>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.4)',
                  padding: '4px',
                  borderRadius: 6,
                  flexShrink: 0,
                }}
              >
                <X style={{ width: 14, height: 14 }} />
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                ref={messageInputRef}
                type="text"
                value={messageInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={replyingTo ? 'Reply…' : 'Speak into the void…'}
                maxLength={500}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14,
                  padding: '12px 52px 12px 16px',
                  color: 'white',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  caretColor: '#AFA9EC',
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: messageInput.trim()
                    ? 'linear-gradient(135deg,#534AB7,#7F77DD)'
                    : 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: 10,
                  padding: '8px',
                  cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                <Send
                  style={{
                    width: 18,
                    height: 18,
                    color: messageInput.trim()
                      ? 'white'
                      : 'rgba(255,255,255,0.3)',
                  }}
                />
              </button>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14,
                padding: '0 16px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
              }}
              title="Settings"
            >
              <Settings style={{ width: 18, height: 18 }} />
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

      <style>{`
        *::-webkit-scrollbar { width: 6px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        *::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
