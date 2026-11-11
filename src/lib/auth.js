import { useEffect, useState } from 'react';
import { supabase } from './supabase';

const ERROR_MESSAGES = {
  invalid_credentials: 'Correo o contraseña incorrectos.',
  'Invalid login credentials': 'Correo o contraseña incorrectos.',
  user_already_exists: 'Ya existe una cuenta con ese correo.',
  'User already registered': 'Ya existe una cuenta con ese correo.',
  email_not_confirmed: 'Tu correo todavía no está confirmado.',
  'Email not confirmed': 'Tu correo todavía no está confirmado.',
  over_email_send_rate_limit: 'Se han enviado demasiados correos. Espera unos minutos e inténtalo de nuevo.',
  over_request_rate_limit: 'Demasiados intentos seguidos. Espera unos minutos e inténtalo de nuevo.',
  weak_password: 'La contraseña es demasiado débil. Prueba con una más larga.',
  email_address_invalid: 'El correo no es válido. Revísalo e inténtalo de nuevo.',
  signup_disabled: 'El registro de nuevas cuentas está desactivado en este momento.',
  'Failed to fetch': 'No se pudo conectar con el servidor. Revisa tu conexión a internet o que las variables de entorno de Supabase estén bien configuradas en Vercel.',
  'fetch failed': 'No se pudo conectar con el servidor. Revisa tu conexión a internet o que las variables de entorno de Supabase estén bien configuradas en Vercel.',
};

const translateError = (error) => {
  console.error('Error de autenticación:', error);
  const known = ERROR_MESSAGES[error?.code] || ERROR_MESSAGES[error?.message];
  if (known) return known;
  const raw = error?.message || error?.toString?.() || '';
  return raw || 'No se pudo completar la operación. Inténtalo de nuevo en un momento.';
};

export function useSession() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setReady(true);
      if (event === 'PASSWORD_RECOVERY') setRecovering(true);
      if (event === 'USER_UPDATED' || event === 'SIGNED_OUT') setRecovering(false);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { session, ready, recovering };
}

export async function signUpWithAlias({ email, password, alias }) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { alias } },
    });
    if (error) return { error: translateError(error) };
    return { needsConfirmation: !data.session };
  } catch (e) {
    return { error: translateError(e) };
  }
}

export async function signInWithEmail({ email, password }) {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: translateError(error) };
    return {};
  } catch (e) {
    return { error: translateError(e) };
  }
}

export async function requestPasswordReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
  if (error) return { error: translateError(error) };
  return {};
}

export async function updatePassword(password) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: translateError(error) };
  return {};
}

export async function signOutUser() {
  await supabase.auth.signOut();
}
