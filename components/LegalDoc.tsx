import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COMPANY, LEGAL_EFFECTIVE_DATE } from "@/lib/company";
import { LEGAL_DOCS, type LegalDocId } from "@/lib/legalContent";
import { pickTr3, type Lang } from "@/lib/locales";
import styles from "./LegalDoc.module.css";

const LABELS = {
  effective: { cs: "Účinné od", en: "Effective from", sk: "Účinné od", uk: "Чинні від" } as const,
  controller: { cs: "Správce", en: "Controller", sk: "Prevádzkovateľ", uk: "Розпорядник" } as const,
  legalForm: { cs: "Právní forma", en: "Legal form", sk: "Právna forma", uk: "Правова форма" } as const,
  ico: { cs: "IČO", en: "Company ID (IČO)", sk: "IČO", uk: "IČO" } as const,
  seat: { cs: "Sídlo", en: "Registered office", sk: "Sídlo", uk: "Юридична адреса" } as const,
  email: { cs: "E-mail", en: "E-mail", sk: "E-mail", uk: "E-mail" } as const,
  home: { cs: "Domů", en: "Home", sk: "Domov", uk: "Головна" } as const,
  priority: {
    cs: "",
    en: "In case of any discrepancy, the Czech version of this document prevails.",
    sk: "V prípade akéhokoľvek rozporu má prednosť česká verzia tohto dokumentu.",
    uk: "У разі будь-яких розбіжностей переважає чеська версія цього документа.",
  } as const,
};

function formatDate(iso: string, lang: Lang): string {
  try {
    const locale = lang === "cs" ? "cs-CZ" : lang === "sk" ? "sk-SK" : lang === "uk" ? "uk-UA" : "en-GB";
    return new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function LegalDoc({ docId, lang }: { docId: LegalDocId; lang: Lang }) {
  const doc = LEGAL_DOCS[docId];
  const p = (tr: { cs: string; en: string; sk: string; uk: string }) => pickTr3(tr, lang);

  return (
    <div className={styles.page}>
      <Header base="/" noForm />
      <main className={styles.main}>
        <article className={styles.doc}>
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <Link href={`/${lang}`}>{p(LABELS.home)}</Link>
            <span aria-hidden="true">/</span>
            <span>{p(doc.title)}</span>
          </nav>

          <h1 className={styles.h1}>{p(doc.title)}</h1>
          <p className={styles.effective}>
            {p(LABELS.effective)} {formatDate(LEGAL_EFFECTIVE_DATE, lang)}
          </p>
          {lang !== "cs" && <p className={styles.priority}>{p(LABELS.priority)}</p>}

          <p className={styles.intro}>{p(doc.intro)}</p>

          {doc.blocks.map((block, i) => {
            switch (block.type) {
              case "h2":
                return (
                  <h2 key={i} className={styles.h2}>
                    {p(block.text)}
                  </h2>
                );
              case "p":
                return (
                  <p key={i} className={styles.p}>
                    {p(block.text)}
                  </p>
                );
              case "note":
                return (
                  <p key={i} className={styles.note}>
                    {p(block.text)}
                  </p>
                );
              case "ul":
                return (
                  <ul key={i} className={styles.ul}>
                    {block.items.map((item, j) => (
                      <li key={j}>{p(item)}</li>
                    ))}
                  </ul>
                );
              case "identity":
                return (
                  <dl key={i} className={styles.identity}>
                    <div>
                      <dt>{p(LABELS.controller)}</dt>
                      <dd>{COMPANY.name}</dd>
                    </div>
                    <div>
                      <dt>{p(LABELS.legalForm)}</dt>
                      <dd>{COMPANY.legalForm}</dd>
                    </div>
                    <div>
                      <dt>{p(LABELS.ico)}</dt>
                      <dd>{COMPANY.ico}</dd>
                    </div>
                    <div>
                      <dt>{p(LABELS.seat)}</dt>
                      <dd>{COMPANY.address}</dd>
                    </div>
                    <div>
                      <dt>{p(LABELS.email)}</dt>
                      <dd>
                        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                      </dd>
                    </div>
                  </dl>
                );
              case "table":
                return (
                  <div key={i} className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          {block.head.map((h, j) => (
                            <th key={j}>{p(h)}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, r) => (
                          <tr key={r}>
                            {row.map((cell, c) => (
                              <td key={c}>{p(cell)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              default:
                return null;
            }
          })}
        </article>
      </main>
      <Footer base="/" noForm />
    </div>
  );
}
