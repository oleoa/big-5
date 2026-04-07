import type { DomainCode } from "./types";

/**
 * Textos interpretativos para os 5 domínios do Big Five.
 * Chaves: low = Baixo (percentil < 30), average = Médio (30–70), high = Alto (> 70).
 */
export const DOMAIN_TEXTS: Record<DomainCode, { low: string; average: string; high: string }> = {
  N: {
    low:
      "Você demonstra uma estabilidade emocional notável. Situações de pressão e estresse raramente abalam o seu equilíbrio interno, e você costuma manter a calma mesmo diante de adversidades. Essa resiliência permite que tome decisões de forma mais racional e que transmita segurança às pessoas ao seu redor. Em geral, você lida com frustrações de maneira construtiva, sem se deixar dominar por emoções negativas.",
    average:
      "Seu nível de reatividade emocional situa-se dentro da faixa típica da população. Você experimenta emoções negativas como ansiedade, tristeza ou irritação de vez em quando, mas na maioria das vezes consegue gerenciá-las de forma adequada. Em situações de grande pressão, pode sentir desconforto, porém tende a recuperar-se com relativa facilidade. Esse equilíbrio permite que você seja sensível ao ambiente sem perder o controle.",
    high:
      "Você tende a vivenciar emoções negativas com mais intensidade e frequência do que a maioria das pessoas. Sentimentos como ansiedade, preocupação, tristeza e irritação podem surgir com facilidade, mesmo em situações que outros consideram rotineiras. Essa sensibilidade emocional pode ser desafiadora, mas também indica uma grande capacidade de perceber nuances emocionais no ambiente. Estratégias de regulação emocional e autocuidado podem ser especialmente benéficas para você.",
  },
  E: {
    low:
      "Você tem um perfil mais introvertido, preferindo ambientes calmos e interações em grupos pequenos ou individuais. Atividades solitárias como leitura, reflexão ou trabalho focado costumam energizá-lo mais do que eventos sociais movimentados. Isso não significa timidez — você simplesmente recarrega suas energias no silêncio. Em contextos profissionais, tende a ser um ouvinte atento e um pensador profundo.",
    average:
      "Você transita confortavelmente entre momentos sociais e momentos de solidão. Aprecia a companhia de outras pessoas, mas também valoriza seu espaço pessoal. Em situações sociais, consegue se envolver e participar ativamente, sem sentir a necessidade constante de ser o centro das atenções. Esse equilíbrio permite que se adapte a diferentes contextos com naturalidade.",
    high:
      "Você é uma pessoa naturalmente sociável, expressiva e cheia de energia. Interações com outras pessoas o estimulam e revigoram, e você frequentemente busca novas conexões sociais. Tende a ser comunicativo, entusiasmado e, em grupos, costuma assumir um papel de destaque. Sua energia contagiante pode inspirar os outros, embora seja importante também reservar momentos para introspecção e descanso.",
  },
  O: {
    low:
      "Você valoriza a praticidade, a tradição e o que é comprovado pela experiência. Prefere rotinas estabelecidas e abordagens convencionais em vez de experimentar o desconhecido. Ideias abstratas ou artísticas podem parecer menos relevantes no seu dia a dia. Essa orientação prática é um ponto forte em ambientes que exigem consistência, disciplina e atenção ao concreto.",
    average:
      "Você mantém um equilíbrio saudável entre curiosidade e pragmatismo. Está aberto a novas ideias e experiências quando elas fazem sentido, mas não busca novidade apenas por buscar. Aprecia tanto a estabilidade das rotinas quanto momentos de criatividade e exploração. Essa flexibilidade permite que se adapte a diferentes situações mantendo os pés no chão.",
    high:
      "Você possui uma mente curiosa, criativa e aberta a novas possibilidades. Ideias inovadoras, expressões artísticas e experiências incomuns atraem naturalmente a sua atenção. Tende a pensar de forma original e a questionar o convencional, buscando constantemente expandir seus horizontes. Essa abertura é uma grande força em ambientes que valorizam inovação e pensamento criativo.",
  },
  A: {
    low:
      "Você tende a ser mais direto, competitivo e focado nos seus próprios objetivos. Não hesita em expressar discordância e pode ser cético em relação às intenções alheias. Essa postura assertiva pode ser vantajosa em negociações, liderança e situações que exigem decisões firmes. No entanto, vale cultivar a empatia para fortalecer relacionamentos interpessoais de longo prazo.",
    average:
      "Você equilibra cooperação com assertividade de forma natural. Geralmente é atencioso e disposto a ajudar, mas sabe defender seus interesses quando necessário. Confia nas pessoas de forma moderada e consegue trabalhar bem em equipe sem abrir mão da sua opinião. Esse equilíbrio é valioso tanto em contextos profissionais quanto pessoais.",
    high:
      "Você é uma pessoa compassiva, cooperativa e genuinamente preocupada com o bem-estar dos outros. Tende a confiar nas pessoas, a evitar conflitos e a buscar harmonia nas relações. Sua empatia natural facilita o trabalho em equipe e a construção de laços profundos. É importante, porém, garantir que essa generosidade não comprometa suas próprias necessidades e limites.",
  },
  C: {
    low:
      "Você tende a ser mais flexível, espontâneo e adaptável, preferindo improvisar a seguir planos rígidos. Detalhes minuciosos e rotinas muito estruturadas podem parecer sufocantes. Essa flexibilidade é um trunfo em ambientes criativos e situações imprevisíveis. Contudo, em contextos que exigem organização e cumprimento de prazos, pode ser útil desenvolver estratégias de planejamento mais consistentes.",
    average:
      "Você mantém um nível equilibrado de organização e disciplina. Consegue cumprir objetivos e metas, mas sem rigidez excessiva. Sabe planejar quando necessário e relaxar quando possível. Esse equilíbrio permite que seja produtivo sem se sobrecarregar, adaptando-se às demandas de cada situação com flexibilidade.",
    high:
      "Você é altamente organizado, disciplinado e orientado para resultados. Planeja com cuidado, estabelece metas claras e persiste até concluir suas tarefas. É visto como confiável e metódico, características que são muito valorizadas profissionalmente. Atenção apenas para não se cobrar em excesso ou ter dificuldade em lidar com imprevistos que fogem ao planejado.",
  },
};

