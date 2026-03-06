import type { ExperienceItem } from "../types/portfolio";

export const experience: (ExperienceItem & { id: string })[] = [
  {
    id: "datte",
    company: "Datte Tecnologias Avançadas em Gestão",
    role: "Desenvolvedor de Software Júnior",
    period: "Fev 2026 — Atual",
    badge: "Full Stack",
    bullets: [],
  },
  {
    id: "confianza",
    company: "Confianza Consultoria",
    role: "Desenvolvedor Full Stack Júnior",
    period: "Jul 2025 — Jan 2026",
    badge: "Back-end / Automação",
    bullets: [],
  },
  {
    id: "axis",
    company: "Axis Mobfintech",
    role: "Estagiário de Desenvolvimento",
    period: "Jul 2022 — Dez 2022",
    badge: "Estágio",
    bullets: [],
  },
];
