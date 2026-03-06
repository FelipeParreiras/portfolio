import { useEffect, useMemo, useState } from "react";
import SectionTitle from "../components/UI/SectionTitle";
import ExperienceCard from "../components/UI/ExperienceCard";
import { experience } from "../data/experience";
import { useI18n } from "../i18n/I18nProvider";
import styles from "../styles/Experience.module.css";

export default function Experience() {
  const { lang, t, ta } = useI18n();

  const items = useMemo(
    () =>
      experience.map((item) => ({
        ...item,
        role: t(`experience.items.${item.id}.role`),
        period: t(`experience.items.${item.id}.period`),
        badge: t(`experience.items.${item.id}.badge`),
        bullets: ta(`experience.items.${item.id}.bullets`),
      })),
    [lang, t, ta]
  );

  const [selected, setSelected] = useState(0);

  const clampIndex = (i: number) => {
    if (items.length === 0) return 0;
    return ((i % items.length) + items.length) % items.length;
  };

  const prev = () => setSelected((s) => clampIndex(s - 1));
  const next = () => setSelected((s) => clampIndex(s + 1));

  const leftIndex = clampIndex(selected - 1);
  const rightIndex = clampIndex(selected + 1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.closest?.("#experiencias")) return;

      if (Math.abs(e.deltaY) > 6) {
        e.preventDefault();
        e.deltaY > 0 ? next() : prev();
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel as EventListener);
    };
  }, [items.length]);

  useEffect(() => {
    setSelected((current) => clampIndex(current));
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="page">
        <SectionTitle title={t("home.experienceTitle")} subtitle={t("home.experienceSubtitle")} />
        <div className="card">{t("experience.empty")}</div>
      </div>
    );
  }

  return (
    <div className="page" id="experiencias">
      <SectionTitle title={t("home.experienceTitle")} subtitle={t("home.experienceSubtitle")} />

      <div className={styles.xpSelect}>
        <div className={styles.xpSelectTop}>
          <div className={styles.xpSelectTitle}>
            <span className={styles.xpScanDot} aria-hidden="true" />
            {t("experience.selectTitle")}
          </div>

          <div className={styles.xpSelectHint}>{t("experience.selectHint")}</div>
        </div>

        <div className={styles.xpSelectStage} aria-label={t("experience.carouselAriaLabel")}>
          <button className={`${styles.xpNav} ${styles.xpLeft}`} onClick={prev} aria-label={t("experience.previous")}>
            ‹
          </button>

          <div className={styles.xpCards}>
            <div className={`${styles.xpCardSlot} ${styles.left}`} onClick={prev} role="button" tabIndex={0}>
              <ExperienceCard item={items[leftIndex]} index={leftIndex} />
            </div>

            <div className={`${styles.xpCardSlot} ${styles.center}`} aria-label={t("experience.selected")}>
              <ExperienceCard item={items[selected]} index={selected} />
            </div>

            <div className={`${styles.xpCardSlot} ${styles.right}`} onClick={next} role="button" tabIndex={0}>
              <ExperienceCard item={items[rightIndex]} index={rightIndex} />
            </div>
          </div>

          <button className={`${styles.xpNav} ${styles.xpRight}`} onClick={next} aria-label={t("experience.next")}>
            ›
          </button>
        </div>

        <div className={styles.xpDots} aria-hidden="true">
          {items.map((_, i) => (
            <span key={i} className={`${styles.xpDot} ${i === selected ? styles.active : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
