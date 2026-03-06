import { useMemo, useState } from "react";
import SectionTitle from "../components/UI/SectionTitle";
import { profile } from "../data/profile";
import { useI18n } from "../i18n/I18nProvider";
import styles from "../styles/Contact.module.css";

type FormState = {
  name: string;
  email: string;
  message: string;
};

function buildMailto(params: {
  to: string;
  subject: string;
  body: string;
}) {
  const subject = encodeURIComponent(params.subject);
  const body = encodeURIComponent(params.body);
  return `mailto:${params.to}?subject=${subject}&body=${body}`;
}

export default function Contact() {
  const { t } = useI18n();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });

  const mailtoForm = useMemo(() => {
    const subject = t("contact.subject");
    const body =
      `Nome: ${form.name}\n` +
      `Email: ${form.email}\n\n` +
      `Mensagem:\n${form.message}`;

    return buildMailto({
      to: profile.links.email,
      subject,
      body,
    });
  }, [form, t]);

  const mailtoEmail = useMemo(() => {
    return buildMailto({
      to: profile.links.email,
      subject: t("contact.subject"),
      body: t("contact.bodyEmail", { email: profile.links.email }),
    });
  }, [t]);

  const mailtoLinkedin = useMemo(() => {
    return buildMailto({
      to: profile.links.email,
      subject: t("contact.subjectLinkedin"),
      body: t("contact.bodyLinkedin", { url: profile.links.linkedin }),
    });
  }, [t]);

  const mailtoGithub = useMemo(() => {
    return buildMailto({
      to: profile.links.email,
      subject: t("contact.subjectGithub"),
      body: t("contact.bodyGithub", { url: profile.links.github }),
    });
  }, [t]);

  return (
    <div className="page">
      <SectionTitle title={t("contact.title")} subtitle={t("contact.subtitle")} />

      <div className={styles.contactGrid}>
        <div className={styles.channelPanel}>
          <div className={styles.panelTop}>
            <div className={styles.panelTitle}>
              <span className={styles.panelLed} aria-hidden="true" />
              COMMUNICATION CHANNELS
            </div>
            <div className={styles.panelMeta}>3 links</div>
          </div>

          <div className={styles.panelBody}>
            <a className={styles.channelItem} href={mailtoEmail}>
              <div className={styles.channelIcon} aria-hidden="true">
                ✉
              </div>
              <div className={styles.channelContent}>
                <div className={styles.channelLabel}>{t("contact.labels.email")}</div>
                <div className={styles.channelValue}>{profile.links.email}</div>
              </div>
            </a>

            <a className={styles.channelItem} href={mailtoLinkedin}>
              <div className={styles.channelIcon} aria-hidden="true">
                in
              </div>
              <div className={styles.channelContent}>
                <div className={styles.channelLabel}>{t("contact.labels.linkedin")}</div>
                <div className={styles.channelValue}>{profile.links.linkedin}</div>
              </div>
            </a>

            <a className={styles.channelItem} href={mailtoGithub}>
              <div className={styles.channelIcon} aria-hidden="true">
                GH
              </div>
              <div className={styles.channelContent}>
                <div className={styles.channelLabel}>{t("contact.labels.github")}</div>
                <div className={styles.channelValue}>{profile.links.github}</div>
              </div>
            </a>
          </div>
        </div>

        <div className={styles.formPanel}>
          <div className={styles.panelTop}>
            <div className={styles.panelTitle}>
              <span className={styles.panelLed} aria-hidden="true" />
              SEND TRANSMISSION
            </div>
            <div className={styles.panelMeta}>secure line</div>
          </div>

          <div className={styles.panelBody}>
            <h2 className={styles.formTitle}>{t("contact.sendMessage")}</h2>

            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>{t("contact.yourName")}</span>
                <input
                  className={styles.fieldInput}
                  value={form.name}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, name: e.target.value }))
                  }
                  placeholder={t("contact.placeholderName")}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>{t("contact.yourEmail")}</span>
                <input
                  className={styles.fieldInput}
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, email: e.target.value }))
                  }
                  placeholder={t("contact.placeholderEmail")}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>{t("contact.yourMessage")}</span>
                <textarea
                  className={styles.fieldTextarea}
                  value={form.message}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, message: e.target.value }))
                  }
                  placeholder={t("contact.placeholderMessage")}
                  rows={6}
                />
              </label>

              <div className={styles.formActions}>
                <a className={styles.sendButton} href={mailtoForm}>
                  {t("contact.send")}
                </a>
              </div>

              <p className={styles.note}>{t("contact.note")}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}