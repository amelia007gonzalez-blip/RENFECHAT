import { useState } from 'react';
import { ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { getPhotoUrl } from '../lib/chatPhotos';

const PhotoMessage = ({ alias, path }) => {
  const [status, setStatus] = useState('idle');
  const [url, setUrl] = useState(null);

  const reveal = async () => {
    setStatus('loading');
    const signedUrl = await getPhotoUrl(path);
    if (!signedUrl) {
      setStatus('error');
      return;
    }
    setUrl(signedUrl);
    setStatus('ready');
  };

  if (status === 'ready') {
    return <img src={url} alt={`Foto de ${alias}`} className="rounded-2xl max-w-full max-h-72 object-contain bg-zinc-950" />;
  }

  return (
    <button type="button" onClick={reveal} disabled={status === 'loading'}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-950/60 border border-zinc-700 text-left text-xs font-bold text-zinc-200 hover:bg-zinc-900 transition-all disabled:opacity-60">
      {status === 'loading' ? <Loader2 size={16} className="animate-spin text-blue-400" /> : <ImageIcon size={16} className="text-blue-400" />}
      <span>
        {status === 'error'
          ? <span className="flex items-center gap-1 text-red-400"><AlertCircle size={12} /> No se pudo cargar. Toca para reintentar.</span>
          : `${alias} envió una foto. Toca para verla`}
      </span>
    </button>
  );
};

export default PhotoMessage;
