import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "../data/profile";
import { useI18n } from "../i18n/I18nProvider";
import styles from "../styles/About.module.css";

type Line = { text: string; speed?: number; pauseAfter?: number };

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export default function About() {
  const { lang, t, ta } = useI18n();

  const script: Line[] = useMemo(() => {
    const fileName = lang === "en" ? "about_me.txt" : profile.about.fileName;
    const lines = ta("profile.aboutTerminal.lines");

    return [
      { text: "C:\\Users\\visitor> whoami", speed: 14, pauseAfter: 180 },
      { text: profile.name, speed: 10, pauseAfter: 220 },
      { text: "", pauseAfter: 120 },
      { text: `C:\\Users\\visitor> type ${fileName}`, speed: 14, pauseAfter: 240 },
      ...lines.map((line) => ({
        text: line,
        speed: 11,
        pauseAfter: 120,
      })),
      { text: "", pauseAfter: 120 },
      { text: "C:\\Users\\visitor> _", speed: 18, pauseAfter: 0 },
    ];
  }, [lang, ta]);

  const [typed, setTyped] = useState("");
  const activeRunId = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const runId = ++activeRunId.current;

    const runTyping = async () => {
      setTyped("");
      let out = "";

      for (const line of script) {
        if (cancelled || activeRunId.current !== runId) return;

        if (!line.text) {
          out += "\n";
          setTyped(out);
          await sleep(line.pauseAfter ?? 0);
          continue;
        }

        for (let i = 0; i < line.text.length; i++) {
          if (cancelled || activeRunId.current !== runId) return;
          out += line.text[i];
          setTyped(out);
          await sleep(line.speed ?? 12);
        }

        out += "\n";
        setTyped(out);
        await sleep(line.pauseAfter ?? 0);
      }
    };

    const skip = () => {
      cancelled = true;
      setTyped(script.map((line) => line.text).join("\n") + "\n");
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") skip();
    };

    const onClick = () => skip();

    runTyping();
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);

    return () => {
      cancelled = true;
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [script]);

  return (
    <div className="stack">
      <div className="section-title">
        <h1>{t("profile.aboutTitle")}</h1>
      </div>

      <div className={styles.aboutTerminal}>
        <div className={styles.aboutTerminalTop}>
          <span className={styles.aboutDot} />
          <span className={styles.aboutTerminalTitle}>{t("profile.aboutTerminal.title")}</span>
          <span className={styles.aboutTerminalHint}>{t("profile.aboutTerminal.hint")}</span>
        </div>

        <pre className={styles.aboutTerminalBody}>
          {typed}
          <span className={styles.aboutCursor} />
        </pre>
      </div>
    </div>
  );
}
