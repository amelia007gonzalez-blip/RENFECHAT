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
  Settings,
  CircleAlert
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
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Horarios', icon: <Clock size={16} />, action: startJourney },
    { name: 'Comunidad', icon: <Users size={16} />, action: startJourney },
    { name: 'Estaciones', icon: <MapPin size={16} />, action: startJourney },
    { name: 'Incidencias', icon: <Bell size={16} />, action: startJourney },
  ];

  if (currentView === VIEWS.CHAT) {
    return <ChatRoom user={userProfile} room={selectedRoom} onBack={() => setCurrentView(VIEWS.SELECTION)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-renfe-red/30 overflow-x-hidden flex flex-col">
      {/* Disclaimer Bar */}
      <div className="bg-orange-500/10 border-b border-orange-500/20 py-2 text-center text-[10px] sm:text-xs font-medium text-orange-200/80 z-[100] relative">
        ⚠️ <span className="font-bold uppercase tracking-wider">Aviso:</span> Esta aplicación es meramente para entretenimiento y <span className="font-bold">no tiene vinculación oficial con Renfe</span>.
      </div>

      <AnimatePresence>
        {currentView === VIEWS.STANDARDS && (
          <StandardsScreen 
            onAccept={() => setCurrentView(VIEWS.SELECTION)} 
            onCancel={() => setCurrentView(VIEWS.LANDING)} 
          />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className={`fixed top-[32px] sm:top-[36px] w-full z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'glass py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer z-50"
            onClick={() => setCurrentView(VIEWS.LANDING)}
          >
            <div className="bg-renfe-red p-1.5 rounded-lg">
              <Train className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-outfit font-bold tracking-tight leading-none">
                Tren<span className="text-renfe-red">Connect</span> <span className="text-tarragona-gold text-base sm:text-lg">TGN</span>
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-500 font-bold -mt-0.5 sm:mt-0">App no oficial</span>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={link.action}
                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              >
                {link.icon} {link.name}
              </button>
            ))}
            <button 
              onClick={startJourney}
              className="bg-renfe-red hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-renfe-red/20"
            >
              Acceder
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden text-white z-50 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-zinc-950/95 backdrop-blur-3xl border-b border-zinc-800 overflow-hidden"
            >
              <div className="container mx-auto px-8 py-10 space-y-6">
                {navLinks.map((link) => (
                  <button 
                    key={link.name} 
                    onClick={link.action}
                    className="w-full flex items-center gap-4 text-xl font-bold text-zinc-300 hover:text-white"
                  >
                    <span className="p-3 bg-zinc-900 rounded-2xl">{link.icon}</span>
                    {link.name}
                  </button>
                ))}
                <button 
                  onClick={startJourney}
                  className="w-full bg-renfe-red text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em]"
                >
                  Acceder al Chat
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1">
        {currentView === VIEWS.LANDING && (
          <div className="pt-20">
            {/* Hero Section */}
            <section className="relative pt-16 sm:pt-32 pb-20 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-renfe-red/10 to-transparent pointer-events-none" />
              <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-block py-1 px-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-8">
                    Comunidad de Pasajeros de Tarragona
                  </span>
                  <h1 className="text-5xl md:text-8xl font-outfit font-extrabold mb-8 leading-[1.1] tracking-tighter">
                    Conecta con tu <span className="text-transparent bg-clip-text bg-gradient-to-br from-renfe-red via-orange-500 to-tarragona-gold">Tren</span><br /> 
                    en tiempo real.
                  </h1>
                  <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
                    Únete al chat de los viajeros que están ahora mismo en tu línea. Informa, consulta o simplemente pasa el rato.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                      onClick={startJourney}
                      className="w-full sm:w-auto bg-renfe-red text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-renfe-red/30"
                    >
                      Empezar ahora
                      <ChevronRight size={20} />
                    </button>
                    <button 
                      onClick={startJourney}
                      className="w-full sm:w-auto glass hover:bg-white/10 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                    >
                      Estado de la Red
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>
            
            {/* Disclaimer and essence info */}
            <section className="py-20">
               <div className="container mx-auto px-6">
                 <div className="bg-zinc-900/50 border border-zinc-800 p-8 sm:p-16 rounded-[4rem] text-center max-w-4xl mx-auto">
                    <MessageSquare className="text-renfe-red mx-auto mb-6" size={48} />
                    <h2 className="text-3xl sm:text-5xl font-outfit font-bold mb-6">La esencia es el Chat</h2>
                    <p className="text-zinc-500 text-lg mb-10 font-medium">
                      Esta no es una app oficial de horarios. Es un lugar de encuentro para los miles de personas que cogemos el tren en Tarragona a diario. ¡Nos vemos en el vagón!
                    </p>
                    <button onClick={startJourney} className="bg-white text-black px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                      Abrir Comunidad
                    </button>
                 </div>
               </div>
            </section>
          </div>
        )}

        {currentView === VIEWS.SELECTION && (
          <SelectionScreen onSelect={(user, room) => { setUserProfile(user); setSelectedRoom(room); setCurrentView(VIEWS.CHAT); }} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-900 bg-black mt-auto">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-zinc-600">
             <div className="flex items-center gap-3 grayscale opacity-50">
                <Train size={24} />
                <span className="font-outfit font-bold text-xl uppercase tracking-widest">TrenConnect TGN</span>
             </div>
             <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center">
                &copy; 2026 TrenConnect Tarragona • <span className="text-renfe-red">App no oficial para entretenimiento</span>
             </p>
             <div className="flex gap-6">
               <a href="#" className="hover:text-white transition-colors"><Settings size={20} /></a>
               <a href="#" className="hover:text-white transition-colors"><Info size={20} /></a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
