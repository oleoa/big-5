'use client';

import InputLogo from '@/components/admin/InputLogo';
import { ColorPicker } from '@/components/admin/ColorPicker';
import type { Mentora } from '@/types/mentora';

interface Props {
  mentora: Mentora | null;
}

export function TabAparencia({ mentora }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium mb-3">Cores</h4>
        <div className="grid grid-cols-3 gap-4">
          <ColorPicker id="cor_primaria" name="cor_primaria" label="Cor primária" defaultValue={mentora?.corPrimaria ?? '#6366f1'} />
          <ColorPicker id="cor_fundo" name="cor_fundo" label="Cor de fundo" defaultValue={mentora?.corFundo ?? '#ffffff'} />
          <ColorPicker id="cor_texto" name="cor_texto" label="Cor de texto" defaultValue={mentora?.corTexto ?? '#111827'} />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Logos</h4>
        <div className="space-y-4">
          <InputLogo id="logo_principal_url" name="logo_principal_url" label="Logo principal (URL)" inicial={mentora?.logoPrincipalUrl ?? ''} />
          <InputLogo id="logo_secundaria_url" name="logo_secundaria_url" label="Logo secundária (URL)" inicial={mentora?.logoSecundariaUrl ?? ''} />
          <InputLogo id="logo_icone_url" name="logo_icone_url" label="Ícone (URL)" inicial={mentora?.logoIconeUrl ?? ''} />
        </div>
      </div>
    </div>
  );
}
