import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Ban, Users, Info, X } from 'lucide-react';

const StandardsScreen = ({ onAccept, onCancel }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700">
                <Shield className="text-white fill-blue-500/20" size={28} />
              </div>
              <div className="absolute -bottom-1 -right-1 flex gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900" />
                <div className="w-3 h-3 bg-orange-500 rounded-full border-2 border-zinc-900" />
                <div className="w-3 h-3 bg-red-800 rounded-full border-2 border-zinc-900" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-outfit font-bold text-white leading-tight">
                Escudo de<br />Convivencia y Respeto
              </h2>
              <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-1">
                Protocolo Renfe Connect V2.4.0
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 space-y-4 py-4">
          {/* Rule 1 */}
          <div className="p-5 rounded-3xl bg-zinc-800/30 border border-red-500/20 flex gap-4 transition-all hover:bg-zinc-800/50">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0">
              <Ban className="text-red-500" size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Tolerancia Cero</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                <span className="text-white font-bold">NO</span> al <span className="text-red-400">racismo</span>, <span className="text-white font-bold">NO</span> al <span className="text-red-400">acoso</span>, <span className="text-white font-bold">NO</span> al <span className="text-red-400">bullying</span>, <span className="text-white font-bold">NO</span> a la <span className="text-red-400">discriminación</span> de ningún tipo.
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="p-5 rounded-3xl bg-zinc-800/30 border border-green-500/20 flex gap-4 transition-all hover:bg-zinc-800/50">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
              <Users className="text-green-500" size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Comunidad Segura</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                La red está monitorizada para garantizar un ambiente de viaje positivo y amigable para todos.
              </p>
            </div>
          </div>

          {/* Legal */}
          <div className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex gap-4">
            <Info className="text-orange-400 shrink-0" size={20} />
            <div>
              <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Descargo de Responsabilidad</h4>
              <p className="text-[11px] text-zinc-500 italic leading-snug">
                "No somos responsables de lo que suceda fuera de esta red digital. Los reportes..."
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-4 space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex -space-x-2">
              {['😊', '🤩', '❤️', '🚆'].map((emoji, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-sm shadow-lg">
                  {emoji}
                </div>
              ))}
            </div>
            <button className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider">
              Más iconos
            </button>
          </div>

          <button 
            onClick={onAccept}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Aceptar y Continuar
          </button>

          <div className="text-center">
            <a href="#" className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest hover:text-zinc-400 transition-colors flex items-center justify-center gap-1">
              Contrato de Licencia
              <X size={8} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StandardsScreen;
