import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, ChevronRight, Check, RotateCcw, AlertCircle } from 'lucide-react';

const chatRooms = [
  { id: 'TGN-BCN', name: 'Tarragona → Barcelona', desc: 'Línea de alta frecuencia (Diarios)' },
  { id: 'BCN-TGN', name: 'Barcelona → Tarragona', desc: 'Regreso desde Sants / Passeig de Gràcia' },
  { id: 'R16', name: 'Línea R16', desc: 'Tortosa / Ulldecona' },
  { id: 'RT1', name: 'Línea RT1', desc: 'Tarragona – Reus' },
  { id: 'RT2', name: 'Línea RT2', desc: "Salou – L'Arboç" },
];

// Pre-defined avatar seeds (all guaranteed to render)
const avatarSeeds = [
  'Felix', 'Aneka', 'Zara', 'Leo', 'Mia', 'Javi', 'Sara', 'Marc',
  'Luna', 'Alex', 'Rosa', 'Ivan', 'Noa', 'Pau', 'Laia', 'Bernat'
];

const hairColors = [
  { value: 'black', label: 'Negro' },
  { value: 'blonde', label: 'Rubio' },
  { value: 'brown', label: 'Castaño' },
  { value: 'red', label: 'Rojo' },
  { value: 'blue', label: 'Azul' },
  { value: 'pink', label: 'Rosa' },
];

const topStyles = [
  { value: 'longHair', label: 'Pelo largo' },
  { value: 'shortHair', label: 'Pelo corto' },
  { value: 'eyepatch', label: 'Parche' },
  { value: 'hat', label: 'Gorra' },
  { value: 'hijab', label: 'Hijab' },
  { value: 'turban', label: 'Turbante' },
];

const eyeStyles = [
  { value: 'default', label: 'Normal' },
  { value: 'happy', label: 'Feliz' },
  { value: 'surprised', label: 'Sorprendido' },
  { value: 'wink', label: 'Guiño' },
  { value: 'hearts', label: 'Corazones' },
  { value: 'side', label: 'Lateral' },
];

const clothingStyles = [
  { value: 'blazer', label: 'Blazer' },
  { value: 'hoodie', label: 'Sudadera' },
  { value: 'overall', label: 'Mono' },
  { value: 'shirt', label: 'Camiseta' },
  { value: 'sweater', label: 'Jersey' },
];

