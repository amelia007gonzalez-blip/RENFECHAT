import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Train, AlertTriangle, MapPin, ExternalLink, RotateCw, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSupabaseQuery } from '../lib/useSupabaseQuery';

const fetchSchedules = () => supabase
  .from('train_schedules')
  .select('id, direction, departs, arrives, from_station, to_station, train_type')
  .eq('active', true)
  .order('sort_order', { ascending: true });

const fetchStations = () => supabase
  .from('stations')
  .select('id, name, zone, lines, services')
  .eq('active', true)
  .order('sort_order', { ascending: true });

const trimTime = (time) => time.slice(0, 5);

const minutesBetween = (from, to) => {
  const toMinutes = (time) => {
    const [h, m] = trimTime(time).split(':').map(Number);
    return h * 60 + m;
  };
  const diff = toMinutes(to) - toMinutes(from);
  return diff < 0 ? diff + 1440 : diff;
};

const StatusMessage = ({ loading, error, empty, emptyText, onRetry }) => {
  if (loading) return <p className="text-center text-xs text-zinc-500 font-bold uppercase tracking-widest py-8">Cargando...</p>;
  if (error) return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <AlertCircle className="text-red-400" size={28} />
      <p className="text-sm text-zinc-400">No se pudo cargar la información.</p>
      <button onClick={onRetry} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700">
        <RotateCw size={14} /> Reintentar
      </button>
    </div>
  );
  if (empty) return <p className="text-center text-sm text-zinc-500 py-8">{emptyText}</p>;
  return null;
};

export function HorariosPage({ onBack }) {
  const [dir, setDir] = useState('tgn-bcn');
  const fetcher = useCallback(fetchSchedules, []);
  const { data, error, loading, retry } = useSupabaseQuery(fetcher);
  const schedule = (data || []).filter(s => s.direction === dir);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-zinc-950 pt-28 sm:pt-36 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl text-zinc-400" aria-label="Volver"><ArrowLeft size={20} /></button>
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
          <StatusMessage loading={loading} error={error} onRetry={retry}
            empty={!loading && !error && schedule.length === 0} emptyText="No hay horarios disponibles para este trayecto." />
          {!loading && !error && schedule.map((s) => (
            <div key={s.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-xl font-black text-white">{trimTime(s.departs)}</div>
                  <div className="text-[10px] text-zinc-500 font-bold">{s.from_station}</div>
                </div>
                <div className="flex flex-col items-center gap-1 px-2">
                  <div className="w-16 h-px bg-zinc-700 relative flex items-center justify-center">
                    <Train size={12} className="text-renfe-red bg-zinc-900 px-1" />
                  </div>
                  <span className="text-[9px] text-zinc-600 font-bold">{s.train_type}</span>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black text-white">{trimTime(s.arrives)}</div>
                  <div className="text-[10px] text-zinc-500 font-bold">{s.to_station}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 font-bold">~{minutesBetween(s.departs, s.arrives)} min</span>
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

export function EstacionesPage({ onBack }) {
  const fetcher = useCallback(fetchStations, []);
  const { data, error, loading, retry } = useSupabaseQuery(fetcher);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-zinc-950 pt-28 sm:pt-36 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl text-zinc-400" aria-label="Volver"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="text-3xl font-outfit font-black">Estaciones <span className="text-tarragona-gold">Tarragona</span></h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Red de cercanías y regionales</p>
          </div>
        </div>

        <div className="space-y-3">
          <StatusMessage loading={loading} error={error} onRetry={retry}
            empty={!loading && !error && (data || []).length === 0} emptyText="No hay estaciones disponibles ahora mismo." />
          {!loading && !error && (data || []).map((st) => (
            <div key={st.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4">
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
