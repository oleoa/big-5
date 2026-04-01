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
 * Returns a CSS variables style object that bridges mentora colors into shadcn's theme system.
 */
export function mentoraThemeStyle(mentora: {
  corPrimaria: string;
  corFundo: string;
  corTexto: string;
}): React.CSSProperties {
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
    "--destructive": "oklch(0.577 0.245 27.325)",
    backgroundColor: mentora.corFundo,
    color: mentora.corTexto,
  } as React.CSSProperties;
}
