import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Train, Smile, Zap, Radio } from 'lucide-react';

const STORAGE_KEY = 'trenconnect_messages';
const emojis = ['😊','😂','🔥','🚀','🚆','⏰','⚠️','👍','❤️','🙌','😴','😤','🎉','💪','✌️','🫶'];

// Free public radio streams (CORS-friendly HLS/MP3)
const stations = [
  { name: 'Los 40', url: 'https://25553.live.streamtheworld.com/LOS40.mp3' },
  { name: 'Cadena 100', url: 'https://25563.live.streamtheworld.com/CADENA100.mp3' },
  { name: 'Europa FM', url: 'https://25593.live.streamtheworld.com/EUROPAFM.mp3' },
  { name: 'M80 Radio', url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/M80RADIO.mp3' },
];

// Seed messages — only shown when localStorage is empty (first time / no real users yet)
const INITIAL_MESSAGES = [
  { id: 1, user_name: 'Rosa', user_avatar: 'https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=Rosa&backgroundColor=ffd5dc', text: 'Buenas noches, ¿alguien sabe si mañana salen a horario los primeros servicios? 🌙', created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
  { id: 2, user_name: 'Ivan', user_avatar: 'https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=Ivan&backgroundColor=c0aede', text: 'Por lo general sí, salvo los martes que suele ir cargado el primer tren de las 5:51. 😅', created_at: new Date(Date.now() - 1000 * 60 * 14).toISOString() },
  { id: 3, user_name: 'Laia', user_avatar: 'https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=Laia&backgroundColor=d1d4f9', text: 'El vagón 2 siempre huele a café a estas horas, alguien lleva termo 😂🚆', created_at: new Date(Date.now() - 1000 * 60 * 6).toISOString() },
];

// Scrolling curiosity ticker items about Tarragona trains
const TICKER_ITEMS = [
  '🚽 En el tren de las 7:21 de Tarragona, una vez se agotaron todos los rollos de papel de baño antes de llegar a Sants.',
  '🎸 Un pasajero tocó la guitarra entera en el trayecto TGN→BCN. Nadie se quejó.',
  '📦 En 2019 se olvidaron 47 paraguas en un solo mes en los trenes de cercanías de Tarragona.',
  '🐾 El record de animales en un mismo vagón: 3 perros, 2 gatos y un loro (Valencia era destino).',
  '🌅 El tren de las 6:21 es el más silencioso: la mayoría de pasajeros duerme de pie.',
  '📱 Media de tiempo mirando el móvil por trayecto TGN-BCN: 58 minutos de 75.',
  '🥐 La cafetería de Tarragona vende más croissants antes de las 7:00 que en todo el resto del día.',
  '😴 Se han encontrado gafas de sol, libros, portátiles y hasta una mochila con ropa limpia abandonada en los asientos.',
  '⚡ El primer tren Tarragona-Barcelona tardaba más de 3 horas en 1865. Hoy: 75 minutos.',
  '🎟️ En 2023, las líneas Tarragona-Barcelona tuvieron más de 2 millones de viajeros.',
];

const ChatRoom = ({ user, room, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [showRadio, setShowRadio] = useState(false);
  const [radioStation, setRadioStation] = useState(stations[0]);
  const [radioPlaying, setRadioPlaying] = useState(false);
  const audioRef = useRef(null);
  const scrollRef = useRef(null);

  // Load persisted messages — seed messages only appear if no real chat exists yet
  const storageKey = `${STORAGE_KEY}_${room.id}`;
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : INITIAL_MESSAGES;
      }
      return INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  // Scrolling ticker index
  const [tickerIdx, setTickerIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTickerIdx(i => (i + 1) % TICKER_ITEMS.length), 8000);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch { /* ignore storage errors */ }
  }, [messages, storageKey]);

  // Radio playback
  useEffect(() => {
    if (!audioRef.current) return;
    if (radioPlaying) {
      audioRef.current.src = radioStation.url;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [radioPlaying, radioStation]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now(),
      room_id: room.id,
      user_name: user?.name || 'Invitado',
      user_avatar: user?.img || '',
      text: newMessage.trim(),
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    setShowEmojis(false);
  };

  const handleNudge = () => {
    setNudge(true);
    const msg = {
      id: Date.now(),
      user_name: 'SISTEMA',
      user_avatar: '',
      text: `⚡ ¡${user?.name || 'Alguien'} ha enviado un ZUMBIDO!`,
      isSystem: true,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, msg]);
    setTimeout(() => setNudge(false), 500);
  };

  return (
    <motion.div
      animate={nudge ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-zinc-950 flex flex-col overflow-hidden"
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" />

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-5 py-4 bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl text-zinc-400">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-renfe-red/20 p-2 rounded-xl"><Train className="text-renfe-red" size={18} /></div>
            <div>
              <h3 className="font-bold text-sm leading-none mb-0.5">{room?.name || 'Chat'}</h3>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{room?.desc}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Radio toggle */}
          <button
            onClick={() => setShowRadio(!showRadio)}
            className={`p-2.5 rounded-xl transition-all ${showRadio ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            title="Radio"
          >
            <Radio size={18} />
          </button>
          <div className="text-right hidden sm:block">
            <div className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Viajando como</div>
            <div className="text-xs font-bold text-blue-400">{user?.name}</div>
          </div>
          {user?.img && <img src={user.img} className="w-9 h-9 rounded-xl bg-zinc-800 border-2 border-blue-500/30" alt="Me" />}
        </div>
      </header>

      {/* ── Curiosity Ticker ── */}
      <div className="bg-zinc-900/80 border-b border-zinc-800/60 px-5 py-2 flex items-center gap-3 shrink-0 overflow-hidden">
        <span className="text-[9px] font-black uppercase tracking-widest text-renfe-red shrink-0 border border-renfe-red/30 bg-renfe-red/10 px-2 py-0.5 rounded-full">🚆 Dato</span>
        <AnimatePresence mode="wait">
          <motion.p
            key={tickerIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] text-zinc-400 font-medium truncate"
          >
            {TICKER_ITEMS[tickerIdx]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Radio Player ── */}
      <AnimatePresence>
        {showRadio && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-b border-purple-800/50 overflow-hidden shrink-0"
          >
            <div className="px-5 py-3 flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${radioPlaying ? 'bg-purple-500 animate-pulse' : 'bg-zinc-700'}`}>
                <Radio size={14} className="text-white" />
              </div>
              <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide">
                {stations.map((s) => (
                  <button key={s.name}
                    onClick={() => { setRadioStation(s); setRadioPlaying(true); }}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      radioStation.name === s.name && radioPlaying
                        ? 'bg-purple-500 text-white'
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
                  radioPlaying ? 'bg-red-600 text-white' : 'bg-purple-600 text-white hover:bg-purple-500'
                }`}
              >
                {radioPlaying ? '⏹ Parar' : '▶ Play'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-hide">
        {messages.map((msg) => {
          const isMe = msg.user_name === (user?.name);
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
            <motion.div key={msg.id}
              initial={{ opacity: 0, x: isMe ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              {!isMe && msg.user_avatar && (
                <img src={msg.user_avatar} className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-800 shrink-0 self-end" alt="" />
              )}
              <div className={`max-w-[78%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && <span className="text-[10px] font-bold text-zinc-500 mb-1 ml-1">{msg.user_name}</span>}
                <div className={`px-4 py-3 rounded-2xl border text-sm font-medium leading-relaxed ${
                  isMe
                    ? 'bg-blue-600 border-blue-500 text-white rounded-tr-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-100 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[9px] mt-1 opacity-40">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Emoji picker ── */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="bg-zinc-900 border-t border-zinc-800 px-4 py-3 grid grid-cols-8 gap-2 shrink-0"
          >
            {emojis.map(e => (
              <button key={e} onClick={() => { setNewMessage(prev => prev + e); }}
                className="text-2xl hover:scale-125 transition-transform p-1 rounded-xl"
              >{e}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input ── */}
      <div className="px-3 sm:px-5 pb-6 sm:pb-8 pt-3 bg-zinc-900 border-t border-zinc-800 shrink-0 w-full mb-safe">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex items-center gap-1.5 sm:gap-2 w-full max-w-full">
          <button type="button" onClick={() => setShowEmojis(!showEmojis)}
            className={`p-2.5 sm:p-3 rounded-2xl transition-all shrink-0 ${showEmojis ? 'bg-yellow-500/20 text-yellow-400' : 'text-zinc-500 hover:text-white'}`}>
            <Smile size={22} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe algo..."
            className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 text-white px-4 py-3 sm:py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm"
          />
          <button type="button" onClick={handleNudge} title="Zumbido"
            className="p-2.5 sm:p-3 bg-orange-500/20 text-orange-400 rounded-2xl hover:bg-orange-500/30 transition-all shrink-0 active:scale-90">
            <Zap size={20} />
          </button>
          <button type="submit" disabled={!newMessage.trim()}
            className="p-2.5 sm:p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 disabled:opacity-30 transition-all shrink-0 active:scale-90">
            <Send size={20} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatRoom;
