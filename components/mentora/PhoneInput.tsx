"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { COUNTRIES, DEFAULT_COUNTRY_CODE, type Country } from "@/data/countries";
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
  value: string;
  onChange: (e164Value: string) => void;
}

function getCountryByCode(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0];
}

function digitsOnly(str: string): string {
  return str.replace(/\D/g, "");
}

function formatNumber(digits: string, country: Country): string {
  if (!country.format || digits.length === 0) return digits;
  let result = "";
  let di = 0;
  for (const ch of country.format) {
    if (di >= digits.length) break;
    if (ch === "#") {
      result += digits[di];
      di++;
    } else {
      result += ch;
    }
  }
  return result;
}

export function isValidPhone(e164: string): boolean {
  if (!e164 || !e164.startsWith("+")) return false;
  const match = findCountryFromE164(e164);
  if (!match) return false;
  const digits = e164.slice(match.dialCode.length);
  const numDigits = digitsOnly(digits).length;
  return numDigits >= match.minDigits;
}

function findCountryFromE164(e164: string): Country | null {
  const sorted = [...COUNTRIES].sort(
    (a, b) => b.dialCode.length - a.dialCode.length
  );
  for (const c of sorted) {
    if (e164.startsWith(c.dialCode)) return c;
  }
  return null;
}

export default function PhoneInput({ value, onChange }: PhoneInputProps) {
  const [country, setCountry] = useState<Country>(() => {
    if (value) {
      const found = findCountryFromE164(value);
      if (found) return found;
    }
    return getCountryByCode(DEFAULT_COUNTRY_CODE);
  });

  const [localDigits, setLocalDigits] = useState<string>(() => {
    if (value) {
      const found = findCountryFromE164(value);
      if (found) return digitsOnly(value.slice(found.dialCode.length));
    }
    return "";
  });

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const emitChange = useCallback(
    (digits: string, c: Country) => {
      onChange(digits.length > 0 ? c.dialCode + digits : "");
    },
    [onChange]
  );

  const handleDigitChange = (raw: string) => {
    const digits = digitsOnly(raw).slice(0, country.maxDigits);
    setLocalDigits(digits);
    emitChange(digits, country);
  };

  const selectCountry = (c: Country) => {
    setCountry(c);
    setOpen(false);
    setSearch("");
    const trimmed = localDigits.slice(0, c.maxDigits);
    setLocalDigits(trimmed);
    emitChange(trimmed, c);
  };

  const filtered = search.trim()
    ? COUNTRIES.filter((c) => {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.dialCode.includes(q) ||
          c.code.toLowerCase().includes(q)
        );
      })
    : COUNTRIES;

  const displayValue = formatNumber(localDigits, country);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center w-full rounded-lg border border-input overflow-hidden transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        {/* Country selector button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 px-3 h-11 transition-colors border-r border-input shrink-0 hover:bg-muted"
        >
          <span className="text-lg leading-none">{country.flag}</span>
          <span className="text-sm opacity-70">{country.dialCode}</span>
          <svg
            className={`w-3 h-3 opacity-40 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Phone number input */}
        <input
          type="tel"
          inputMode="numeric"
          value={displayValue}
          onChange={(e) => handleDigitChange(e.target.value)}
          className="flex-1 px-3 h-11 focus:outline-none bg-transparent text-base md:text-sm"
          placeholder={country.format?.replace(/#/g, "0") ?? "Número"}
        />
      </div>

      {/* Country dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-50 left-0 right-0 mt-1 border border-border bg-popover rounded-lg shadow-lg overflow-hidden"
        >
          {/* Search */}
          <div className="p-2 border-b border-border">
            <Input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
              placeholder="Pesquisar país..."
            />
          </div>

          {/* Country list */}
          <ul className="max-h-60 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-muted-foreground text-center">
                Nenhum país encontrado
              </li>
            )}
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => selectCountry(c)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted transition-colors text-sm ${
                    c.code === country.code ? "bg-muted font-medium" : ""
                  }`}
                >
                  <span className="text-lg leading-none">{c.flag}</span>
                  <span className="flex-1">{c.name}</span>
                  <span className="text-muted-foreground">{c.dialCode}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
