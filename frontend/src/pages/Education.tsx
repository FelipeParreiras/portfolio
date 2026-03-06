import { useMemo } from "react";
import SectionTitle from "../components/UI/SectionTitle";
import { education } from "../data/education";
import { useI18n } from "../i18n/I18nProvider";
import styles from "../styles/Education.module.css";

export default function Education() {
  const { lang, t, ta } = useI18n();

  const items = useMemo(
    () =>
      education.map((item) => ({
        ...item,
        course: t(`education.items.${item.id}.course`),
        period: t(`education.items.${item.id}.period`),
        details: ta(`education.items.${item.id}.details`),
      })),
    [lang, t, ta]
  );

  return (
    <div className="page">
      <SectionTitle title={t("home.educationTitle")} subtitle={t("home.educationSubtitle")} />

      <div className={styles.eduTerminal}>
        <div className={styles.eduTerminalTop}>
          <span className={styles.eduDot} />
          <span className={styles.eduTitle}>{t("education.terminalTitle")}</span>
        </div>

        <div className={styles.eduTerminalBody}>
          {items.map((e) => (
            <div key={`${e.institution}-${e.course}`} className={styles.eduLog}>
              <div className={styles.eduLogHead}>
                <span className={styles.eduTime}>{e.period}</span>
                <span className={styles.eduArrow}>{">>"}</span>
                <span className={styles.eduInst}>{e.institution}</span>
              </div>

              <div className={styles.eduCourse}>{e.course}</div>

              {e.details?.length ? (
                <ul className={styles.eduDetails}>
                  {e.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}

          <div className={styles.eduCursor} />
        </div>
      </div>
    </div>
  );
}
