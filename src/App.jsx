import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, MapPin, Users, Clock, ChevronRight, MessageSquare, Menu, X, Bell } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

import StandardsScreen from './components/StandardsScreen';
import SelectionScreen from './components/SelectionScreen';
import ChatRoom from './components/ChatRoom';
import { HorariosPage, IncidenciasPage, EstacionesPage } from './components/InfoPages';

const VIEWS = {
  LANDING:    'LANDING',
  STANDARDS:  'STANDARDS',
  SELECTION:  'SELECTION',
  CHAT:       'CHAT',
  HORARIOS:   'HORARIOS',
  INCIDENCIAS:'INCIDENCIAS',
  ESTACIONES: 'ESTACIONES',
};

const App = () => { // State Management with sessionStorage persistence to survive F5 reloads
  const [view, setView] = useState(() => sessionStorage.getItem('trenconnect_view') || VIEWS.LANDING);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(() => {
    const saved = sessionStorage.getItem('trenconnect_user');
    return saved && saved !== "undefined" ? JSON.parse(saved) : null;
  });
  const [selectedRoom, setSelectedRoom] = useState(() => {
    const saved = sessionStorage.getItem('trenconnect_room');
    return saved && saved !== "undefined" ? JSON.parse(saved) : null;
  });

  // Sync state to sessionStorage
  useEffect(() => { sessionStorage.setItem('trenconnect_view', view); }, [view]);
  useEffect(() => { sessionStorage.setItem('trenconnect_room', JSON.stringify(selectedRoom)); }, [selectedRoom]);
  useEffect(() => { sessionStorage.setItem('trenconnect_user', JSON.stringify(userProfile)); }, [userProfile]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (v) => { setView(v); setMenuOpen(false); window.scrollTo({ top: 0 }); };
  const startChat = () => go(VIEWS.STANDARDS);

  // ── Pages that take over the full screen ──
  if (view === VIEWS.CHAT)
    return <ChatRoom user={userProfile} room={selectedRoom} onBack={() => go(VIEWS.SELECTION)} />;
  if (view === VIEWS.HORARIOS)
    return <HorariosPage onBack={() => go(VIEWS.LANDING)} />;
  if (view === VIEWS.INCIDENCIAS)
    return <IncidenciasPage onBack={() => go(VIEWS.LANDING)} />;
  if (view === VIEWS.ESTACIONES)
    return <EstacionesPage onBack={() => go(VIEWS.LANDING)} />;

  const navLinks = [
    { name: 'Horarios',    icon: <Clock size={15} />,  action: () => go(VIEWS.HORARIOS) },
    { name: 'Comunidad',   icon: <Users size={15} />,  action: startChat },
    { name: 'Estaciones',  icon: <MapPin size={15} />, action: () => go(VIEWS.ESTACIONES) },
    { name: 'Incidencias', icon: <Bell size={15} />,   action: () => go(VIEWS.INCIDENCIAS) },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 overflow-x-hidden flex flex-col relative">

      {/* ── Disclaimer bar ── */}
      <div className="fixed top-0 w-full bg-orange-500/10 backdrop-blur-md border-b border-orange-500/20 py-2 text-center text-[9px] sm:text-xs font-semibold text-orange-200/80 z-[110]">
        ⚠️ <span className="uppercase tracking-widest px-1">Aviso:</span> App para entretenimiento.{' '}
        <span className="hidden sm:inline">No tiene vinculación oficial con Renfe.</span>
      </div>

      {/* ── Standards modal ── */}
      <AnimatePresence>
        {view === VIEWS.STANDARDS && (
          <StandardsScreen onAccept={() => go(VIEWS.SELECTION)} onCancel={() => go(VIEWS.LANDING)} />
        )}
      </AnimatePresence>

      {/* ── Navbar ── */}
      <nav className={`fixed top-[28px] sm:top-[36px] w-full z-[100] transition-all duration-300 ${scrolled || menuOpen ? 'glass border-b border-white/5 py-2 sm:py-3' : 'bg-transparent py-4 sm:py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer z-50" onClick={() => go(VIEWS.LANDING)}>
            <div className="bg-renfe-red p-1.5 rounded-lg"><Train className="text-white" size={22} /></div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-outfit font-black tracking-tight leading-none">
                Tren<span className="text-renfe-red">Connect</span> <span className="text-tarragona-gold">TGN</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-600 font-bold">App no oficial</span>
            </div>
          </motion.div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map(l => (
              <button key={l.name} onClick={l.action}
                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                {l.icon} {l.name}
              </button>
            ))}
            <button onClick={startChat}
              className="bg-renfe-red hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-renfe-red/20">
              Acceder
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden text-white z-50 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-zinc-950/98 backdrop-blur-3xl border-b border-zinc-800 overflow-hidden">
              <div className="container mx-auto px-6 py-8 space-y-5">
                {navLinks.map(l => (
                  <button key={l.name} onClick={l.action}
                    className="w-full flex items-center gap-4 text-lg font-bold text-zinc-300 hover:text-white">
                    <span className="p-3 bg-zinc-900 rounded-2xl">{l.icon}</span>{l.name}
                  </button>
                ))}
                <button onClick={startChat}
                  className="w-full bg-renfe-red text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em]">
                  Acceder al Chat
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Main ── */}
      <main className="flex-1 w-full">
        {view === VIEWS.LANDING && (
          <div className="pt-24 sm:pt-32">
            {/* Hero */}
            <section className="relative pt-16 sm:pt-32 pb-20 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-renfe-red/10 to-transparent pointer-events-none" />
              <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <span className="inline-block py-1 px-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-8">
                    Comunidad de Pasajeros · Tarragona
                  </span>
                  <h1 className="text-5xl md:text-8xl font-outfit font-extrabold mb-8 leading-[1.1] tracking-tighter">
                    Conecta con tu{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-renfe-red via-orange-500 to-tarragona-gold">Tren</span>
                    <br />en tiempo real.
                  </h1>
                  <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mb-12">
                    Únete al chat de los viajeros que están ahora mismo en tu línea. Informa, consulta o simplemente pasa el rato.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={startChat}
                      className="w-full sm:w-auto bg-renfe-red text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-renfe-red/30">
                      Empezar ahora <ChevronRight size={20} />
                    </button>
                    <button onClick={() => go(VIEWS.INCIDENCIAS)}
                      className="w-full sm:w-auto glass hover:bg-white/10 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                      Estado de la Red
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Quick action cards */}
            <section className="py-16 container mx-auto px-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {[
                  { icon: <Clock size={28} />, label: 'Horarios', sub: 'TGN ↔ BCN', action: () => go(VIEWS.HORARIOS), color: 'blue' },
                  { icon: <Bell size={28} />, label: 'Incidencias', sub: 'Estado de la red', action: () => go(VIEWS.INCIDENCIAS), color: 'orange' },
                  { icon: <MapPin size={28} />, label: 'Estaciones', sub: 'Líneas y servicios', action: () => go(VIEWS.ESTACIONES), color: 'green' },
                ].map(c => (
                  <button key={c.label} onClick={c.action}
                    className="glass border-zinc-800 rounded-[2rem] p-8 text-left hover:bg-white/5 transition-all hover:scale-[1.02] active:scale-[0.98] group">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                      c.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                      c.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>{c.icon}</div>
                    <h3 className="font-black text-lg mb-1">{c.label}</h3>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{c.sub}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Community CTA */}
            <section className="py-16 container mx-auto px-6">
              <div className="bg-zinc-900/50 border border-zinc-800 p-10 sm:p-16 rounded-[3rem] text-center max-w-4xl mx-auto">
                <MessageSquare className="text-renfe-red mx-auto mb-6" size={44} />
                <h2 className="text-3xl sm:text-5xl font-outfit font-bold mb-6">La esencia es el Chat</h2>
                <p className="text-zinc-500 text-lg mb-10">
                  Lugar de encuentro para los que cogemos el tren a diario. ¡Nos vemos en el vagón!
                </p>
                <button onClick={startChat}
                  className="bg-white text-black px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                  Abrir Comunidad
                </button>
              </div>
            </section>
          </div>
        )}

        {view === VIEWS.SELECTION && (
          <SelectionScreen onSelect={(u, r) => { setUserProfile(u); setSelectedRoom(r); go(VIEWS.CHAT); }} />
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-zinc-900 bg-black">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-600">
          <div className="flex items-center gap-3 opacity-40">
            <Train size={20} />
            <span className="font-outfit font-bold text-lg uppercase tracking-widest">TrenConnect TGN</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-center">
            © 2026 TrenConnect Tarragona · <span className="text-renfe-red">App no oficial</span>
          </p>
          <div className="flex gap-5">
            <button onClick={() => go(VIEWS.HORARIOS)} className="hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Horarios</button>
            <button onClick={() => go(VIEWS.INCIDENCIAS)} className="hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Incidencias</button>
          </div>
        </div>
      </footer>

      <Analytics />
    </div>
  );
};

export default App;
