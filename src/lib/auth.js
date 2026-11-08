import { useEffect, useState } from 'react';
import { supabase } from './supabase';

const ERROR_MESSAGES = {
  'Invalid login credentials': 'Correo o contraseña incorrectos.',
  'User already registered': 'Ya existe una cuenta con ese correo.',
  'Email not confirmed': 'Tu correo todavía no está confirmado.',
};

const translateError = (error) => ERROR_MESSAGES[error?.message] || 'No se pudo completar la operación. Inténtalo de nuevo.';

export function useSession() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setReady(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setReady(true);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { session, ready };
}

export async function signUpWithAlias({ email, password, alias }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { alias } },
  });
  if (error) return { error: translateError(error) };
  return { needsConfirmation: !data.session };
}

export async function signInWithEmail({ email, password }) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: translateError(error) };
  return {};
}

export async function signOutUser() {
  await supabase.auth.signOut();
}
