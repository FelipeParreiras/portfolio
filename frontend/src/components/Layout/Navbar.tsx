import { useEffect, useMemo, useState } from "react";
import { profile } from "../../data/profile";
import { useI18n } from "../../i18n/I18nProvider";
import styles from "../../styles/Navbar.module.css";

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
    ],
    [t, lang]
  );

  const [activeId, setActiveId] = useState<string>("inicio");
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 960) setMenuOpen(false);
    };

    const closeOnEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("resize", closeOnResize);
    window.addEventListener("keydown", closeOnEsc);

    return () => {
      window.removeEventListener("resize", closeOnResize);
      window.removeEventListener("keydown", closeOnEsc);
    };
  }, []);

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className={styles.navMatrix}>
      <div className={styles.navProgress} aria-hidden="true">
        <div className={styles.navProgressTrack}>
          <div className={styles.navProgressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.navProgressLabel}>
          {progress}% <span className={styles.navProgressDot} />
        </div>
      </div>

      <nav className={styles.navMatrixInner}>
        <a className={styles.navMatrixBrand} href="#inicio" aria-label="Ir para início">
          <span className={styles.navMatrixDot} aria-hidden="true" />
          <strong className={styles.navMatrixName}>{profile.name}</strong>
          <span className={styles.navMatrixBadge}>PORTFOLIO</span>
        </a>

        <div className={styles.navMatrixLinks}>
          {items.map((i) => {
            const isActive = activeId === i.id;
            return (
              <a
                key={i.id}
                href={`#${i.id}`}
                className={`${styles.navMatrixLink} ${isActive ? styles.active : ""}`}
              >
                <span className={styles.navMatrixLinkPrefix} aria-hidden="true">
                  {isActive ? "> " : "$ "}
                </span>
                {i.label}
              </a>
            );
          })}
        </div>

        <div className={styles.navMatrixRight}>
          <button
            type="button"
            className={`${styles.navMatrixLink} ${styles.navMatrixBtn}`}
            onClick={toggleLang}
            aria-label={t("nav.langToggle")}
            title={t("nav.langToggle")}
          >
            {t("nav.langToggle")} • {lang.toUpperCase()}
          </button>

          <a className={styles.navMatrixCta} href="#contato">
            {t("nav.contact")}
          </a>
        </div>

        <button
          type="button"
          className={styles.mobileMenuButton}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className={styles.mobileMenuLine} />
          <span className={styles.mobileMenuLine} />
          <span className={styles.mobileMenuLine} />
        </button>
      </nav>

      <div className={`${styles.mobileDropdown} ${menuOpen ? styles.mobileDropdownOpen : ""}`}>
        <div className={styles.mobileDropdownInner}>
          {items.map((i) => {
            const isActive = activeId === i.id;
            return (
              <a
                key={i.id}
                href={`#${i.id}`}
                onClick={handleNavClick}
                className={`${styles.mobileNavLink} ${isActive ? styles.active : ""}`}
              >
                <span className={styles.navMatrixLinkPrefix} aria-hidden="true">
                  {isActive ? "> " : "$ "}
                </span>
                {i.label}
              </a>
            );
          })}

          <button
            type="button"
            className={`${styles.mobileNavLink} ${styles.mobileActionButton}`}
            onClick={() => {
              toggleLang();
              setMenuOpen(false);
            }}
          >
            {t("nav.langToggle")} • {lang.toUpperCase()}
          </button>

          <a
            className={`${styles.mobileNavLink} ${styles.mobileContactLink}`}
            href="#contato"
            onClick={handleNavClick}
          >
            {t("nav.contact")}
          </a>
        </div>
      </div>
    </header>
  );
}