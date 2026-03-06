import { useI18n } from "../../i18n/I18nProvider";
import type { ExperienceItem } from "../../types/portfolio";
import styles from "../../styles/ExperienceCard.module.css";

type Props = {
  item: ExperienceItem;
  index?: number;
};

export default function ExperienceCard({ item, index = 0 }: Props) {
  const { t } = useI18n();
  const { company, role, period, badge, bullets } = item;

  return (
    <div className={styles.expCard}>
      <div className={styles.expCardHead}>
        <div className={styles.expCardIndex}>0{index + 1}</div>

        <div className={styles.expCardMain}>
          <div className={styles.expCardCompany}>{company}</div>
          <div className={styles.expCardRole}>{role}</div>

          <div className={styles.expCardMeta}>
            {period && <div className={styles.expCardPeriod}>{period}</div>}
            {badge && <div className={styles.expCardBadge}>{badge}</div>}
          </div>
        </div>
      </div>

      <div className={styles.expCardDivider} />

      <ul className={styles.expCardHighlights}>
        {bullets.length > 0 ? (
          bullets.map((bullet, i) => <li key={i}>{bullet}</li>)
        ) : (
          <li style={{ opacity: 0.7 }}>{t("experience.noAdditionalDetails")}</li>
        )}
      </ul>
    </div>
  );
}
