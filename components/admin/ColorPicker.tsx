'use client';

import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const PRESET_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#F97316', '#14B8A6', '#6366F1', '#A855F7',
  '#DC2626', '#CA8A04', '#059669', '#2563EB', '#7C3AED',
  '#111827', '#374151', '#6B7280', '#D1D5DB', '#FFFFFF',
];

interface Props {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
}

export function ColorPicker({ id, name, label, defaultValue }: Props) {
  const [color, setColor] = useState(defaultValue);
  const pickerRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="flex items-center gap-3">
        {/* Preview + native picker trigger */}
        <button
          type="button"
          className="size-10 shrink-0 rounded-lg border border-input shadow-sm cursor-pointer transition-shadow hover:ring-2 hover:ring-ring/50"
          style={{ backgroundColor: color }}
          onClick={() => pickerRef.current?.click()}
          aria-label="Escolher cor"
        />

        {/* Hex input */}
        <Input
          id={id}
          value={color}
          onChange={(e) => {
            const val = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) setColor(val);
          }}
          className="font-mono w-28"
          maxLength={7}
          placeholder="#000000"
        />
      </div>

      {/* Swatches */}
      <div className="flex flex-wrap gap-1.5">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            className={cn(
              'size-6 rounded-md border cursor-pointer transition-all hover:scale-110',
              color.toUpperCase() === c ? 'ring-2 ring-ring ring-offset-1' : 'border-input'
            )}
            style={{ backgroundColor: c }}
            onClick={() => setColor(c)}
            aria-label={c}
          />
        ))}
      </div>

      {/* Hidden native picker */}
      <input
        ref={pickerRef}
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="sr-only"
        tabIndex={-1}
      />

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={color} />
    </div>
  );
}
