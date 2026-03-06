import { useI18n } from "../i18n/I18nProvider";
import SectionTitle from "../components/UI/SectionTitle";
import { projects } from "../data/projects";
import styles from "../styles/Projects.module.css";

export default function Projects() {
  const { t } = useI18n();

  return (
    <div className={styles.page}>
      <SectionTitle title={t("home.projectsTitle")} subtitle={t("home.projectsSubtitle")} />

      <div className={styles.projectArchiveGrid}>
        {projects.map((project, index) => {
          const name = t(`projects.items.${project.slug}.name`);
          const description = t(`projects.items.${project.slug}.description`);

          return (
            <article key={project.slug} className={styles.projectArchiveCard}>
              <div className={styles.projectArchiveThumb}>
                {project.image ? (
                  <img src={project.image} alt={name} />
                ) : (
                  <div className={styles.projectArchiveFallback}>{t("projects.noPreview")}</div>
                )}

                <span className={styles.projectArchiveBadge}>
                  {t("projects.fileLabel", { number: String(index + 1).padStart(2, "0") })}
                </span>
              </div>

              <div className={styles.projectArchiveBody}>
                <h3>{name}</h3>
                <p>{description}</p>

                <div className={styles.projectArchiveTags}>
                  {project.stack?.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <div className={styles.projectArchiveActions}>
                  {project.links.repo && (
                    <a
                      href={project.links.repo}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.projectArchiveAction}
                    >
                      {t("projects.openRepository")}
                    </a>
                  )}

                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noreferrer"
                      className={`${styles.projectArchiveAction} ${styles.projectArchiveActionSecondary}`}
                    >
                      {t("projects.openDemo")}
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
