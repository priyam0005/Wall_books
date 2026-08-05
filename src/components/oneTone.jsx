import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { friends } from '../store/Friends/friends';

const BACKEND_URL = 'https://sc-net.onrender.com';

const colors = {
  surface: '#131315',
  surfaceBright: '#39393b',
  surfaceContainer: '#201f21',
  surfaceContainerHigh: '#2a2a2c',
  surfaceContainerHighest: '#353437',
  surfaceContainerLow: '#1b1b1d',
  primary: '#cebdff',
  onPrimary: '#381385',
  onPrimaryFixed: '#21005e',
  onSurface: '#e5e1e4',
  onSurfaceVariant: '#cac4d4',
  outlineVariant: '#494552',
};

function LoadingScreen() {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen w-screen gap-6"
      style={{ background: colors.surface }}
    >
      <div className="relative w-16 h-16">
        <span
          className="absolute inset-0 rounded-full border-2 animate-ping"
          style={{ borderColor: `${colors.primary}40` }}
        />
        <span
          className="absolute inset-2 rounded-full border-2 animate-ping"
          style={{
            borderColor: `${colors.primary}60`,
            animationDelay: '150ms',
          }}
        />
        <span
          className="absolute inset-4 rounded-full border-2"
          style={{ borderColor: colors.primary }}
        />
      </div>
      <p
        className="text-sm font-semibold tracking-widest uppercase animate-pulse"
        style={{ color: colors.onSurfaceVariant, letterSpacing: '0.15em' }}
      >
        Loading chats…
      </p>
    </div>
  );
}

function ContactSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl">
      <div
        className="w-12 h-12 rounded-full flex-shrink-0 animate-pulse"
        style={{ background: colors.surfaceContainerHigh }}
      />
      <div className="flex-grow space-y-2">
        <div
          className="h-3 rounded-full w-2/3 animate-pulse"
          style={{ background: colors.surfaceContainerHigh }}
        />
        <div
          className="h-2.5 rounded-full w-1/2 animate-pulse"
          style={{ background: colors.surfaceContainerHighest }}
        />
      </div>
    </div>
  );
}

function ContactItem({ contact, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group ${
        contact.active
          ? 'bg-[#2a2a2c] border border-white/10'
          : 'hover:bg-white/5 border border-transparent'
      }`}
      style={
        contact.active ? { boxShadow: '0 0 20px 0 rgba(206,189,255,0.1)' } : {}
      }
    >
      <div className="relative flex-shrink-0">
        <img
          src={
            contact.avatar ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`
          }
          alt={contact.name}
          className={`w-12 h-12 rounded-full object-cover transition-all ${!contact.active ? 'grayscale group-hover:grayscale-0' : ''}`}
        />
        {contact.online && (
          <span
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
            style={{
              background: colors.primary,
              borderColor: colors.surfaceContainerHigh,
            }}
          />
        )}
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span
            className={`text-sm font-semibold truncate transition-colors ${
              contact.active
                ? 'text-[#e5e1e4]'
                : 'text-[#cac4d4] group-hover:text-[#e5e1e4]'
            }`}
          >
            {contact.name}
          </span>
          {contact.time && (
            <span className="text-[10px] text-[#cac4d4] flex-shrink-0 ml-1">
              {contact.time}
            </span>
          )}
        </div>
        <p
          className={`text-[11px] truncate ${contact.active ? 'text-[#cebdff]' : 'text-[#cac4d4]'}`}
        >
          {contact.preview || 'Start a conversation'}
        </p>
      </div>
    </button>
  );
}

