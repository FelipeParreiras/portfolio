import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "../../data/profile";
import { useI18n } from "../../i18n/I18nProvider";
import styles from "../../styles/RareProfessionalIntro.module.css";

type Props = {
  onFinish: () => void;
};

type Phase = "scan" | "scanDone" | "dramaticFade" | "prompt" | "fadeOut" | "loading";

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function RareProfessionalIntro({ onFinish }: Props) {
  const { lang, t } = useI18n();
  const [phase, setPhase] = useState<Phase>("scan");
  const [scanProgress, setScanProgress] = useState(0);
  const [typed, setTyped] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  const finished = useRef(false);
  const activeRunId = useRef(0);

  const promptLines = useMemo(
    () => [
      t("intro.prompt.found"),
      t("intro.prompt.name", { name: profile.name }),
      t("intro.prompt.type", { role: lang === "en" ? "Full Stack Developer" : "Desenvolvedor Full Stack" }),
      t("intro.prompt.level"),
      t("intro.prompt.rarity"),
    ],
    [lang, t]
  );

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setIsExiting(true);
    window.setTimeout(() => {
      onFinish();
    }, 900);
  };

  useEffect(() => {
    let cancelled = false;
    const runId = ++activeRunId.current;

    const skip = () => {
      if (finished.current) return;
      cancelled = true;
      setPhase("fadeOut");
      window.setTimeout(() => finish(), 220);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") skip();
    };

    const onClick = () => skip();

    async function run() {
      setPhase("scan");
      setScanProgress(0);
      setTyped("");

      const scanStart = Date.now();
      const scanDuration = 1600;

      while (!cancelled && activeRunId.current === runId) {
        const elapsed = Date.now() - scanStart;
        const progress = Math.min(100, (elapsed / scanDuration) * 100);
        setScanProgress(progress);
        if (progress >= 100) break;
        await sleep(16);
      }
      if (cancelled || activeRunId.current !== runId) return;

      setPhase("scanDone");
      await sleep(1100);
      if (cancelled || activeRunId.current !== runId) return;

      setPhase("dramaticFade");
      await sleep(520);
      if (cancelled || activeRunId.current !== runId) return;

      setPhase("prompt");
      await typePrompt(promptLines, setTyped, () => cancelled || activeRunId.current !== runId);
      if (cancelled || activeRunId.current !== runId) return;

      setPhase("fadeOut");
      await sleep(520);
      if (cancelled || activeRunId.current !== runId) return;

      setPhase("loading");
      await sleep(650);
      if (cancelled || activeRunId.current !== runId) return;

      finish();
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    run();

    return () => {
      cancelled = true;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [promptLines]);

  return (
    <div
      className={[
        styles.rpOverlay,
        phase === "dramaticFade" ? styles.rpPhaseDramaticFade : "",
        isExiting ? styles.rpExit : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="dialog"
      aria-label={t("intro.ariaLabel")}
    >
      {(phase === "scan" || phase === "scanDone" || phase === "dramaticFade") && (
        <div className={styles.rpCard}>
          <div className={styles.rpTitle}>{t("intro.scanTitle")}</div>

          <div className={styles.rpScanBar} aria-label={t("intro.scanBarAriaLabel")}>
            <div className={styles.rpScanFill} style={{ width: `${scanProgress}%` }} />
            <div className={styles.rpScanShine} />
          </div>

          <div className={styles.rpHint}>{t("intro.skipHint")}</div>

          {phase === "scanDone" && <div className={styles.rpDoneBlink}>{t("intro.scanDone")}</div>}

          {phase === "dramaticFade" && (
            <div className={styles.rpDoneBlink}>{t("intro.startingAnalysis")}</div>
          )}
        </div>
      )}

      {(phase === "prompt" || phase === "fadeOut" || phase === "loading") && (
        <div className={styles.rpTerminalWrap}>
          <div className={styles.rpTerminalTop}>
            <span className={`${styles.rpDot} ${styles.red}`} />
            <span className={`${styles.rpDot} ${styles.yellow}`} />
            <span className={`${styles.rpDot} ${styles.green}`} />
            <span className={styles.rpTerminalTitle}>{t("profile.aboutTerminal.title")}</span>
          </div>

          <pre
            className={`${styles.rpTerminalBody} ${phase === "fadeOut" ? styles.rpFadeOut : ""}`}
            dangerouslySetInnerHTML={{
              __html:
                escapeHtml(typed) +
                (phase === "prompt" ? `<span class="${styles.rpCursor}"></span>` : ""),
            }}
          />

          {phase === "loading" && <div className={styles.rpLoading}>{t("intro.loading")}</div>}
        </div>
      )}
    </div>
  );
}

async function typePrompt(
  lines: string[],
  setTyped: (v: string) => void,
  shouldStop: () => boolean
) {
  let out = "";
  const prefix = "C:\\> ";

  for (let i = 0; i < lines.length; i++) {
    if (shouldStop()) return;

    if (i === 0) {
      const head = prefix + lines[i];
      for (let c = 0; c < head.length; c++) {
        if (shouldStop()) return;
        out += head[c];
        setTyped(out);
        await sleep(14);
      }
      out += "\n";
      setTyped(out);
      await sleep(240);
      continue;
    }

    const line = lines[i];
    for (let c = 0; c < line.length; c++) {
      if (shouldStop()) return;
      out += line[c];
      setTyped(out);
      await sleep(12);
    }
    out += "\n";
    setTyped(out);
    await sleep(180);
  }
}
