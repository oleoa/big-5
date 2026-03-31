# CLAUDE.md — Big Five IPIP-NEO-120 Personality Test

## Project Overview

A web application that administers the IPIP-NEO-120 personality questionnaire, scores it according to the official Big Five model (5 domains × 6 facets × 4 items = 120 items), and presents results with visual charts.

**Brand:** Valquiria Abreu
**Stack:** Next.js (App Router) + Tailwind CSS (via Windsurf/wind)
**Language:** TypeScript
**Data:** All 120 items are in `/data/ipip-neo-120-items.json`

---

## Branding — Valquiria Abreu

All UI work MUST follow the Valquiria Abreu brand identity. The full branding guide is at `/data/branding.pdf`.

### Brand Color Palette

CSS variables are defined in `app/globals.css` and exposed via Tailwind's `@theme inline`. Always use the semantic Tailwind classes, never hardcoded gray/blue Tailwind utilities.

| Token            | Tailwind Class   | Hex       | Usage                                              |
| ---------------- | ---------------- | --------- | -------------------------------------------------- |
| `--primary`      | `bg-primary`     | `#355e81` | Buttons, links, progress bars, selected states      |
| `--primary-light`| `bg-primary-light`| `#a8b9c8`| Secondary backgrounds, subtle highlights            |
| `--accent`       | `bg-accent`      | `#aa4837` | Hover states on CTAs, emphasis, terracota warmth    |
| `--background`   | `bg-background`  | `#f2eeeb` | Page background (off-white)                         |
| `--surface`      | `bg-surface`     | `#ffffff` | Cards, panels, elevated containers                  |
| `--border`       | `border-border`  | `#d8cfc9` | Borders, dividers, separators (taupe/bege)          |
| `--foreground`   | `text-foreground` | `#2d2d2d`| Body text (use opacity variants: `/60`, `/50`, `/40`) |

### Logo Assets (in `/public/`)

| File                  | Description                          | Where to use                          |
| --------------------- | ------------------------------------ | ------------------------------------- |
| `logo.png`            | Main mark (symbol + name, vertical)  | Landing page hero                     |
| `logo-horizontal.png` | Secondary mark (symbol + name, inline)| Site headers, test/results pages      |
| `icon.png`            | Symbol only (circular swirl)         | Favicon, small brand marks            |

Source files are in `/data/logos/`.

### Design Principles

- **No emojis** — use colored dots or the domain colors for visual indicators
- **No raw Tailwind grays/blues** — always use the brand CSS variables (`bg-background` not `bg-gray-50`, `border-border` not `border-gray-200`, `bg-primary` not `bg-blue-500`)
- **Backgrounds:** page = `bg-background` (off-white), cards = `bg-surface` (white)
- **Buttons:** primary = `bg-primary` with `hover:bg-accent`, secondary = text with `hover:bg-surface`
- **Text opacity:** use `text-foreground/60` for secondary text, `text-foreground/40` for muted text — not `text-gray-500`
- **Typography:** clean, contemporary, light — the brand conveys leveza (lightness) and sofisticação acessível (accessible sophistication)
- **Animations:** keep existing slide-in and fade-in animations for smooth transitions

---

## Domain Model

### Big Five Domains (OCEAN)

| Code | Domain PT              | Domain EN              | Items |
| ---- | ---------------------- | ---------------------- | ----- |
| O    | Abertura à Experiência | Openness to Experience | 24    |
| C    | Conscienciosidade      | Conscientiousness      | 24    |
| E    | Extroversão            | Extraversion           | 24    |
| A    | Amabilidade            | Agreeableness          | 24    |
| N    | Neuroticismo           | Neuroticism            | 24    |

### 30 Facets (6 per domain, 4 items per facet)

**Neuroticism (N):** Anxiety, Anger, Depression, Self-Consciousness, Immoderation, Vulnerability
**Extraversion (E):** Friendliness, Gregariousness, Assertiveness, Activity Level, Excitement-Seeking, Cheerfulness
**Openness (O):** Imagination, Artistic Interests, Emotionality, Adventurousness, Intellect, Liberalism
**Agreeableness (A):** Trust, Morality, Altruism, Cooperation, Modesty, Sympathy
**Conscientiousness (C):** Self-Efficacy, Orderliness, Dutifulness, Achievement-Striving, Self-Discipline, Cautiousness

### Scoring Rules

1. Each item is answered on a 1–5 Likert scale:
   - 1 = Muito Impreciso (Very Inaccurate)
   - 2 = Moderadamente Impreciso (Moderately Inaccurate)
   - 3 = Nem Preciso nem Impreciso (Neither)
   - 4 = Moderadamente Preciso (Moderately Accurate)
   - 5 = Muito Preciso (Very Accurate)

2. **Reverse-scored items** (`reverse: true` in JSON): flip the value → `score = 6 - rawValue`

3. **Facet score** = sum of the 4 items in that facet (range 4–20)

4. **Domain score** = sum of all 24 items in that domain (range 24–120), which equals sum of its 6 facet scores

5. **Percentile mapping**: Use the norm tables from Johnson (2014) or a simple linear approximation:
   - Domain: `percentile ≈ ((score - 24) / 96) * 100`
   - Facet: `percentile ≈ ((score - 4) / 16) * 100`
   - For a more accurate approach, use the norm tables at https://osf.io/tbmh5/

