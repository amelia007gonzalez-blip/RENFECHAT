import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Train, ChevronRight, Check } from 'lucide-react';

const avatars = [
  { id: 1, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  { id: 2, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
  { id: 3, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max' },
  { id: 4, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe' },
];

const chatRooms = [
  { id: 'R14', name: 'Línea R14', desc: 'Tarragona - Lleida' },
  { id: 'R15', name: 'Línea R15', desc: 'Riba-roja d\'Ebre' },
  { id: 'R16', name: 'Línea R16', desc: 'Tortosa / Ulldecona' },
  { id: 'RT1', name: 'Línea RT1', desc: 'Tarragona - Reus' },
  { id: 'RT2', name: 'Línea RT2', desc: 'Salou - L\'Arboç' },
];

const SelectionScreen = ({ onSelect }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [selectedRoom, setSelectedRoom] = useState(chatRooms[2]);

  return (
    <div className="min-h-screen pt-32 pb-20 container mx-auto px-6 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-outfit font-bold mb-4">Personaliza tu perfil</h2>
        <p className="text-zinc-500">¿Cómo quieres que te vean en el tren?</p>
      </motion.div>

      {/* Avatar Selection */}
      <div className="mb-12">
        <h3 className="text-sm font-bold uppercase tracking-widest text-renfe-red mb-6 text-center">Selecciona tu Avatar</h3>
        <div className="flex justify-center gap-6">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => setSelectedAvatar(avatar)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden transition-all ${
                selectedAvatar.id === avatar.id ? 'ring-4 ring-blue-500 scale-110 shadow-xl' : 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
              }`}
            >
              <img src={avatar.img} alt="Avatar" className="w-full h-full bg-zinc-800" />
              {selectedAvatar.id === avatar.id && (
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <Check className="text-white" size={24} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Room Selection */}
      <div className="mb-12">
        <h3 className="text-sm font-bold uppercase tracking-widest text-renfe-red mb-6 text-center">Elige tu Tren</h3>
        <div className="space-y-3">
          {chatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`w-full p-5 rounded-3xl flex items-center justify-between transition-all ${
                selectedRoom.id === room.id ? 'bg-blue-600 text-white shadow-xl' : 'glass text-zinc-400 hover:bg-white/5 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${selectedRoom.id === room.id ? 'bg-white/20' : 'bg-zinc-800'}`}>
                  <Train size={24} />
                </div>
                <div className="text-left">
                  <div className={`font-bold ${selectedRoom.id === room.id ? 'text-white' : 'text-zinc-100'}`}>{room.name}</div>
                  <div className={`text-xs ${selectedRoom.id === room.id ? 'text-blue-100' : 'text-zinc-500'}`}>{room.desc}</div>
                </div>
              </div>
              {selectedRoom.id === room.id && <Check size={20} />}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={() => onSelect(selectedAvatar, selectedRoom)}
        className="w-full bg-renfe-red hover:bg-red-700 text-white py-5 rounded-3xl font-bold text-xl shadow-xl shadow-renfe-red/20 transition-all flex items-center justify-center gap-3 group"
      >
        Entrar al Chat
        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default SelectionScreen;
