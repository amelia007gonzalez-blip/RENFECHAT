import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Train, 
  MapPin, 
  Users, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  MessageSquare, 
  Info,
  Menu,
  X,
  Bell,
  Settings
} from 'lucide-react';
import { supabase } from './lib/supabase';

// Components
import StandardsScreen from './components/StandardsScreen';
import SelectionScreen from './components/SelectionScreen';
import ChatRoom from './components/ChatRoom';

const VIEWS = {
  LANDING: 'LANDING',
  STANDARDS: 'STANDARDS',
  SELECTION: 'SELECTION',
  CHAT: 'CHAT'
};

const App = () => {
  const [currentView, setCurrentView] = useState(VIEWS.LANDING);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // User selection state
  const [userProfile, setUserProfile] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const startJourney = () => {
    setCurrentView(VIEWS.STANDARDS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAcceptStandards = () => {
    setCurrentView(VIEWS.SELECTION);
  };

  const handleSelection = (avatar, room) => {
    setUserProfile(avatar);
    setSelectedRoom(room);
    setCurrentView(VIEWS.CHAT);
  };

  const navLinks = [
    { name: 'Horarios', icon: <Clock size={18} />, action: startJourney },
    { name: 'Comunidad', icon: <Users size={18} />, action: startJourney },
    { name: 'Estaciones', icon: <MapPin size={18} />, action: startJourney },
    { name: 'Incidencias', icon: <Bell size={18} />, action: startJourney },
  ];

  if (currentView === VIEWS.CHAT) {
    return <ChatRoom user={userProfile} room={selectedRoom} onBack={() => setCurrentView(VIEWS.SELECTION)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-renfe-red/30 overflow-x-hidden">
      {/* Legal Disclaimer Bar */}
      <div className="bg-orange-500/10 border-b border-orange-500/20 py-2 text-center text-[10px] sm:text-xs font-medium text-orange-200/80 z-[100] relative">
        ⚠️ <span className="font-bold uppercase tracking-wider">Aviso:</span> Esta aplicación es meramente para entretenimiento y <span className="font-bold">no tiene ninguna vinculación oficial con Renfe Operadora</span>.
      </div>

      <AnimatePresence>
        {currentView === VIEWS.STANDARDS && (
          <StandardsScreen 
            onAccept={handleAcceptStandards} 
            onCancel={() => setCurrentView(VIEWS.LANDING)} 
          />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentView(VIEWS.LANDING)}
          >
            <div className="bg-renfe-red p-1.5 rounded-lg">
              <Train className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-outfit font-bold tracking-tight leading-tight">
                Tren<span className="text-renfe-red">Connect</span> <span className="text-tarragona-gold">TGN</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-500 font-bold -mt-0.5">App no oficial</span>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={link.action}
                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={startJourney}
              className="bg-renfe-red hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-renfe-red/20"
            >
              Acceder
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <main>
        {currentView === VIEWS.LANDING && (
          <>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-renfe-red/10 to-transparent pointer-events-none" />
              <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-block py-1 px-3 rounded-full bg-renfe-red/10 border border-renfe-red/20 text-renfe-red text-xs font-bold uppercase tracking-wider mb-6">
                    Nueva plataforma digital
                  </span>
                  <h1 className="text-5xl md:text-7xl font-outfit font-extrabold mb-6 leading-tight">
                    Tu tren en <span className="text-transparent bg-clip-text bg-gradient-to-r from-renfe-red to-orange-500">Tarragona</span><br /> 
                    más inteligente que nunca.
                  </h1>
                  <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
                    Conecta con otros viajeros, mantente informado sobre incidencias en tiempo real y recibe alertas personalizadas para tus rutas habituales.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                      onClick={startJourney}
                      className="w-full sm:w-auto bg-white text-zinc-950 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all group shadow-xl"
                    >
                      Empezar ahora
                      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={startJourney}
                      className="w-full sm:w-auto glass text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                    >
                      Ver estado de la red
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Main Features Section Placeholder */}
            <section className="py-20 bg-zinc-900/10">
              <div className="container mx-auto px-6 text-center">
                <div className="glass p-12 rounded-[3rem] border-zinc-800">
                  <h2 className="text-3xl font-bold mb-6">La esencia es la Comunidad</h2>
                  <p className="text-zinc-400 max-w-xl mx-auto mb-10">
                    Nuestra app se basa en el chat en tiempo real entre pasajeros. Comparte información sobre tu tren, averías o simplemente saluda a tus compañeros de viaje.
                  </p>
                  <button 
                    onClick={startJourney}
                    className="bg-renfe-red text-white px-10 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all"
                  >
                    Entrar al Chat del Tren
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {currentView === VIEWS.SELECTION && (
          <SelectionScreen onSelect={handleSelection} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 text-zinc-500 text-center md:text-left">
            <div className="max-w-xs mx-auto md:mx-0">
              <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
                <div className="bg-renfe-red p-1.5 rounded-lg">
                  <Train className="text-white" size={24} />
                </div>
                <span className="text-white text-xl font-outfit font-bold tracking-tight">
                  TrenConnect TGN
                </span>
              </div>
              <p className="text-sm font-light leading-relaxed">
                Plataforma independiente para mejorar la experiencia de viaje en Tarragona. Conectamos personas, no solo estaciones.
              </p>
            </div>
            {/* Links and Copyright stuff */}
          </div>
          <div className="mt-10 pt-10 border-t border-zinc-900 text-center text-[10px] font-medium tracking-widest uppercase text-zinc-600">
            &copy; 2026 TrenConnect Tarragona • App no oficial
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
