'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

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
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-3">
        <Input
          id={id}
          name={name}
          type="url"
          value={url}
          onChange={e => handleChange(e.target.value)}
          placeholder="https://..."
        />
        {url && !erro && (
          <button
            type="button"
            onClick={() => valida && setModal(true)}
            className="shrink-0 w-10 h-10 rounded-md border flex items-center justify-center overflow-hidden cursor-pointer bg-muted"
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

      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="max-w-lg">
          <DialogTitle className="sr-only">Pré-visualização do logo</DialogTitle>
          {valida && (
            <img src={url} alt="" className="max-w-full max-h-[70vh] object-contain mx-auto" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
