/**
 * Returns '#ffffff' or '#000000' based on the perceived luminance of the hex color.
 * Used to determine text color on top of the mentora's primary color.
 */
export function getContrastColor(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;

  // sRGB to linear
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const luminance =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  return luminance > 0.4 ? "#000000" : "#ffffff";
}

/**
 * Themes auxiliares — mentora.slug que adota visual próprio para além da paleta básica.
 * Hoje: 'valquiria-abreu' → tema "quiet luxury" (areia + azul, Cormorant Garamond, botões pill).
 */
export type MentoraTema = "quiet-luxury" | null;

export function getMentoraTema(slug: string): MentoraTema {
  if (slug === "valquiria-abreu") return "quiet-luxury";
  return null;
}

/**
 * Returns a CSS variables style object that bridges mentora colors into shadcn's theme system.
 */
export function mentoraThemeStyle(mentora: {
  slug: string;
  corPrimaria: string;
  corFundo: string;
  corTexto: string;
}): React.CSSProperties {
  const tema = getMentoraTema(mentora.slug);

  // Quiet luxury: Valquiria — paleta fixa (areia + azul da marca), independente do que
  // estiver salvo na row (mas mantemos sincronizado para o admin/painel ler o mesmo).
  if (tema === "quiet-luxury") {
    return {
      "--background": "#f0e6d2",
      "--foreground": "#102232",
      "--card": "#ffffff",
      "--card-foreground": "#102232",
      "--popover": "#ffffff",
      "--popover-foreground": "#102232",
      "--primary": "#2f5878",
      "--primary-foreground": "#ffffff",
      "--secondary": "#e7dbc4",
      "--secondary-foreground": "#102232",
      "--muted": "#e7dbc4",
      "--muted-foreground": "#6b7886",
      "--accent": "#e7dbc4",
      "--accent-foreground": "#102232",
      "--input": "rgba(47, 88, 120, 0.16)",
      "--border": "rgba(47, 88, 120, 0.16)",
      "--ring": "#2f5878",
      "--destructive": "#B5462E",
      // Extensões usadas pelas regras [data-mentora-theme="quiet-luxury"] no globals.css
      "--accent-hover": "#3a678a",
      "--brand-blue": "#2f5878",
      "--brand-blue-dark": "#264a66",
      "--brand-blue-light": "#3a678a",
      "--text-secondary": "#36505f",
      "--text-faint": "#6b7886",
      "--border-blue-soft": "rgba(47, 88, 120, 0.16)",
      "--border-blue-strong": "rgba(47, 88, 120, 0.30)",
      backgroundColor: "#f0e6d2",
      color: "#102232",
    } as React.CSSProperties;
  }

  // Comportamento padrão (todas as outras mentoras): cores vindas da DB.
  return {
    "--background": mentora.corFundo,
    "--foreground": mentora.corTexto,
    "--card": mentora.corFundo,
    "--card-foreground": mentora.corTexto,
    "--primary": mentora.corPrimaria,
    "--primary-foreground": getContrastColor(mentora.corPrimaria),
    "--ring": mentora.corPrimaria,
    "--muted": mentora.corTexto + "12",
    "--muted-foreground": mentora.corTexto + "99",
    "--input": mentora.corTexto + "25",
    "--border": mentora.corTexto + "20",
    "--popover": mentora.corFundo,
    "--popover-foreground": mentora.corTexto,
    "--destructive": "#B5462E",
    backgroundColor: mentora.corFundo,
    color: mentora.corTexto,
  } as React.CSSProperties;
}
