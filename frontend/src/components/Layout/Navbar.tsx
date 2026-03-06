import { useEffect, useMemo, useState } from "react";
import { profile } from "../../data/profile";
import { useI18n } from "../../i18n/I18nProvider";
import "../../styles/Navbar.css";

type NavItem = { id: string; label: string };

export default function Navbar() {
  const { lang, toggleLang, t } = useI18n();

  const items: NavItem[] = useMemo(
    () => [
      { id: "inicio", label: t("nav.home") },
      { id: "sobre", label: t("nav.about") },
      { id: "experiencias", label: t("nav.experience") },
      { id: "projetos", label: t("nav.projects") },
      { id: "competencias", label: t("nav.skills") },
      // se você tiver contato no fim:
      // { id: "contato", label: t("nav.contact") },
    ],
    [t, lang]
  );

  const [activeId, setActiveId] = useState<string>("inicio");

  // progresso de 0..100
  const progress = useMemo(() => {
    const idx = Math.max(0, items.findIndex((i) => i.id === activeId));
    const denom = Math.max(1, items.length - 1);
    return Math.round((idx / denom) * 100);
  }, [activeId, items]);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        // pega a mais “dominante” na viewport
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));

        const id = visible[0]?.target?.id;
        if (id) setActiveId(id);
      },
      {
        root: null,
        rootMargin: "-84px 0px -55% 0px",
        threshold: [0.12, 0.2, 0.28, 0.35, 0.5, 0.65],
      }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [items]);

  return (
    <header className="nav-matrix">
      {/* barra de progresso HUD */}
      <div className="nav-progress" aria-hidden="true">
        <div className="nav-progress-track">
          <div className="nav-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="nav-progress-label">
          {progress}% <span className="nav-progress-dot" />
        </div>
      </div>

      <nav className="nav-matrix-inner">
        <a className="nav-matrix-brand" href="#inicio" aria-label="Ir para início">
          <span className="nav-matrix-dot" aria-hidden="true" />
          <strong className="nav-matrix-name">{profile.name}</strong>
          <span className="nav-matrix-badge">PORTFOLIO</span>
        </a>

        <div className="nav-matrix-links">
          {items.map((i) => (
            <a
              key={i.id}
              href={`#${i.id}`}
              className={activeId === i.id ? "nav-matrix-link active" : "nav-matrix-link"}
            >
              <span className="nav-matrix-link-prefix" aria-hidden="true">
                {activeId === i.id ? "> " : "$ "}
              </span>
              {i.label}
            </a>
          ))}
        </div>

        <div className="nav-matrix-right">
          <button
            type="button"
            className="nav-matrix-link nav-matrix-btn"
            onClick={toggleLang}
            aria-label={t("nav.langToggle")}
            title={t("nav.langToggle")}
          >
            {t("nav.langToggle")} • {lang.toUpperCase()}
          </button>

          <a className="nav-matrix-cta" href="#contato">
            {t("nav.contact")}
          </a>
        </div>
      </nav>
    </header>
  );
}