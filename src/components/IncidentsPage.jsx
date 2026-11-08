import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, AlertTriangle, RotateCw, AlertCircle, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CHAT_ROUTES, ZONES, SEVERITY_LEVELS } from '../lib/chatConfig';

const INCIDENT_COLUMNS = 'id, line_id, zone, severity, description, user_name, created_at';
const INCIDENT_LIMIT = 100;
const DESCRIPTION_LIMIT = 500;

const severityStyle = {
  high: 'bg-red-500/10 border-red-500/30 text-red-400',
  medium: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
  low: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
};
const severityLabel = Object.fromEntries(SEVERITY_LEVELS.map(s => [s.value, s.label]));

const timeAgo = (iso) => {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'ahora mismo';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  return new Date(iso).toLocaleDateString([], { day: '2-digit', month: '2-digit' });
};

const emptyForm = { userName: '', line: CHAT_ROUTES[0].id, zone: ZONES[0], severity: 'medium', description: '' };

export function IncidentsPage({ onBack, sessionUser, onLogin }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm, userName: sessionUser?.user_metadata?.alias || '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);

    const fetchIncidents = async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select(INCIDENT_COLUMNS)
        .order('created_at', { ascending: false })
        .limit(INCIDENT_LIMIT);

      if (!active) return;
      if (error || !Array.isArray(data)) {
        setLoadError(true);
      } else {
        setIncidents(data);
      }
      setLoading(false);
    };

    fetchIncidents();

    const channel = supabase
      .channel('incidents-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incidents' }, (payload) => {
        if (!active || !payload.new) return;
        setIncidents(prev => (prev.some(i => i.id === payload.new.id) ? prev : [payload.new, ...prev]));
      })
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [reloadKey]);

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const submitIncident = async (e) => {
    e.preventDefault();
    const description = form.description.trim();
    const userName = form.userName.trim();
    if (!description || !userName || submitting) return;

    setSubmitting(true);
    setSubmitError(false);
    const { data, error } = await supabase
      .from('incidents')
      .insert([{
        line_id: form.line,
        zone: form.zone,
        severity: form.severity,
        description,
        user_name: userName,
      }])
      .select(INCIDENT_COLUMNS)
      .maybeSingle();

    setSubmitting(false);
    if (error || !data) {
      setSubmitError(true);
      return;
    }
    setIncidents(prev => (prev.some(i => i.id === data.id) ? prev : [data, ...prev]));
    setForm(prev => ({ ...emptyForm, userName: prev.userName, line: prev.line, zone: prev.zone }));
    setShowForm(false);
  };

  const fieldClass = 'w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/40';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-zinc-950 pt-28 sm:pt-36 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl text-zinc-400" aria-label="Volver">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-outfit font-black">Incidencias <span className="text-orange-400">en Red</span></h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Reportes de los viajeros en tiempo real</p>
            </div>
          </div>
          <button onClick={() => (sessionUser ? setShowForm(s => !s) : onLogin())}
            className="shrink-0 bg-orange-500 hover:bg-orange-400 text-black px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all active:scale-95">
            {!sessionUser ? 'Entrar para reportar' : showForm ? 'Cerrar' : 'Reportar'}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={submitIncident}
              className="overflow-hidden mb-8"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="incident-name" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Tu nombre</label>
                    <input id="incident-name" type="text" maxLength={40} required value={form.userName}
                      onChange={(e) => updateForm('userName', e.target.value)} className={fieldClass} />
                  </div>
                  <div>
                    <label htmlFor="incident-zone" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Zona</label>
                    <select id="incident-zone" value={form.zone} onChange={(e) => updateForm('zone', e.target.value)} className={fieldClass}>
                      {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="incident-line" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Línea</label>
                    <select id="incident-line" value={form.line} onChange={(e) => updateForm('line', e.target.value)} className={fieldClass}>
                      {CHAT_ROUTES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="incident-severity" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Tipo</label>
                    <select id="incident-severity" value={form.severity} onChange={(e) => updateForm('severity', e.target.value)} className={fieldClass}>
                      {SEVERITY_LEVELS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="incident-description" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">Qué está pasando</label>
                  <textarea id="incident-description" rows={3} maxLength={DESCRIPTION_LIMIT} required value={form.description}
                    onChange={(e) => updateForm('description', e.target.value)} className={fieldClass} />
                </div>
                {submitError && (
                  <p className="text-red-400 text-xs font-bold flex items-center gap-1">
                    <AlertCircle size={12} /> No se pudo enviar el reporte. Inténtalo de nuevo.
                  </p>
                )}
                <button type="submit" disabled={submitting || !form.description.trim() || !form.userName.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-black py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
                  <Send size={14} /> {submitting ? 'Enviando...' : 'Enviar reporte'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {loading && (
          <p className="text-center text-xs text-zinc-500 font-bold uppercase tracking-widest py-8">Cargando incidencias...</p>
        )}
        {!loading && loadError && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <AlertCircle className="text-red-400" size={28} />
            <p className="text-sm text-zinc-400">No se pudieron cargar las incidencias.</p>
            <button onClick={() => setReloadKey(k => k + 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700">
              <RotateCw size={14} /> Reintentar
            </button>
          </div>
        )}
        {!loading && !loadError && incidents.length === 0 && (
          <p className="text-center text-sm text-zinc-500 py-8">No hay incidencias reportadas. Si ves algo raro en tu tren, repórtalo.</p>
        )}

        <div className="space-y-4">
          {incidents.map(inc => (
            <motion.div key={inc.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className={`border rounded-2xl p-5 ${severityStyle[inc.severity] || severityStyle.low}`}>
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{inc.line_id}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${severityStyle[inc.severity] || severityStyle.low}`}>
                    {severityLabel[inc.severity] || 'Info'}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-bold shrink-0">{timeAgo(inc.created_at)}</span>
              </div>
              <p className="text-sm text-white leading-relaxed mb-2">{inc.description}</p>
              <p className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                <AlertTriangle size={10} /> {inc.user_name} · {inc.zone}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