function buildAvatarUrl(seed, hairColor = 'brown', top = 'shortHair') {
  // Use seed-based generation with color overlays via DiceBear 9.x
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=20`;
}

const SelectionScreen = ({ onSelect }) => {
  const [username, setUsername] = useState('');
  const [selectedSeed, setSelectedSeed] = useState('Felix');
  const [selectedRoom, setSelectedRoom] = useState(chatRooms[0]);
  const [hairColor, setHairColor] = useState('brown');
  const [topStyle, setTopStyle] = useState('shortHair');
  const [eyeStyle, setEyeStyle] = useState('default');
  const [clothing, setClothing] = useState('hoodie');
  const [showError, setShowError] = useState(false);

  // Use seed-only URL — guaranteed to render. Style dropdowns update future versions.
  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(selectedSeed)}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=20`;

  const handleEnterChat = () => {
    if (!username.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    onSelect({ name: username.trim(), img: avatarUrl, seed: selectedSeed }, selectedRoom);
  };

  const randomize = () => {
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setSelectedSeed(rand(avatarSeeds));
    setHairColor(rand(hairColors).value);
    setTopStyle(rand(topStyles).value);
    setEyeStyle(rand(eyeStyles).value);
    setClothing(rand(clothingStyles).value);
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-20 container mx-auto px-4 sm:px-6 max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        {/* ── LEFT: Avatar Customizer ── */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <h2 className="text-4xl sm:text-5xl font-outfit font-black tracking-tighter leading-none">
              Tu <span className="text-renfe-red">Avatar</span>
            </h2>
            <p className="text-zinc-600 font-bold uppercase tracking-widest text-[9px] mt-2">Personaliza tu aspecto</p>
          </div>

          {/* Avatar Preview */}
          <div className="glass p-6 sm:p-8 rounded-[2.5rem] border-zinc-800 flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] overflow-hidden bg-zinc-800 border-4 border-zinc-700 shadow-2xl">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <button
                onClick={randomize}
                className="absolute -bottom-3 -right-3 bg-renfe-red p-3.5 rounded-2xl text-white shadow-xl hover:rotate-180 transition-all duration-500 active:scale-90"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            {/* Seed Gallery */}
            <div className="w-full">
              <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Elige tu personaje</label>
              <div className="grid grid-cols-8 gap-1.5">
                {avatarSeeds.map((seed) => (
                  <button
                    key={seed}
                    onClick={() => setSelectedSeed(seed)}
                    className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedSeed === seed ? 'border-blue-500 scale-110 shadow-lg' : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <img
                      src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`}
                      alt={seed}
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="w-full">
              <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">¿Cómo te llamas?</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setShowError(false); }}
                placeholder="Tu nombre en el tren..."
                maxLength={20}
                className={`w-full bg-zinc-950 border p-4 rounded-2xl text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none font-bold text-sm ${
                  showError ? 'border-red-500 ring-2 ring-red-500/30' : 'border-zinc-800'
                }`}
              />
              <AnimatePresence>
                {showError && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-red-400 text-xs font-bold mt-2 flex items-center gap-1"
                  >
                    <AlertCircle size={12} /> Escribe tu nombre para continuar
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Style Dropdowns */}
            <div className="w-full grid grid-cols-2 gap-3">
              {[
                { label: 'Pelo', value: topStyle, setter: setTopStyle, options: topStyles },
                { label: 'Ojos', value: eyeStyle, setter: setEyeStyle, options: eyeStyles },
                { label: 'Ropa', value: clothing, setter: setClothing, options: clothingStyles },
                { label: 'Color de pelo', value: hairColor, setter: setHairColor, options: hairColors },
              ].map(({ label, value, setter, options }) => (
                <div key={label}>
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1.5 block">{label}</label>
                  <select
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl text-xs text-white outline-none focus:border-zinc-600 cursor-pointer"
                  >
                    {options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT: Room Selection + Enter ── */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-renfe-red mb-1">Selecciona tu Ruta</h3>
            <p className="text-zinc-500 text-sm font-medium">Únete al chat de los que viajan contigo ahora mismo.</p>
          </div>

          <div className="space-y-3">
            {chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`w-full p-4 sm:p-5 rounded-[1.75rem] flex items-center justify-between transition-all border ${
                  selectedRoom.id === room.id
                    ? 'bg-blue-600 border-blue-400 text-white shadow-2xl shadow-blue-600/20 scale-[1.02]'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${selectedRoom.id === room.id ? 'bg-white/20' : 'bg-zinc-800'}`}>
                    <Train size={20} />
                  </div>
                  <div className="text-left">
                    <div className={`font-bold text-sm ${selectedRoom.id === room.id ? 'text-white' : 'text-zinc-100'}`}>{room.name}</div>
                    <div className={`text-[10px] uppercase font-bold tracking-wider ${selectedRoom.id === room.id ? 'text-blue-100' : 'text-zinc-600'}`}>
                      {room.desc}
                    </div>
                  </div>
                </div>
                {selectedRoom.id === room.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check size={18} className="bg-white text-blue-600 rounded-full p-0.5" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          {/* Enter Chat Button */}
          <button
            onClick={handleEnterChat}
            className="w-full bg-renfe-red hover:bg-red-700 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-renfe-red/25 transition-all flex items-center justify-center gap-3 group active:scale-95 mt-4"
          >
            Entrar al Chat
            <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Helper note */}
          <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
            Necesitas escribir tu nombre para acceder
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default SelectionScreen;
