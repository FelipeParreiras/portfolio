import { useMemo } from "react";
import SectionTitle from "../components/UI/SectionTitle";
import { skillGroups } from "../data/skills";
import { useI18n } from "../i18n/I18nProvider";
import styles from "../styles/Skills.module.css";

type SlotProps = {
  name: string;
  rarity?: "common" | "rare" | "epic";
};

function SkillSlot({ name, rarity = "common" }: SlotProps) {
  const short =
    name.length <= 3
      ? name.toUpperCase()
      : name
          .split(/[\s\-_/]+/)
          .map((p) => p[0])
          .join("")
          .slice(0, 3)
          .toUpperCase();

  return (
    <button
      type="button"
      className={`${styles.invSlot} ${styles[rarity] ?? ""}`}
      title={name}
      aria-label={name}
    >
      <span className={styles.invSlotShort}>{short}</span>
      <span className={styles.invSlotName}>{name}</span>
    </button>
  );
}

function InventorySection({
  title,
  items,
  slotsLabel,
}: {
  title: string;
  items: string[];
  slotsLabel: string;
}) {
  const getRarity = (i: number): SlotProps["rarity"] => {
    if (i % 11 === 0) return "epic";
    if (i % 5 === 0) return "rare";
    return "common";
  };

  return (
    <section className={styles.invPanel}>
      <div className={styles.invPanelTop}>
        <div className={styles.invPanelTitle}>
          <span className={styles.invLed} aria-hidden="true" />
          {title}
        </div>
        <div className={styles.invPanelCount}>{slotsLabel}</div>
      </div>

      <div className={styles.invGrid} role="list">
        {items.map((name, idx) => (
          <div key={name} role="listitem">
            <SkillSlot name={name} rarity={getRarity(idx)} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Skills() {
  const { lang, t, ta } = useI18n();

  const groups = useMemo(
    () =>
      skillGroups.map((group) => ({
        ...group,
        items: ta(`skills.items.${group.id}`),
      })),
    [lang, ta]
  );

  const tech = groups.find((g) => g.id === "tech");
  const tools = groups.find((g) => g.id === "tools");
  const soft = groups.find((g) => g.id === "soft");

  return (
    <div className="page">
      <SectionTitle title={t("home.skillsTitle")} subtitle={t("home.skillsSubtitle")} />

      <div className={styles.invShell}>
        <InventorySection
          title={t("skills.groups.tech")}
          items={tech?.items ?? []}
          slotsLabel={t("skills.slots", { count: tech?.items.length ?? 0 })}
        />

        <InventorySection
          title={t("skills.groups.tools")}
          items={tools?.items ?? []}
          slotsLabel={t("skills.slots", { count: tools?.items.length ?? 0 })}
        />

        <InventorySection
          title={t("skills.groups.soft")}
          items={soft?.items ?? []}
          slotsLabel={t("skills.slots", { count: soft?.items.length ?? 0 })}
        />
      </div>
    </div>
  );
}