function TypingIndicator({ name }) {
  return (
    <div className="flex items-end gap-2 max-w-[85%]">
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5"
        style={{
          background: 'rgba(32,31,33,0.8)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="w-1.5 h-1.5 rounded-full animate-bounce"
            style={{
              background: colors.onSurfaceVariant,
              animationDelay: `${delay}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const timeStr = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : message.time;

  if (message.sent || message.isSent) {
    return (
      <div className="flex items-end gap-3 max-w-[85%] sm:max-w-[80%] ml-auto flex-row-reverse">
        <div className="flex flex-col items-end gap-1">
          <div
            className="px-4 py-3 rounded-2xl rounded-tr-none backdrop-blur-md"
            style={{
              background:
                'linear-gradient(135deg, rgba(206,189,255,0.15) 0%, rgba(103,75,181,0.05) 100%)',
              border: '1px solid rgba(206,189,255,0.3)',
            }}
          >
            <p className="text-sm leading-relaxed text-[#cebdff]">
              {message.text || message.message}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#cac4d4] mr-1">{timeStr}</span>
            {message.status === 'read' && (
              <span
                className="material-symbols-outlined text-[#cebdff]"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: '14px' }}
              >
                done_all
              </span>
            )}
            {message.status === 'delivered' && (
              <span
                className="material-symbols-outlined text-[#cac4d4]"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: '14px' }}
              >
                done_all
              </span>
            )}
            {(message.status === 'sent' || !message.status) && (
              <span
                className="material-symbols-outlined text-[#cac4d4]"
                style={{ fontSize: '14px' }}
              >
                check
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[80%]">
      {message.avatar && (
        <img
          src={message.avatar}
          alt="avatar"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover mb-5 flex-shrink-0"
        />
      )}
      <div className="flex flex-col gap-1">
        <div
          className="px-4 py-3 rounded-2xl rounded-tl-none backdrop-blur-md"
          style={{
            background: 'rgba(32,31,33,0.8)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-sm leading-relaxed text-[#e5e1e4]">
            {message.text || message.message}
          </p>
        </div>
        <span className="text-[10px] text-[#cac4d4] ml-1">{timeStr}</span>
      </div>
    </div>
  );
}

function ChatHeader({ contact, onBackClick }) {
  return (
    <div
      className="h-14 sm:h-16 px-3 sm:px-6 border-b flex items-center justify-between backdrop-blur-sm flex-shrink-0"
      style={{
        background: 'rgba(19,19,21,0.2)',
        borderColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onBackClick}
          className="sm:hidden p-1.5 rounded-lg text-[#cac4d4] hover:text-[#e5e1e4] transition-colors"
          aria-label="Back to contacts"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '22px' }}
          >
            arrow_back
          </span>
        </button>
        <div className="relative">
          <img
            src={
              contact.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`
            }
            alt={contact.name}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
          />
          {contact.online && (
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
              style={{
                background: colors.primary,
                borderColor: colors.surface,
              }}
            />
          )}
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#e5e1e4]">
            {contact.name}
          </h3>
          <p
            className="text-[11px] flex items-center gap-1"
            style={{ color: colors.primary }}
          >
            {contact.online ? (
              <>
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: colors.primary }}
                />
                Online
              </>
            ) : (
              <span className="text-[#cac4d4]">Offline</span>
            )}
          </p>
        </div>
      </div>
      <button className="p-2 rounded-full text-[#cac4d4] hover:text-[#e5e1e4] transition-all">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '22px' }}
        >
          info
        </span>
      </button>
    </div>
  );
}

function MessageInput({ onSend, onTyping }) {
  const [value, setValue] = useState('');
  const typingTimer = useRef(null);

  const handleChange = (e) => {
    setValue(e.target.value);
    onTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => onTyping(false), 2000);
  };

  const handleSend = () => {
    const text = value.trim();
    if (!text) return;
    clearTimeout(typingTimer.current);
    onTyping(false);
    onSend(text);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="px-3 sm:px-6 py-3 sm:py-4 border-t backdrop-blur-xl flex-shrink-0"
      style={{
        background: 'rgba(19,19,21,0.4)',
        borderColor: 'rgba(255,255,255,0.05)',
      }}
    >
      <div
        className="flex items-center gap-2 sm:gap-4 rounded-2xl border p-1.5 sm:p-2 transition-all"
        style={{
          background: colors.surfaceContainer,
          borderColor: 'rgba(255,255,255,0.1)',
        }}
        onFocus={(e) =>
          e.currentTarget.setAttribute(
            'style',
            `background:${colors.surfaceContainer};border-color:rgba(206,189,255,0.4);box-shadow:0 0 20px 0 rgba(206,189,255,0.1)`
          )
        }
        onBlur={(e) =>
          e.currentTarget.setAttribute(
            'style',
            `background:${colors.surfaceContainer};border-color:rgba(255,255,255,0.1)`
          )
        }
      >
        <button className="p-1.5 sm:p-2 rounded-xl text-[#cac4d4] hover:text-[#e5e1e4] hover:bg-white/5 transition-all">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '20px' }}
          >
            attach_file
          </span>
        </button>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-grow bg-transparent border-none outline-none text-sm text-[#e5e1e4] placeholder-[#cac4d4]/50 py-1.5 sm:py-2"
        />
        <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2">
          <button className="hidden xs:block p-1.5 sm:p-2 rounded-xl text-[#cac4d4] hover:text-[#e5e1e4] hover:bg-white/5 transition-all">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '20px' }}
            >
              insert_emoticon
            </span>
          </button>
          <button
            onClick={handleSend}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center hover:opacity-90 transition-all"
            style={{ background: colors.primary, color: colors.onPrimaryFixed }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: '18px' }}
            >
              send
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-40">
      <span
        className="material-symbols-outlined"
        style={{ fontSize: '56px', color: colors.primary }}
      >
        chat_bubble_outline
      </span>
      <p
        className="text-sm font-semibold"
        style={{ color: colors.onSurfaceVariant }}
      >
        Select a contact to start chatting
      </p>
    </div>
  );
}

