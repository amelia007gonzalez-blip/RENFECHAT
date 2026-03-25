import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Train, ChevronRight, Check, Palette, UserCircle, RotateCcw } from 'lucide-react';

const chatRooms = [
  { id: 'TGN-BCN', name: 'Tarragona → Barcelona', desc: 'Línea de alta frecuencia (Diarios)' },
  { id: 'BCN-TGN', name: 'Barcelona → Tarragona', desc: 'Regreso desde Sants / Passeig de Gràcia' },
  { id: 'R16', name: 'Línea R16', desc: 'Tortosa / Ulldecona' },
  { id: 'RT1', name: 'Línea RT1', desc: 'Tarragona - Reus' },
  { id: 'RT2', name: 'Línea RT2', desc: 'Salou - L\'Arboç' },
];

const avatarOptions = {
  top: ['longHair', 'shortHair', 'eyepatch', 'hat', 'hijab', 'turban'],
  eyes: ['default', 'happy', 'surprised', 'wink', 'hearts', 'side'],
  clothing: ['blazer', 'hoodie', 'overall', 'shirt', 'sweater'],
  hairColor: ['black', 'blonde', 'brown', 'red', 'blue', 'pink']
};

const SelectionScreen = ({ onSelect }) => {
  const [username, setUsername] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(chatRooms[0]);
  
  // Avatar Customization State
  const [customization, setCustomization] = useState({
    top: 'shortHair',
    eyes: 'default',
    clothing: 'hoodie',
    hairColor: 'brown',
    background: 'b6e3f4'
  });

  const generateAvatarUrl = (opts) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?top=${opts.top}&eyes=${opts.eyes}&clothing=${opts.clothing}&hairColor=${opts.hairColor}&backgroundColor=${opts.background}`;
  };

  const handleRandomize = () => {
    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setCustomization({
      top: random(avatarOptions.top),
      eyes: random(avatarOptions.eyes),
      clothing: random(avatarOptions.clothing),
      hairColor: random(avatarOptions.hairColor),
      background: Math.floor(Math.random()*16777215).toString(16)
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 container mx-auto px-6 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Side: Avatar Customizer */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="text-left">
            <h2 className="text-4xl font-outfit font-bold mb-2">Personaliza tu Perfil</h2>
            <p className="text-zinc-500 mb-8 italic">Como si fuera un avatar de ROBLOX, ¡dale tu toque!</p>
          </div>

          <div className="flex flex-col items-center glass p-8 rounded-[3rem] border-zinc-800">
            <div className="relative group">
              <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden bg-zinc-800 border-4 border-zinc-700 shadow-2xl transition-transform group-hover:scale-105">
                <img src={generateAvatarUrl(customization)} alt="Selected Avatar" className="w-full h-full" />
              </div>
              <button 
                onClick={handleRandomize}
                className="absolute -bottom-2 -right-2 bg-renfe-red p-4 rounded-2xl text-white shadow-xl hover:rotate-180 transition-all duration-500"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            <div className="w-full mt-10 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">¿Cómo te llamas?</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Tu nombre en el tren..."
                  className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white focus:ring-2 focus:ring-renfe-red/50 transition-all outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.keys(avatarOptions).map((key) => (
                  <div key={key}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">{key}</label>
                    <select 
                      value={customization[key]}
                      onChange={(e) => setCustomization({...customization, [key]: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-white outline-none focus:border-zinc-600"
                    >
                      {avatarOptions[key].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Room Selection */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="text-left">
            <h3 className="text-sm font-bold uppercase tracking-widest text-renfe-red mb-2">Selecciona tu Ruta</h3>
            <p className="text-zinc-500 mb-6">Únete al chat de los que viajan contigo ahora mismo.</p>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
            {chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`w-full p-5 rounded-3xl flex items-center justify-between transition-all border ${
                  selectedRoom.id === room.id 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-xl scale-[1.02]' 
                    : 'glass border-zinc-800 text-zinc-400 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${selectedRoom.id === room.id ? 'bg-white/20' : 'bg-zinc-800'}`}>
                    <Train size={24} />
                  </div>
                  <div className="text-left">
                    <div className={`font-bold ${selectedRoom.id === room.id ? 'text-white' : 'text-zinc-100'}`}>{room.name}</div>
                    <div className={`text-[10px] uppercase font-bold tracking-wider ${selectedRoom.id === room.id ? 'text-blue-100' : 'text-zinc-600'}`}>
                      {room.desc}
                    </div>
                  </div>
                </div>
                {selectedRoom.id === room.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check size={20} className="bg-white text-blue-600 rounded-full p-1" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          <button 
            disabled={!username.trim()}
            onClick={() => onSelect({ ...customization, img: generateAvatarUrl(customization), name: username }, selectedRoom)}
            className="w-full bg-renfe-red hover:bg-red-700 disabled:opacity-30 disabled:grayscale text-white py-6 rounded-3xl font-bold text-xl shadow-xl shadow-renfe-red/20 transition-all flex items-center justify-center gap-3 group mt-6"
          >
            Entrar al Chat
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionScreen;
