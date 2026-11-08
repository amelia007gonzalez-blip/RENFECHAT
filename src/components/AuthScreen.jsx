import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, Train } from 'lucide-react';
import { signInWithEmail, signUpWithAlias } from '../lib/auth';

const MIN_PASSWORD_LENGTH = 6;
const fieldClass = 'w-full bg-zinc-950 border border-zinc-800 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 font-medium text-sm';
const labelClass = 'text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block';

const AuthScreen = ({ onAuthenticated, onBack }) => {
  const [mode, setMode] = useState('login');
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const isRegister = mode === 'register';

  const switchMode = () => {
    setMode(isRegister ? 'login' : 'register');
    setError('');
    setNotice('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    const trimmedEmail = email.trim();
    const trimmedAlias = alias.trim();
    if (isRegister && !trimmedAlias) {
      setError('Escribe el alias con el que te verán los demás viajeros.');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }

    setSubmitting(true);
    if (isRegister) {
      const result = await signUpWithAlias({ email: trimmedEmail, password, alias: trimmedAlias });
      setSubmitting(false);
      if (result.error) return setError(result.error);
      if (result.needsConfirmation) return setNotice('Cuenta creada. Revisa tu correo para confirmarla.');
      onAuthenticated();
      return;
    }

    const result = await signInWithEmail({ email: trimmedEmail, password });
    setSubmitting(false);
    if (result.error) return setError(result.error);
    onAuthenticated();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-zinc-950 pt-28 sm:pt-36 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-md">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl text-zinc-400 mb-6" aria-label="Volver">
          <ArrowLeft size={20} />
        </button>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-renfe-red/20 p-2.5 rounded-xl"><Train className="text-renfe-red" size={20} /></div>
            <div>
              <h1 className="text-2xl font-outfit font-black">{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Solo viajeros registrados</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label htmlFor="auth-alias" className={labelClass}>Alias</label>
                <input id="auth-alias" type="text" maxLength={40} required value={alias}
                  onChange={(e) => setAlias(e.target.value)} placeholder="Como te verán en el chat" className={fieldClass} />
              </div>
            )}
            <div>
              <label htmlFor="auth-email" className={labelClass}>Correo</label>
              <input id="auth-email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="auth-password" className={labelClass}>Contraseña</label>
              <input id="auth-password" type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isRegister ? 'new-password' : 'current-password'} className={fieldClass} />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-bold flex items-center gap-1">
                <AlertCircle size={12} /> {error}
              </p>
            )}
            {notice && <p className="text-green-400 text-xs font-bold">{notice}</p>}

            <button type="submit" disabled={submitting}
              className="w-full bg-renfe-red hover:bg-red-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95">
              {submitting ? 'Un momento...' : isRegister ? 'Crear cuenta' : 'Entrar'}
            </button>
          </form>

          <button onClick={switchMode} className="w-full text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest">
            {isRegister ? 'Ya tengo cuenta' : 'No tengo cuenta: crear una'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthScreen;