export default function WallbooksChat() {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.dost);

  // ── FIX: Parse user data once, outside effects, so it's stable ──────────
  const token = localStorage.getItem('auth');
  const userObj = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = userObj?._id;

  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messagesByContact, setMessagesByContact] = useState({});
  const [typingContacts, setTypingContacts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [socketReady, setSocketReady] = useState(false);

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const typingTimerRef = useRef({});
  // ── FIX: Keep activeContact accessible inside socket callbacks ───────────
  const activeContactRef = useRef(null);

  const loading = list == null;

  // ── 1. Fetch friends list from Redux on mount ────────────────────────────
  useEffect(() => {
    if (token) {
      dispatch(friends({ token }));
    }
  }, [dispatch, token]);

  // ── 2. Map API friends → contact objects ─────────────────────────────────
  useEffect(() => {
    if (!list?.length) return;

    setContacts((prev) =>
      list.map((f) => {
        const existing = prev.find((c) => c.id === f.userId);
        return {
          id: f.userId,
          name: f.displayName,
          avatar: f.profilePic,
          preview: existing?.preview || '',
          time: existing?.time || '',
          online: onlineUsers.has(f.userId),
          active: existing?.active || false,
        };
      })
    );
  }, [list]);

  // ── 3. Connect Socket.io ─────────────────────────────────────────────────
  useEffect(() => {
    // FIX: hard guard — never connect without a valid userId
    if (!currentUserId) {
      console.warn('[Socket] No currentUserId found — skipping socket init');
      return;
    }

    console.log('[Socket] Initialising for user:', currentUserId);

    const socket = io(`${BACKEND_URL}/private`, {
      // FIX: websocket first — avoids the 400 on Render's polling endpoint
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 3000,
      reconnectionDelayMax: 10000,
      // FIX: longer timeout so Render's cold-start has time to wake up
      timeout: 30000,
      withCredentials: true,
    });

    socketRef.current = socket;

    // ── FIX: catch-all listener for debugging — remove in production ────────
    socket.onAny((event, ...args) => {
      console.log('[Socket EVENT]', event, args);
    });

    socket.on('connect', () => {
      console.log(
        '[Socket] Connected — id:',
        socket.id,
        '| registering userId:',
        currentUserId
      );
      // FIX: emit user:register only after confirmed connect, with a verified userId
      socket.emit('user:register', currentUserId);
      setSocketReady(true);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] connect_error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.warn('[Socket] Disconnected — reason:', reason);
      setSocketReady(false);
    });

    socket.on('reconnect', (attempt) => {
      console.log(
        '[Socket] Reconnected after',
        attempt,
        'attempt(s) — re-registering userId'
      );
      // FIX: re-register after reconnection so the server maps the new socket id
      socket.emit('user:register', currentUserId);
    });

    socket.on('user:online', (userId) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
      setContacts((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, online: true } : c))
      );
    });

    socket.on('user:offline', (userId) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
      setContacts((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, online: false } : c))
      );
    });

    socket.on('private:message', (msg) => {
      // FIX: backend may use 'sender' field — handle both 'sender' and 'from'
      const partnerId = msg.sender || msg.from;
      console.log('[Socket] Received private:message from:', partnerId, msg);

      appendMessage(partnerId, { ...msg, isSent: false });

      setContacts((prev) =>
        prev.map((c) =>
          c.id === partnerId
            ? {
                ...c,
                preview: msg.message,
                time: new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              }
            : c
        )
      );

      // FIX: if the active chat is open with this sender, mark as read immediately
      if (activeContactRef.current?.id === partnerId && socket.connected) {
        socket.emit('private:message:read', {
          messageIds: [String(msg._id)],
          from: partnerId,
        });
      }
    });

    socket.on('private:message:sent', (msg) => {
      // FIX: backend may use 'receiver' or 'to' — handle both
      const partnerId = msg.receiver || msg.to;
      console.log(
        '[Socket] private:message:sent confirmed for partner:',
        partnerId,
        msg
      );

      setMessagesByContact((prev) => {
        const msgs = prev[partnerId] || [];
        // Replace the optimistic message with the confirmed one from server
        const updated = msgs.map((m) =>
          m._tempId === msg._tempId ? { ...msg, isSent: true } : m
        );
        // FIX: if server didn't return _tempId, just append instead of dropping
        const found = msgs.some((m) => m._tempId === msg._tempId);
        return {
          ...prev,
          [partnerId]: found ? updated : [...msgs, { ...msg, isSent: true }],
        };
      });
    });

    socket.on('private:message:read', ({ messageIds }) => {
      setMessagesByContact((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((uid) => {
          updated[uid] = updated[uid].map((m) =>
            messageIds.includes(String(m._id)) ? { ...m, status: 'read' } : m
          );
        });
        return updated;
      });
    });

    socket.on('private:typing', ({ from, isTyping }) => {
      // FIX: handle both 'from' and 'sender' field names
      const senderId = from;
      setTypingContacts((prev) => ({ ...prev, [senderId]: isTyping }));
      clearTimeout(typingTimerRef.current[senderId]);
      if (isTyping) {
        typingTimerRef.current[senderId] = setTimeout(
          () => setTypingContacts((p) => ({ ...p, [senderId]: false })),
          3000
        );
      }
    });

    return () => {
      console.log('[Socket] Cleaning up socket connection');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUserId]);

  // ── 4. Keep activeContactRef in sync ─────────────────────────────────────
  useEffect(() => {
    activeContactRef.current = activeContact;
  }, [activeContact]);

  // ── 5. Load history when a contact is selected ───────────────────────────
  useEffect(() => {
    if (!activeContact || !socketRef.current || !socketReady) return;

    // Skip if messages are already loaded for this contact
    if (messagesByContact[activeContact.id]?.length) return;

    console.log('[Socket] Requesting history for:', activeContact.id);

    socketRef.current.emit('private:history', {
      userId: currentUserId,
      partnerId: activeContact.id,
      page: 1,
      limit: 50,
    });

    const handleHistory = (msgs) => {
      console.log('[Socket] History received:', msgs?.length, 'messages');

      setMessagesByContact((prev) => ({
        ...prev,
        [activeContact.id]: msgs.map((m) => ({
          ...m,
          isSent: m.sender === currentUserId,
        })),
      }));

      const unreadIds = msgs
        .filter((m) => m.sender === activeContact.id && m.status !== 'read')
        .map((m) => String(m._id));

      if (unreadIds.length && socketRef.current) {
        console.log('[Socket] Marking', unreadIds.length, 'messages as read');
        socketRef.current.emit('private:message:read', {
          messageIds: unreadIds,
          from: activeContact.id,
        });
      }
    };

    socketRef.current.once('private:history', handleHistory);

    return () => {
      socketRef.current?.off('private:history', handleHistory);
    };
  }, [activeContact, socketReady]);

  // ── 6. Auto-scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesByContact, activeContact]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const appendMessage = useCallback((contactId, msg) => {
    setMessagesByContact((prev) => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), msg],
    }));
  }, []);

  const handleContactSelect = (contact) => {
    setContacts((prev) =>
      prev.map((c) => ({ ...c, active: c.id === contact.id }))
    );
    setActiveContact(contact);
    setSidebarOpen(false);
  };

  const handleSend = (text) => {
    if (!activeContact || !socketRef.current) {
      console.warn('[handleSend] Blocked — no activeContact or socket');
      return;
    }

    // FIX: check socket is actually connected before emitting
    if (!socketRef.current.connected) {
      console.warn('[handleSend] Socket not connected — message not sent');
      return;
    }

    const tempId = `temp_${Date.now()}`;
    const optimistic = {
      _tempId: tempId,
      sender: currentUserId,
      receiver: activeContact.id,
      message: text,
      isSent: true,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    appendMessage(activeContact.id, optimistic);

    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeContact.id
          ? {
              ...c,
              preview: text,
              time: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : c
      )
    );

    // FIX: emit with both field-name conventions so the backend recognises it
    // regardless of whether it expects 'to'/'from' or 'receiver'/'sender'
    const payload = {
      to: activeContact.id,
      receiver: activeContact.id,
      from: currentUserId,
      sender: currentUserId,
      message: text,
      _tempId: tempId,
    };

    console.log('[handleSend] Emitting private:message:', payload);
    socketRef.current.emit('private:message', payload);
  };

  const handleTyping = (isTyping) => {
    if (!activeContact || !socketRef.current?.connected) return;
    socketRef.current.emit('private:typing', {
      to: activeContact.id,
      from: currentUserId,
      isTyping,
    });
  };

  const activeMessages = activeContact
    ? messagesByContact[activeContact.id] || []
    : [];

  if (loading) return <LoadingScreen />;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <div
        className="flex bg-gradient-to-br from-black via-gray-900 to-black h-screen w-screen overflow-hidden relative"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-0 z-30 flex flex-col sm:relative sm:inset-auto sm:w-80 sm:flex-shrink-0 sm:translate-x-0 sm:z-10 w-full transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{
            background: 'rgba(19,19,21,0.97)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="p-5 pb-2 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#e5e1e4]">Recent Chats</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="sm:hidden p-1.5 rounded-lg text-[#cac4d4] hover:text-[#e5e1e4]"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '22px' }}
              >
                close
              </span>
            </button>
          </div>

          <div
            className="flex-grow overflow-y-auto px-3 py-2 space-y-1"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}
          >
            {contacts.length === 0 ? (
              <p className="text-center text-xs text-[#cac4d4] mt-8 px-4">
                No friends found. Connect with people to start chatting!
              </p>
            ) : (
              contacts.map((contact) => (
                <ContactItem
                  key={contact.id}
                  contact={{ ...contact, online: onlineUsers.has(contact.id) }}
                  onClick={() => handleContactSelect(contact)}
                />
              ))
            )}
          </div>

          <div className="p-5">
            <button
              className="w-full py-3 font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-sm"
              style={{
                background: colors.primary,
                color: colors.onPrimaryFixed,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '20px' }}
              >
                add
              </span>
              New Message
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col z-10 min-w-0 w-full sm:w-auto">
          {activeContact ? (
            <>
              <ChatHeader
                contact={{
                  ...activeContact,
                  online: onlineUsers.has(activeContact.id),
                }}
                onBackClick={() => setSidebarOpen(true)}
              />
              <div
                className="flex-grow overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 flex flex-col"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255,255,255,0.1) transparent',
                }}
              >
                {activeMessages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xs text-[#cac4d4] opacity-50">
                      No messages yet. Say hello!
                    </p>
                  </div>
                ) : (
                  <>
                    {activeMessages.map((msg, i) => (
                      <MessageBubble
                        key={msg._id || msg._tempId || i}
                        message={msg}
                      />
                    ))}
                    {typingContacts[activeContact?.id] && (
                      <TypingIndicator name={activeContact.name} />
                    )}
                  </>
                )}
                <div ref={chatEndRef} />
              </div>
              <MessageInput onSend={handleSend} onTyping={handleTyping} />
            </>
          ) : (
            <>
              <div
                className="sm:hidden h-14 px-3 border-b flex items-center gap-3 flex-shrink-0"
                style={{
                  background: 'rgba(19,19,21,0.2)',
                  borderColor: 'rgba(255,255,255,0.05)',
                }}
              >
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-1.5 rounded-lg text-[#cac4d4] hover:text-[#e5e1e4]"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '22px' }}
                  >
                    menu
                  </span>
                </button>
                <h2 className="text-base font-bold text-[#e5e1e4]">Chats</h2>
              </div>
              <EmptyChat />
            </>
          )}
        </main>
      </div>
    </>
  );
}
