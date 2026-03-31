'use client';

import { useState } from 'react';

interface Props {
  id: string;
  name: string;
  label: string;
  inicial?: string;
}

export default function InputLogo({ id, name, label, inicial = '' }: Props) {
  const [url, setUrl] = useState(inicial);
  const [valida, setValida] = useState(!!inicial);
  const [erro, setErro] = useState(false);
  const [modal, setModal] = useState(false);

  function handleChange(valor: string) {
    setUrl(valor);
    setValida(false);
    setErro(false);
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <input
          id={id}
          name={name}
          type="url"
          value={url}
          onChange={e => handleChange(e.target.value)}
          className="w-full border border-border rounded-md px-3 py-2 text-sm"
        />
        {url && !erro && (
          <button
            type="button"
            onClick={() => valida && setModal(true)}
            className="shrink-0 w-10 h-10 rounded border border-border bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer"
          >
            <img
              src={url}
              alt=""
              className={`w-full h-full object-contain ${valida ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => { setValida(true); setErro(false); }}
              onError={() => { setValida(false); setErro(true); }}
            />
          </button>
        )}
      </div>

      {modal && valida && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setModal(false)}
        >
          <div
            className="bg-white rounded-lg p-4 max-w-lg max-h-[80vh] flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <img src={url} alt="" className="max-w-full max-h-[70vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
