import { useEffect, useState } from 'react';

export function useSupabaseQuery(fetcher) {
  const [state, setState] = useState({ data: null, error: false, loading: true });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ data: null, error: false, loading: true });

    fetcher().then(({ data, error }) => {
      if (!active) return;
      const valid = !error && Array.isArray(data);
      setState({ data: valid ? data : null, error: !valid, loading: false });
    });

    return () => { active = false; };
  }, [fetcher, reloadKey]);

  return { ...state, retry: () => setReloadKey(k => k + 1) };
}