6. **Descriptors**:
   - Low: percentile < 30
   - Average: 30 ≤ percentile ≤ 70
   - High: percentile > 70

---

## Item Data Schema

```typescript
interface Item {
  id: number; // 1–120
  text: string; // Portuguese text
  textEn: string; // English text (reference)
  domain: "N" | "E" | "O" | "A" | "C";
  facet: string; // e.g. "Anxiety", "Friendliness"
  reverse: boolean; // true = score is 6 - rawValue
}
```

---

## App Structure

```
/app
  /page.tsx                    → Landing / start page (logo hero + domain cards)
  /test/page.tsx               → Questionnaire (120 questions, one per page)
  /results/page.tsx            → Results dashboard with charts
  /globals.css                 → Brand CSS variables + animations
  /layout.tsx                  → Root layout (fonts, metadata, favicon)
/components
  /QuestionCard.tsx            → Single question with 5 Likert-scale buttons
  /ProgressBar.tsx             → Shows progress (e.g. 34/120)
  /RadarChart.tsx              → SVG radar/spider chart for 5 domains
  /FacetBreakdown.tsx          → Expandable accordion with facet bar charts
/data
  /ipip-neo-120-items.json     → The 120 items
  /branding.pdf                → Full brand identity guide
  /logos/                      → Original logo source files
/lib
  /scoring.ts                  → Scoring logic (reverse, facet sums, domain sums, percentiles)
  /types.ts                    → TypeScript interfaces
  /descriptions.ts             → Domain info (colors, icons, descriptions) + facet translations
/public
  /logo.png                    → Main brand mark (vertical)
  /logo-horizontal.png         → Secondary brand mark (horizontal)
  /icon.png                    → Brand symbol only
```

---

## Key UX Decisions

- **One question per page** (mobile-first) or **paginated in blocks of 10–15** — choose based on preference
- Progress bar always visible
- No backend required — all state lives in client (React state or localStorage for persistence)
- Results page shows: radar chart (5 domains), then expandable sections for each domain with its 6 facet bar charts
- Share/download results as image (optional, stretch goal)

---

## Important Implementation Notes

- All 120 items MUST be answered before scoring (or handle missing with proration)
- The `reverse` field in the JSON determines scoring direction — do NOT hardcode reverse item IDs
- Domain colors (defined in `lib/descriptions.ts`, used for data visualization — these are distinct from the brand palette):
  - N (Neuroticism): `#E74C3C` (red)
  - E (Extraversion): `#F39C12` (amber)
  - O (Openness): `#9B59B6` (purple)
  - A (Agreeableness): `#2ECC71` (green)
  - C (Conscientiousness): `#3498DB` (blue)
- All UI chrome (buttons, backgrounds, borders) must use the brand palette, NOT the domain colors. Domain colors are only for chart data points, facet bars, and domain labels.
- The test is public domain (IPIP) — no license restrictions on the items
- Reference: Johnson, J. A. (2014). _Journal of Research in Personality, 51_, 78–89.

---

## Translations / Labels (PT)

| EN                              | PT                        |
| ------------------------------- | ------------------------- |
| Very Inaccurate                 | Muito Impreciso           |
| Moderately Inaccurate           | Moderadamente Impreciso   |
| Neither Accurate nor Inaccurate | Nem Preciso nem Impreciso |
| Moderately Accurate             | Moderadamente Preciso     |
| Very Accurate                   | Muito Preciso             |
| Neuroticism                     | Neuroticismo              |
| Extraversion                    | Extroversão               |
| Openness to Experience          | Abertura à Experiência    |
| Agreeableness                   | Amabilidade               |
| Conscientiousness               | Conscienciosidade         |
| Low                             | Baixo                     |
| Average                         | Médio                     |
| High                            | Alto                      |

### Facet Translations

| EN                   | PT                    |
| -------------------- | --------------------- |
| Anxiety              | Ansiedade             |
| Anger                | Raiva                 |
| Depression           | Depressão             |
| Self-Consciousness   | Autoconsciência       |
| Immoderation         | Imoderação            |
| Vulnerability        | Vulnerabilidade       |
| Friendliness         | Amigabilidade         |
| Gregariousness       | Gregarismo            |
| Assertiveness        | Assertividade         |
| Activity Level       | Nível de Atividade    |
| Excitement-Seeking   | Busca de Emoções      |
| Cheerfulness         | Alegria               |
| Imagination          | Imaginação            |
| Artistic Interests   | Interesses Artísticos |
| Emotionality         | Emotividade           |
| Adventurousness      | Aventureirismo        |
| Intellect            | Intelecto             |
| Liberalism           | Liberalismo           |
| Trust                | Confiança             |
| Morality             | Moralidade            |
| Altruism             | Altruísmo             |
| Cooperation          | Cooperação            |
| Modesty              | Modéstia              |
| Sympathy             | Compaixão             |
| Self-Efficacy        | Autoeficácia          |
| Orderliness          | Organização           |
| Dutifulness          | Senso de Dever        |
| Achievement-Striving | Busca de Realização   |
| Self-Discipline      | Autodisciplina        |
| Cautiousness         | Cautela               |
