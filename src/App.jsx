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
  Bell
} from 'lucide-react';
import { supabase } from './lib/supabase';

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Horarios', icon: <Clock size={18} /> },
    { name: 'Comunidad', icon: <Users size={18} /> },
    { name: 'Estaciones', icon: <MapPin size={18} /> },
    { name: 'Incidencias', icon: <Bell size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-renfe-red/30">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="bg-renfe-red p-1.5 rounded-lg">
              <Train className="text-white" size={24} />
            </div>
            <span className="text-xl font-outfit font-bold tracking-tight">
              Renfe<span className="text-renfe-red">Connect</span> <span className="text-tarragona-gold">Tarragona</span>
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href="#" 
                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
            <button className="bg-renfe-red hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-renfe-red/20">
              Acceder
            </button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-renfe-red/10 to-transparent pointer-events-none" />
        <div className="absolute top-40 right-10 w-64 h-64 bg-tarragona-gold/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-renfe-red/5 rounded-full blur-[120px] pointer-events-none" />

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
              <button className="w-full sm:w-auto bg-white text-zinc-950 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all group shadow-xl">
                Empezar ahora
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto glass text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                Ver estado de la red
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Quick Info */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Usuarios activos', value: '+1.5k', icon: <Users className="text-blue-400" /> },
              { label: 'Actualización', value: 'Tiempo Real', icon: <Clock className="text-renfe-red" /> },
              { label: 'Fiabilidad', value: '98%', icon: <ShieldCheck className="text-green-400" /> },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="glass p-6 rounded-3xl flex items-center gap-5"
              >
                <div className="bg-zinc-900/50 p-3 rounded-2xl">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-zinc-500 text-sm font-medium">{stat.label}</div>
                  <div className="text-2xl font-bold font-outfit">{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <h2 className="text-4xl font-outfit font-extrabold mb-6 leading-tight">
                Información real,<br /> proporcionada por <span className="text-renfe-red">viajeros</span>.
              </h2>
              <p className="text-zinc-400 text-lg mb-8 font-light">
                Nuestro sistema utiliza informes comunitarios para alertarte sobre averías, retrasos o cambios de vía antes que nadie. La fuerza de Tarragona es su gente.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  'Alertas instantáneas vía WhatsApp/Push',
                  'Chat compartido por línea de tren',
                  'Localización de paradas en tiempo real',
                  'Gestión inteligente de billetes y abonos'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-zinc-300">
                    <div className="bg-renfe-red/20 p-1 rounded-full">
                      <ShieldCheck className="text-renfe-red" size={16} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <button className="text-renfe-red font-bold flex items-center gap-2 hover:gap-4 transition-all group">
                Saber más sobre la comunidad
                <ChevronRight size={20} />
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1 relative"
            >
              <div className="relative z-10 glass p-4 rounded-[2.5rem] shadow-2xl border-zinc-800">
                <div className="bg-zinc-900 overflow-hidden rounded-[2rem] aspect-[9/16] relative border border-zinc-800">
                  {/* Mock App UI */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-xl font-bold font-outfit">Línea R16</div>
                      <div className="bg-green-500/20 text-green-500 text-[10px] px-2 py-0.5 rounded-full font-bold">ON TIME</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50">
                        <div className="flex justify-between mb-2">
                          <span className="text-xs text-zinc-500 uppercase tracking-widest">Siguiente Salida</span>
                          <span className="text-xs font-bold text-renfe-red">12:45</span>
                        </div>
                        <div className="text-lg font-bold">Tarragona Central</div>
                        <div className="text-sm text-zinc-400">Dirección: Barcelona Sants</div>
                      </div>

                      <div className="pt-4 border-t border-zinc-800">
                        <div className="flex items-center gap-2 mb-3">
                          <MessageSquare size={14} className="text-zinc-500" />
                          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Comunidad</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-700" />
                            <div className="flex-1 bg-zinc-800/80 p-3 rounded-2xl rounded-tl-none">
                              <p className="text-[11px]">"El tren de las 12:45 ya está en la vía 2."</p>
                              <span className="text-[9px] text-zinc-500 mt-1 block">Zoe hace 2m</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-renfe-red/20" />
                            <div className="flex-1 bg-zinc-800/80 p-3 rounded-2xl rounded-tl-none border-l-2 border-renfe-red">
                              <p className="text-[11px] font-medium">"@Zoe ¡Gracias! Estoy llegando."</p>
                              <span className="text-[9px] text-zinc-500 mt-1 block">Marc hace 1m</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Tab Bar Mock */}
                  <div className="absolute bottom-0 w-full h-16 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 flex justify-around items-center px-4">
                    <Train size={20} className="text-renfe-red" />
                    <Users size={20} className="text-zinc-600" />
                    <div className="w-10 h-10 bg-renfe-red rounded-full flex items-center justify-center text-white shadow-lg -mt-8 border-4 border-zinc-900">
                      <Bell size={20} />
                    </div>
                    <MapPin size={20} className="text-zinc-600" />
                    <Settings size={20} className="text-zinc-600" />
                  </div>
                </div>
              </div>
              
              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-renfe-red/20 blur-[60px] rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-tarragona-gold/10 blur-[60px] rounded-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stations / Map Preview */}
      <section className="py-20 bg-zinc-900/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-outfit font-extrabold mb-12">Todas las paradas de la provincia</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Tarragona', 'Salou - PortAventura', 'Vila-seca', 'Reus', 'Altafulla', 'Torredembarra', 'Sant Vicenç de Calders', 'Camp de Tarragona'].map((station) => (
              <span key={station} className="glass px-6 py-3 rounded-2xl text-sm font-medium hover:bg-white/10 transition-all cursor-pointer border border-white/5">
                {station}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 text-zinc-500">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-renfe-red p-1.5 rounded-lg">
                  <Train className="text-white" size={24} />
                </div>
                <span className="text-white text-xl font-outfit font-bold tracking-tight">
                  RenfeConnect
                </span>
              </div>
              <p className="text-sm font-light leading-relaxed">
                Plataforma independiente para mejorar la experiencia de viaje en Tarragona. Conectamos personas, no solo estaciones.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h4 className="text-white font-bold mb-6">Plataforma</h4>
                <ul className="space-y-4 text-sm font-light">
                  <li><a href="#" className="hover:text-renfe-red transition-colors">Horarios</a></li>
                  <li><a href="#" className="hover:text-renfe-red transition-colors">Estado Red</a></li>
                  <li><a href="#" className="hover:text-renfe-red transition-colors">Abiertas</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6">Comunidad</h4>
                <ul className="space-y-4 text-sm font-light">
                  <li><a href="#" className="hover:text-renfe-red transition-colors">Chat de Línea</a></li>
                  <li><a href="#" className="hover:text-renfe-red transition-colors">Consejos</a></li>
                  <li><a href="#" className="hover:text-renfe-red transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6">Soporte</h4>
                <ul className="space-y-4 text-sm font-light">
                  <li><a href="#" className="hover:text-renfe-red transition-colors">Contacto</a></li>
                  <li><a href="#" className="hover:text-renfe-red transition-colors">Privacidad</a></li>
                  <li><a href="#" className="hover:text-renfe-red transition-colors">Términos</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-zinc-900 text-center text-xs font-medium tracking-widest uppercase">
            &copy; 2026 Renfe Connect Tarragona • Developed with ❤️ for Tarragona
          </div>
        </div>
      </footer>
    </div>
  );
};

// Simple Fallback for Settings icon if not imported
const Settings = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default App;
