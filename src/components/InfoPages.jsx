import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Train, AlertTriangle, MapPin, ExternalLink } from 'lucide-react';

// ─── HORARIOS ────────────────────────────────────────────────────────

const scheduleTGN_BCN = [
  { from: 'Tarragona', to: 'Barcelona Sants', departs: '05:51', arrives: '07:06', type: 'R13' },
  { from: 'Tarragona', to: 'Barcelona Sants', departs: '06:21', arrives: '07:36', type: 'R13' },
  { from: 'Tarragona', to: 'Barcelona Sants', departs: '06:51', arrives: '08:06', type: 'R13' },
  { from: 'Tarragona', to: 'Barcelona Sants', departs: '07:21', arrives: '08:36', type: 'R13' },
  { from: 'Tarragona', to: 'Barcelona Sants', departs: '07:51', arrives: '09:06', type: 'R13' },
  { from: 'Tarragona', to: 'Barcelona Sants', departs: '08:21', arrives: '09:36', type: 'R13' },
  { from: 'Tarragona', to: 'Barcelona Sants', departs: '09:21', arrives: '10:36', type: 'R13' },
  { from: 'Tarragona', to: 'Barcelona Sants', departs: '10:21', arrives: '11:36', type: 'R13' },
];
const scheduleBCN_TGN = [
  { from: 'Barcelona Sants', to: 'Tarragona', departs: '06:13', arrives: '07:28', type: 'R13' },
  { from: 'Barcelona Sants', to: 'Tarragona', departs: '07:13', arrives: '08:28', type: 'R13' },
  { from: 'Barcelona Sants', to: 'Tarragona', departs: '08:13', arrives: '09:28', type: 'R13' },
  { from: 'Barcelona Sants', to: 'Tarragona', departs: '09:13', arrives: '10:28', type: 'R13' },
  { from: 'Barcelona Sants', to: 'Tarragona', departs: '10:13', arrives: '11:28', type: 'R13' },
  { from: 'Barcelona Sants', to: 'Tarragona', departs: '17:13', arrives: '18:28', type: 'R13' },
  { from: 'Barcelona Sants', to: 'Tarragona', departs: '18:13', arrives: '19:28', type: 'R13' },
  { from: 'Barcelona Sants', to: 'Tarragona', departs: '19:13', arrives: '20:28', type: 'R13' },
];

export function HorariosPage({ onBack }) {
  const [dir, setDir] = React.useState('tgn-bcn');
  const schedule = dir === 'tgn-bcn' ? scheduleTGN_BCN : scheduleBCN_TGN;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-zinc-950 pt-28 sm:pt-36 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl text-zinc-400"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="text-3xl font-outfit font-black">Horarios <span className="text-renfe-red">Aproximados</span></h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Laborables · Basados en horario habitual</p>
          </div>
        </div>

        <div className="flex gap-3 mb-8">
          {[{ id: 'tgn-bcn', label: 'TGN → BCN' }, { id: 'bcn-tgn', label: 'BCN → TGN' }].map(d => (
            <button key={d.id} onClick={() => setDir(d.id)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${dir === d.id ? 'bg-renfe-red text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'}`}>
              {d.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {schedule.map((s, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xl font-black text-white">{s.departs}</div>
                  <div className="text-[10px] text-zinc-500 font-bold">{s.from.includes('Barcelona') ? 'Sants' : 'Tarragona'}</div>
                </div>
                <div className="flex flex-col items-center gap-1 px-2">
                  <div className="w-16 h-px bg-zinc-700 relative flex items-center justify-center">
                    <Train size={12} className="text-renfe-red bg-zinc-900 px-1" />
                  </div>
                  <span className="text-[9px] text-zinc-600 font-bold">{s.type}</span>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black text-white">{s.arrives}</div>
                  <div className="text-[10px] text-zinc-500 font-bold">{s.to.includes('Barcelona') ? 'Sants' : 'Tarragona'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 font-bold">~75 min</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 flex items-start gap-3">
          <AlertTriangle size={16} className="text-orange-400 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 leading-relaxed">
            Horarios orientativos. Consulta <a href="https://www.renfe.com/es/es/cercanias/cercanias-barcelona/horarios" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold">renfe.com <ExternalLink size={10} className="inline" /></a> para horarios oficiales actualizados.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── ESTACIONES ──────────────────────────────────────────────────────

const stations_data = [
  { name: 'Tarragona', lines: ['R13', 'R14', 'R16', 'RT1', 'RT2'], zone: 'C-6', services: ['Consigna', 'WiFi', 'Bar'] },
  { name: 'Camp de Tarragona (AVE)', lines: ['AVE', 'LD'], zone: 'AVE', services: ['Parking', 'WiFi', 'Bar', 'Taxi'] },
  { name: 'Reus', lines: ['R14', 'RT1'], zone: 'C-6', services: ['WiFi', 'Bar'] },
  { name: 'Salou', lines: ['R14', 'RT2'], zone: 'C-6', services: ['WiFi'] },
  { name: 'Cambrils', lines: ['R14'], zone: 'C-6', services: ['Bar'] },
  { name: 'L\'Hospitalet de l\'Infant', lines: ['R16'], zone: 'C-6', services: [] },
  { name: 'Vandellòs', lines: ['R16'], zone: 'C-6', services: [] },
  { name: 'Tortosa', lines: ['R16'], zone: 'C-6', services: ['Bar'] },
  { name: 'L\'Arboç', lines: ['RT2'], zone: 'C-6', services: [] },
];

export function EstacionesPage({ onBack }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-zinc-950 pt-28 sm:pt-36 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl text-zinc-400"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="text-3xl font-outfit font-black">Estaciones <span className="text-tarragona-gold">Tarragona</span></h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Red de cercanías y regionales</p>
          </div>
        </div>

        <div className="space-y-3">
          {stations_data.map((st, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-zinc-800 rounded-xl"><MapPin size={16} className="text-tarragona-gold" /></div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{st.name}</h3>
                    <span className="text-[10px] text-zinc-500 font-bold">Zona {st.zone}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {st.lines.map(l => (
                  <span key={l} className="text-[10px] font-black bg-renfe-red/10 text-renfe-red border border-renfe-red/20 px-2 py-0.5 rounded-full uppercase tracking-wider">{l}</span>
                ))}
                {st.services.map(s => (
                  <span key={s} className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
