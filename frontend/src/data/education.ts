import type { EducationItem } from "../types/portfolio";

export const education: (EducationItem & { id: string })[] = [
  {
    id: "puc",
    institution: "PUC Minas",
    course: "Engenharia de Software",
    period: "2024 — em andamento",
    details: [],
  },
  {
    id: "cotemig",
    institution: "COTEMIG",
    course: "Formação Técnica em Tecnologia da Informação",
    period: "Concluído",
    details: [],
  },
];
