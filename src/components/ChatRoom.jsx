import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Info, ArrowLeft, MessageSquare, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ChatRoom = ({ user, room, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Fetch initial messages
    fetchMessages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`room-${room.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${room.id}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    // Mocking initial messages for now as table might not exist
    const mockMessages = [
      { id: 1, user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', user_name: 'Aneka', text: '¿Sabéis si el R16 lleva retraso hoy?', created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
      { id: 2, user_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', user_name: 'Felix', text: 'Yo voy en él y vamos puntuales, acabamos de pasar por Salou.', created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    ];
    setMessages(mockMessages);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      room_id: room.id,
      user_name: 'Tú',
      user_avatar: user.img,
      text: newMessage,
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
    
    // In a real app:
    // await supabase.from('messages').insert([message]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="glass p-5 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-zinc-400">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h3 className="font-bold flex items-center gap-2">
              <span className="text-renfe-red">●</span> {room.name}
            </h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{room.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold">{messages.length + 12} activos</div>
            <div className="text-[10px] text-zinc-500 font-medium">Tarragona Central</div>
          </div>
          <img src={user.img} className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 shadow-lg" alt="User" />
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
      >
        <div className="text-center">
          <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800">
            Hoy en el tren
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isMe = msg.user_name === 'Tú';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                {!isMe && <img src={msg.user_avatar} className="w-10 h-10 rounded-xl bg-zinc-800 shadow-md shrink-0 border border-zinc-800" alt="" />}
                <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && <span className="text-[10px] font-bold text-zinc-500 mb-1 ml-1 block">{msg.user_name}</span>}
                  <div className={`p-4 rounded-3xl shadow-sm ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'glass border-zinc-800 text-zinc-100 rounded-tl-none'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
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

      {/* Input */}
      <div className="p-6 bg-zinc-900/50 backdrop-blur-md border-t border-zinc-800">
        <form onSubmit={sendMessage} className="relative flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-zinc-900 border border-zinc-800 text-white p-5 pr-14 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-sm"
          />
          <button 
            type="submit"
            className="absolute right-2 p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all shadow-lg active:scale-95 disabled:opacity-50"
            disabled={!newMessage.trim()}
          >
            <Send size={20} />
          </button>
        </form>
        <div className="flex justify-center gap-8 mt-4">
          <button className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase">
            <MapPin size={12} /> Compartir Tren
          </button>
          <button className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase">
            <Info size={12} /> Incidencia
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
