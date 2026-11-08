import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Train, Smile, Radio, AlertCircle, RotateCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

const MESSAGE_LIMIT = 500;
const emojis = ['😊','😂','🔥','🚀','🚆','⏰','⚠️','👍','❤️','🙌','😴','😤','🎉','💪','✌️','🫶'];

// Free public radio streams (CORS-friendly HLS/MP3)
const stations = [
  { name: 'Los 40', url: 'https://25553.live.streamtheworld.com/LOS40.mp3' },
  { name: 'Cadena 100', url: 'https://25563.live.streamtheworld.com/CADENA100.mp3' },
  { name: 'Europa FM', url: 'https://25593.live.streamtheworld.com/EUROPAFM.mp3' },
  { name: 'M80 Radio', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/M80RADIO.mp3' },
];

const ChatRoom = ({ user, room, zone, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [showRadio, setShowRadio] = useState(false);
  const [radioStation, setRadioStation] = useState(stations[0]);
  const [radioPlaying, setRadioPlaying] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [sending, setSending] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const audioRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);

    const addMessage = (msg) => {
      setMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
    };

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('id, room_id, zone, user_name, user_avatar, text, created_at')
        .eq('room_id', room.id)
        .order('created_at', { ascending: true })
        .limit(200);

      if (!active) return;
      if (error || !Array.isArray(data)) {
        setLoadError(true);
      } else {
        setMessages(data);
      }
      setLoading(false);
    };

    fetchMessages();

    const channel = supabase
      .channel(`messages-${room.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${room.id}` }, (payload) => {
        if (active && payload.new) addMessage(payload.new);
      })
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [room.id, reloadKey]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const presenceChannel = supabase.channel('renfe_presence');
    presenceChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannel.track({ room_id: room.id, user: user?.name });
      }
    });
    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [room.id, user?.name]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (radioPlaying) {
      audioRef.current.src = radioStation.url;
      audioRef.current.play().catch(() => setRadioPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [radioPlaying, radioStation]);

  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text || sending) return;

    setSending(true);
    setSendError(false);
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        room_id: room.id,
        zone,
        user_name: user?.name || 'Invitado',
        user_avatar: user?.img || '',
        text,
      }])
      .select('id, room_id, zone, user_name, user_avatar, text, created_at')
      .maybeSingle();

    setSending(false);
    if (error || !data) {
      setSendError(true);
      return;
    }
    setNewMessage('');
    setShowEmojis(false);
    setMessages(prev => (prev.some(m => m.id === data.id) ? prev : [...prev, data]));
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col overflow-hidden">
      <audio ref={audioRef} preload="none" />

      <header className="flex items-center justify-between px-5 py-4 bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl text-zinc-400" aria-label="Volver">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-renfe-red/20 p-2 rounded-xl"><Train className="text-renfe-red" size={18} /></div>
            <div>
              <h3 className="font-bold text-sm leading-none mb-0.5">{room?.name || 'Chat'}</h3>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{zone}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRadio(!showRadio)}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${showRadio ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            title="Radio"
          >
            <Radio size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Radio</span>
          </button>
          <div className="text-right hidden sm:block">
            <div className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Viajando como</div>
            <div className="text-xs font-bold text-blue-400">{user?.name}</div>
          </div>
          {user?.img && <img src={user.img} className="w-9 h-9 rounded-xl bg-zinc-800 border-2 border-blue-500/30" alt="Tu avatar" />}
        </div>
      </header>

      <AnimatePresence>
        {showRadio && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-zinc-900 border-b border-zinc-800 overflow-hidden shrink-0"
          >
            <div className="px-5 py-3 flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${radioPlaying ? 'bg-blue-500 animate-pulse' : 'bg-zinc-700'}`}>
                <Radio size={14} className="text-white" />
              </div>
              <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide">
                {stations.map((s) => (
                  <button key={s.name}
                    onClick={() => { setRadioStation(s); setRadioPlaying(true); }}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      radioStation.name === s.name && radioPlaying
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setRadioPlaying(!radioPlaying)}
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  radioPlaying ? 'bg-red-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
              >
                {radioPlaying ? 'Parar' : 'Play'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-hide">
        {loading && (
          <p className="text-center text-xs text-zinc-500 font-bold uppercase tracking-widest">Cargando mensajes...</p>
        )}
        {!loading && loadError && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <AlertCircle className="text-red-400" size={28} />
            <p className="text-sm text-zinc-400">No se pudieron cargar los mensajes.</p>
            <button onClick={() => setReloadKey(k => k + 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700">
              <RotateCw size={14} /> Reintentar
            </button>
          </div>
        )}
        {!loading && !loadError && messages.length === 0 && (
          <p className="text-center text-sm text-zinc-500 py-8">Todavía no hay mensajes. Sé el primero en escribir.</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.user_name === user?.name;
          return (
            <motion.div key={msg.id}
              initial={{ opacity: 0, x: isMe ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              {!isMe && msg.user_avatar && (
                <img src={msg.user_avatar} className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-800 shrink-0 self-end" alt="" />
              )}
              <div className={`max-w-[78%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && (
                  <span className="text-[10px] font-bold text-zinc-400 mb-1 ml-1">
                    {msg.user_name} · <span className="text-zinc-500">{msg.zone}</span>
                  </span>
                )}
                <div className={`px-4 py-3 rounded-2xl border text-sm font-medium leading-relaxed ${
                  isMe
                    ? 'bg-blue-600 border-blue-500 text-white rounded-tr-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-100 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[9px] mt-1 text-zinc-500">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showEmojis && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="bg-zinc-900 border-t border-zinc-800 px-4 py-3 grid grid-cols-8 gap-2 shrink-0"
          >
            {emojis.map(e => (
              <button key={e} type="button" onClick={() => setNewMessage(prev => (prev + e).slice(0, MESSAGE_LIMIT))}
                className="text-2xl hover:scale-125 transition-transform p-1 rounded-xl"
              >{e}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-3 sm:px-5 pb-6 sm:pb-8 pt-3 bg-zinc-900 border-t border-zinc-800 shrink-0 w-full">
        {sendError && (
          <p className="text-red-400 text-xs font-bold mb-2 flex items-center gap-1">
            <AlertCircle size={12} /> No se pudo enviar el mensaje. Inténtalo de nuevo.
          </p>
        )}
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex items-center gap-1.5 sm:gap-2 w-full max-w-full">
          <button type="button" onClick={() => setShowEmojis(!showEmojis)} aria-label="Emojis"
            className={`p-2.5 sm:p-3 rounded-2xl transition-all shrink-0 ${showEmojis ? 'bg-yellow-500/20 text-yellow-400' : 'text-zinc-400 hover:text-white'}`}>
            <Smile size={22} />
          </button>
          <input
            type="text"
            value={newMessage}
            maxLength={MESSAGE_LIMIT}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe algo..."
            className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 text-white px-4 py-3 sm:py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm"
          />
          <button type="submit" disabled={!newMessage.trim() || sending} aria-label="Enviar"
            className="p-2.5 sm:p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 disabled:opacity-30 transition-all shrink-0 active:scale-90">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
