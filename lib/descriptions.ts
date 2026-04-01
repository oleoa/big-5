import type { DomainCode } from "./types";

export const DOMAIN_INFO: Record<
  DomainCode,
  {
    namePt: string;
    color: string;
    icon: string;
    descriptions: { low: string; average: string; high: string };
  }
> = {
  N: {
    namePt: "Neuroticismo",
    color: "#E74C3C",
    icon: "🌊",
    descriptions: {
      low: "Tende a ser emocionalmente estável, calmo e capaz de lidar com o estresse sem grande dificuldade. Raramente se sente ansioso ou irritado.",
      average:
        "Experimenta emoções negativas ocasionalmente, mas geralmente consegue gerenciá-las de forma adequada. Tem uma resiliência emocional moderada.",
      high: "Tende a vivenciar emoções negativas com frequência, incluindo ansiedade, tristeza e irritabilidade. Pode ser mais sensível ao estresse.",
    },
  },
  E: {
    namePt: "Extroversão",
    color: "#F39C12",
    icon: "☀️",
    descriptions: {
      low: "Prefere ambientes calmos e atividades solitárias. Tende a ser reservado e a precisar de tempo sozinho para recarregar energias.",
      average:
        "Aprecia tanto a companhia dos outros como momentos de solidão. Consegue se adaptar a situações sociais variadas com facilidade.",
      high: "É energético, sociável e expressivo. Gosta de estar rodeado de pessoas e tende a ser o centro das atenções em grupo.",
    },
  },
  O: {
    namePt: "Abertura à Experiência",
    color: "#9B59B6",
    icon: "🎨",
    descriptions: {
      low: "Prefere rotinas e o familiar. Tende a ser prático, convencional e focado no concreto.",
      average:
        "Mantém um equilíbrio entre a tradição e a novidade. Aprecia algumas experiências novas mas também valoriza a estabilidade.",
      high: "É curioso, criativo e aberto a novas ideias e experiências. Tem uma imaginação rica e aprecia a arte, a beleza e a diversidade.",
    },
  },
  A: {
    namePt: "Amabilidade",
    color: "#2ECC71",
    icon: "🤝",
    descriptions: {
      low: "Tende a ser mais competitivo e cético. Prioriza seus próprios interesses e pode ser mais direto em suas opiniões.",
      average:
        "Geralmente é cooperativo e atencioso, mas sabe defender seus interesses quando necessário. Equilibra empatia com assertividade.",
      high: "É compassivo, cooperativo e preocupado com o bem-estar dos outros. Tende a confiar nas pessoas e a evitar conflitos.",
    },
  },
  C: {
    namePt: "Conscienciosidade",
    color: "#3498DB",
    icon: "🎯",
    descriptions: {
      low: "Tende a ser mais flexível e espontâneo. Pode preferir improvisar a seguir planos rígidos e ser menos focado em detalhes.",
      average:
        "Mantém um nível razoável de organização e disciplina. Consegue cumprir objetivos mas também sabe relaxar quando necessário.",
      high: "É organizado, disciplinado e orientado para objetivos. Planeja com cuidado, é confiável e persiste até concluir suas tarefas.",
    },
  },
};

export const FACET_TRANSLATIONS: Record<string, string> = {
  Anxiety: "Ansiedade",
  Anger: "Raiva",
  Depression: "Depressão",
  "Self-Consciousness": "Autoconsciência",
  Immoderation: "Imoderação",
  Vulnerability: "Vulnerabilidade",
  Friendliness: "Amigabilidade",
  Gregariousness: "Gregarismo",
  Assertiveness: "Assertividade",
  "Activity Level": "Nível de Atividade",
  "Excitement-Seeking": "Busca de Emoções",
  Cheerfulness: "Alegria",
  Imagination: "Imaginação",
  "Artistic Interests": "Interesses Artísticos",
  Emotionality: "Emotividade",
  Adventurousness: "Aventureirismo",
  Intellect: "Intelecto",
  Liberalism: "Liberalismo",
  Trust: "Confiança",
  Morality: "Moralidade",
  Altruism: "Altruísmo",
  Cooperation: "Cooperação",
  Modesty: "Modéstia",
  Sympathy: "Compaixão",
  "Self-Efficacy": "Autoeficácia",
  Orderliness: "Organização",
  Dutifulness: "Senso de Dever",
  "Achievement-Striving": "Busca de Realização",
  "Self-Discipline": "Autodisciplina",
  Cautiousness: "Cautela",
};

export const DOMAIN_ORDER: DomainCode[] = ["O", "C", "E", "A", "N"];
