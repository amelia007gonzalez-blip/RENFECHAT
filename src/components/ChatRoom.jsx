import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Train, Smile, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

const emojis = ['😊', '😂', '🔥', '🚀', '🚆', '⏰', '⚠️', '👍', '❤️', '🙌'];

const ChatRoom = ({ user, room, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [nudge, setNudge] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    // Realtime logic remains same
  }, [room.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    const mockMessages = [
      { id: 1, user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', user_name: 'Marcos', text: '¿El de Barcelona va con retraso?', created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
      { id: 2, user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', user_name: 'Sara', text: 'Sí, 10 min por un problema en vía 4.', created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    ];
    setMessages(mockMessages);
  };

  const sendMessage = (text = newMessage) => {
    if (!text.trim()) return;
    const msg = {
      id: Date.now(),
      room_id: room.id,
      user_name: user.name || 'Invitado',
      user_avatar: user.img,
      text: text,
      created_at: new Date().toISOString(),
    };
    setMessages([...messages, msg]);
    setNewMessage('');
    setShowEmojis(false);
  };

  const handleNudge = () => {
    setNudge(true);
    // Send a system message or a special nudge message
    const msg = {
      id: Date.now(),
      room_id: room.id,
      user_name: 'SISTEMA',
      user_avatar: '',
      text: `🔥 ¡${user.name} ha enviado un ZUMBIDO!`,
      isSystem: true,
      created_at: new Date().toISOString(),
    };
    setMessages([...messages, msg]);
    setTimeout(() => setNudge(false), 500);
    
    // Play a "buzz" sound if preferred (omitted for now)
  };

  return (
    <motion.div 
      animate={nudge ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-zinc-950 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <header className="glass p-5 flex items-center justify-between border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-zinc-400">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
             <div className="bg-renfe-red/20 p-2 rounded-xl">
               <Train className="text-renfe-red" size={20} />
             </div>
             <div>
                <h3 className="font-bold text-sm sm:text-base leading-none mb-1">{room.name}</h3>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{room.desc}</span>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-0.5">VIAJANDO COMO</div>
            <div className="text-xs font-bold text-blue-400">{user.name}</div>
          </div>
          <img src={user.img} className="w-10 h-10 rounded-xl bg-zinc-800 border-2 border-blue-500/30" alt="Me" />
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 to-transparent"
      >
        <AnimatePresence>
          {messages.map((msg) => {
            const isMe = msg.user_name === user.name || msg.user_name === 'Tú';
            if (msg.isSystem) {
               return (
                  <motion.div key={msg.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex justify-center">
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full border border-blue-500/20 font-black uppercase tracking-widest">
                      {msg.text}
                    </span>
                  </motion.div>
               );
            }
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                {!isMe && <img src={msg.user_avatar} className="w-10 h-10 rounded-xl bg-zinc-800 shadow-lg border border-zinc-800" alt="" />}
                <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && <span className="text-[10px] font-bold text-zinc-500 mb-1 ml-1 block">{msg.user_name}</span>}
                  <div className={`p-4 rounded-3xl shadow-lg border ${
                    isMe 
                      ? 'bg-blue-600 border-blue-500 text-white rounded-tr-none' 
                      : 'glass border-zinc-800 text-zinc-100 rounded-tl-none'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    <span className={`text-[9px] mt-2 block opacity-50 ${isMe ? 'text-right' : ''}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-zinc-900 pb-10 border-t border-zinc-800 shrink-0">
        <AnimatePresence>
          {showEmojis && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-24 left-6 right-6 glass p-4 rounded-3xl border-zinc-800 grid grid-cols-5 gap-2"
            >
              {emojis.map(e => (
                <button key={e} onClick={() => { setNewMessage(prev => prev + e); setShowEmojis(false); }} className="text-2xl hover:bg-white/5 p-2 rounded-xl transition-all">
                  {e}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="relative flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className={`p-3 rounded-2xl transition-all ${showEmojis ? 'bg-zinc-800 text-yellow-400' : 'text-zinc-500 hover:text-white'}`}
          >
            <Smile size={24} />
          </button>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe algo en el tren..."
            className="flex-1 bg-zinc-950 border border-zinc-800 text-white p-5 pr-20 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-sm"
          />
          
          <div className="absolute right-2 flex items-center gap-1">
            <button 
              type="button"
              onClick={handleNudge}
              className="p-3 bg-zinc-800 text-orange-400 rounded-2xl hover:bg-zinc-700 transition-all shadow-lg active:scale-95 group relative"
            >
              <Zap size={20} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-orange-500 text-white text-[8px] px-2 py-1 rounded-lg font-bold">ZUMBIDO</span>
            </button>
            <button 
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all shadow-lg active:scale-95 disabled:opacity-30"
              disabled={!newMessage.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatRoom;