/**
 * Textos interpretativos para as 30 facetas do IPIP-NEO-120.
 * Chaves em inglês (matching FacetResult.facet do scoring.ts).
 */
export const FACET_TEXTS: Record<string, { low: string; average: string; high: string }> = {
  // ── Neuroticismo (N) ──
  Anxiety: {
    low: "Você raramente se sente ansioso ou preocupado. Enfrenta situações incertas com calma e confiança.",
    average: "Você experimenta ansiedade em níveis moderados, típicos da maioria das pessoas. Preocupa-se em situações relevantes, mas consegue controlar.",
    high: "Você tende a sentir ansiedade com frequência, preocupando-se com possíveis problemas mesmo antes de eles acontecerem.",
  },
  Anger: {
    low: "Você é dificilmente provocado e raramente sente raiva. Mantém a compostura mesmo em situações frustrantes.",
    average: "Você sente irritação ocasionalmente, mas geralmente consegue expressá-la de forma controlada e adequada.",
    high: "Você tende a sentir raiva e frustração com mais facilidade. Situações injustas ou frustrantes podem gerar reações emocionais intensas.",
  },
  Depression: {
    low: "Você raramente se sente triste ou desanimado. Mantém uma perspectiva geralmente positiva sobre a vida.",
    average: "Você experimenta momentos de tristeza ocasionalmente, como é natural, mas eles não costumam persistir por longos períodos.",
    high: "Você tende a vivenciar sentimentos de tristeza, desânimo ou vazio com mais frequência. Pode ser útil buscar apoio emocional e atividades que promovam bem-estar.",
  },
  "Self-Consciousness": {
    low: "Você se sente à vontade em situações sociais e raramente se preocupa com o julgamento dos outros.",
    average: "Você sente algum desconforto em certas situações sociais, mas geralmente consegue lidar bem com a exposição.",
    high: "Você tende a se sentir constrangido ou inseguro em situações sociais, preocupando-se com o que os outros pensam de você.",
  },
  Immoderation: {
    low: "Você tem forte autocontrole sobre impulsos e desejos. Resiste facilmente a tentações.",
    average: "Você consegue controlar seus impulsos na maioria das vezes, cedendo a tentações apenas ocasionalmente.",
    high: "Você pode ter dificuldade em resistir a impulsos e desejos imediatos, mesmo quando sabe que as consequências podem ser negativas.",
  },
  Vulnerability: {
    low: "Você lida bem com pressão e estresse, mantendo a clareza mental mesmo em situações difíceis.",
    average: "Você geralmente lida com estresse de forma adequada, mas situações de grande pressão podem causar algum desconforto.",
    high: "Situações de forte pressão ou estresse podem sobrecarregá-lo, dificultando a tomada de decisões e o pensamento claro.",
  },

  // ── Extroversão (E) ──
  Friendliness: {
    low: "Você tende a ser mais reservado e seletivo nas suas amizades, preferindo manter um círculo social pequeno e íntimo.",
    average: "Você é amigável e acolhedor com as pessoas, mantendo um equilíbrio entre abertura e reserva.",
    high: "Você é caloroso, afetuoso e faz amizade com facilidade. As pessoas se sentem naturalmente acolhidas na sua presença.",
  },
  Gregariousness: {
    low: "Você prefere a própria companhia ou de poucas pessoas. Multidões e grandes eventos sociais tendem a drenar sua energia.",
    average: "Você aprecia a companhia dos outros em doses moderadas, alternando entre socialização e momentos a sós.",
    high: "Você adora estar rodeado de pessoas e busca ativamente a companhia dos outros. Eventos sociais o energizam.",
  },
  Assertiveness: {
    low: "Você tende a ouvir mais do que falar e prefere que outros tomem a liderança em grupos.",
    average: "Você consegue se posicionar quando necessário, embora nem sempre busque liderar ou dominar conversas.",
    high: "Você é assertivo e não hesita em expressar suas opiniões, tomar a liderança e influenciar o rumo das situações.",
  },
  "Activity Level": {
    low: "Você prefere um ritmo de vida mais calmo e relaxado, sem pressa ou excesso de atividades.",
    average: "Você mantém um nível de atividade equilibrado, alternando entre períodos de ação e de descanso.",
    high: "Você é uma pessoa muito ativa, sempre em movimento e envolvida em múltiplas atividades. A inatividade o incomoda.",
  },
  "Excitement-Seeking": {
    low: "Você prefere ambientes previsíveis e atividades tranquilas. Não sente necessidade de adrenalina ou estímulos intensos.",
    average: "Você aprecia alguma novidade e excitação, mas sem necessidade de experiências extremas.",
    high: "Você busca emoções fortes e experiências estimulantes. Rotinas monótonas podem entediá-lo rapidamente.",
  },
  Cheerfulness: {
    low: "Você tende a ser mais sóbrio e contido nas suas expressões emocionais, sem grandes demonstrações de entusiasmo.",
    average: "Você experimenta alegria e entusiasmo em níveis moderados, expressando-se de forma equilibrada.",
    high: "Você é naturalmente alegre, otimista e entusiasmado. Sua positividade tende a contagiar as pessoas ao seu redor.",
  },

  // ── Abertura à Experiência (O) ──
  Imagination: {
    low: "Você é mais focado nos fatos concretos e na realidade prática do que em fantasias ou cenários hipotéticos.",
    average: "Você usa a imaginação quando necessário, mas mantém os pés no chão na maior parte do tempo.",
    high: "Você tem uma imaginação rica e vívida. Frequentemente cria cenários mentais, histórias e ideias criativas.",
  },
  "Artistic Interests": {
    low: "Você tem pouco interesse por atividades artísticas ou estéticas, preferindo o funcional ao decorativo.",
    average: "Você aprecia a arte e a beleza de forma moderada, sem que isso seja um foco central na sua vida.",
    high: "Você é profundamente sensível à beleza e às artes. Música, literatura, pintura ou outras formas de expressão artística tocam-no profundamente.",
  },
  Emotionality: {
    low: "Você tende a ser mais racional e contido emocionalmente, processando sentimentos de forma lógica.",
    average: "Você está em contato com suas emoções de forma equilibrada, sem ser excessivamente racional ou emocional.",
    high: "Você é muito atento às suas emoções e às dos outros. Sente as coisas com profundidade e intensidade.",
  },
  Adventurousness: {
    low: "Você prefere o familiar e o previsível, sentindo-se mais confortável com rotinas e ambientes conhecidos.",
    average: "Você está aberto a novas experiências de vez em quando, mas não busca mudança constantemente.",
    high: "Você adora experimentar coisas novas — lugares, comidas, atividades, ideias. A rotina o entedia.",
  },
  Intellect: {
    low: "Você prefere questões práticas e concretas, sem grande interesse em debates intelectuais ou teóricos.",
    average: "Você aprecia discussões intelectuais quando o tema lhe interessa, mas não busca isso ativamente.",
    high: "Você é intelectualmente curioso e adora explorar ideias complexas, debater conceitos e resolver problemas desafiadores.",
  },
  Liberalism: {
    low: "Você tende a valorizar tradições, normas estabelecidas e abordagens convencionais.",
    average: "Você equilibra respeito pelas tradições com abertura a mudanças quando elas fazem sentido.",
    high: "Você questiona ativamente a autoridade, tradições e convenções, preferindo formar suas próprias opiniões independentes.",
  },

  // ── Amabilidade (A) ──
  Trust: {
    low: "Você tende a ser cauteloso e cético em relação às intenções dos outros, preferindo verificar antes de confiar.",
    average: "Você confia nas pessoas de forma moderada, dando o benefício da dúvida mas mantendo alguma cautela.",
    high: "Você acredita naturalmente na boa-fé das pessoas e tende a confiar nos outros com facilidade.",
  },
  Morality: {
    low: "Você é mais pragmático nas interações sociais e pode usar a diplomacia estrategicamente para alcançar objetivos.",
    average: "Você é geralmente sincero e direto, mas sabe quando a diplomacia é necessária.",
    high: "Você é muito franco, sincero e transparente. Acredita que honestidade é sempre a melhor política.",
  },
  Altruism: {
    low: "Você prioriza suas próprias necessidades e pode achar que cada um deve resolver seus próprios problemas.",
    average: "Você ajuda os outros quando pode, mas sem se sacrificar excessivamente.",
    high: "Você sente genuína satisfação em ajudar os outros e frequentemente coloca as necessidades alheias antes das suas.",
  },
  Cooperation: {
    low: "Você não hesita em confrontar e discordar, preferindo defender firmemente a sua posição.",
    average: "Você busca compromissos e soluções que funcionem para todos, mas sabe se posicionar quando necessário.",
    high: "Você evita conflitos e está sempre disposto a ceder para manter a harmonia nos relacionamentos.",
  },
  Modesty: {
    low: "Você se sente confortável em destacar suas conquistas e qualidades. Tem confiança no seu valor.",
    average: "Você reconhece seus méritos sem ostentação, mantendo um equilíbrio entre humildade e autoconfiança.",
    high: "Você é humilde e tende a minimizar suas conquistas, preferindo não ser o centro das atenções.",
  },
  Sympathy: {
    low: "Você tende a ser mais objetivo e racional, evitando que emoções alheias influenciem suas decisões.",
    average: "Você se sensibiliza com o sofrimento dos outros, mas mantém uma perspectiva equilibrada.",
    high: "Você é profundamente empático e se comove facilmente com o sofrimento alheio. A compaixão é um traço marcante do seu caráter.",
  },

  // ── Conscienciosidade (C) ──
  "Self-Efficacy": {
    low: "Você pode duvidar das suas capacidades para realizar tarefas complexas ou enfrentar desafios.",
    average: "Você confia nas suas habilidades de forma moderada e geralmente se sente capaz de lidar com as demandas do dia a dia.",
    high: "Você tem forte confiança na sua capacidade de realizar o que se propõe. Acredita que consegue superar obstáculos com competência.",
  },
  Orderliness: {
    low: "Você tende a ser mais desorganizado e flexível com espaços e rotinas, priorizando a espontaneidade.",
    average: "Você mantém um nível razoável de organização, sem ser excessivamente metódico.",
    high: "Você é meticulosamente organizado. Cada coisa tem o seu lugar e você valoriza ordem e estrutura no ambiente.",
  },
  Dutifulness: {
    low: "Você pode ver regras e obrigações como flexíveis, priorizando sua autonomia sobre o cumprimento estrito de normas.",
    average: "Você cumpre suas obrigações de forma consciente, mas sem rigidez excessiva.",
    high: "Você leva muito a sério seus compromissos e obrigações. É visto como uma pessoa extremamente confiável e responsável.",
  },
  "Achievement-Striving": {
    low: "Você não sente grande necessidade de alcançar metas ambiciosas, preferindo um ritmo de vida mais tranquilo.",
    average: "Você persegue seus objetivos com dedicação moderada, equilibrando ambição com satisfação pessoal.",
    high: "Você é altamente motivado e orientado para resultados. Estabelece metas ambiciosas e trabalha incansavelmente para alcançá-las.",
  },
  "Self-Discipline": {
    low: "Você pode ter dificuldade em manter o foco em tarefas que não são imediatamente estimulantes, tendendo à procrastinação.",
    average: "Você geralmente consegue manter a disciplina para concluir tarefas, embora ocasionalmente procrastine.",
    high: "Você tem excelente autodisciplina. Consegue manter o foco e concluir tarefas mesmo quando não são agradáveis ou motivantes.",
  },
  Cautiousness: {
    low: "Você tende a agir impulsivamente, tomando decisões rápidas sem ponderar excessivamente as consequências.",
    average: "Você pondera suas decisões de forma adequada, equilibrando reflexão com ação.",
    high: "Você pensa cuidadosamente antes de agir, considerando todas as opções e possíveis consequências. Raramente toma decisões precipitadas.",
  },
};
