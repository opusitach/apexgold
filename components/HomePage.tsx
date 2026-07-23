"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLang } from "@/lib/i18n";
import { getLeadMeta } from "@/lib/leadMeta";
import { COMPANY } from "@/lib/company";
import { useReveal } from "@/lib/useReveal";
import styles from "./HomePage.module.css";

const ArrowIcon = ({ color = "#fff" }: { color?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const StarIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#E8B53D">
    <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 18.6 5.9 20.8l1.2-6.6L2.3 9.6l6.6-.9z" />
  </svg>
);

interface PriceItem {
  no?: string;
  name: string;
  price: string;
  unit: string;
  href?: string;
}
interface PriceGroup {
  label?: string;
  items: PriceItem[];
}
interface ServiceCat {
  n: string;
  anchor: string;
  href?: string;
  title: string;
  subtitle: string;
  img: string;
  /** Describes the photo itself — the card title already carries the service name. */
  imgAlt: string;
  cta: string;
  groups: PriceGroup[];
}

type FormErrors = Partial<Record<
  "company" | "name" | "phone" | "email" | "city" | "objectType" | "address" | "consent",
  string
>>;

interface FormState {
  company: string;
  name: string;
  phone: string;
  email: string;
  service: string[];
  area: string;
  city: string;
  objectType: string;
  address: string;
  visitDate: string;
  comment: string;
  consent: boolean;
}

const emptyForm: FormState = {
  company: "",
  name: "",
  phone: "",
  email: "",
  service: [],
  area: "",
  city: "",
  objectType: "",
  address: "",
  visitDate: "",
  comment: "",
  consent: false,
};

const SERVICE_OPTIONS = [
  "Úklid po stavbě",
  "Mytí oken",
  "Mytí koberců",
  "čištění čalounění",
  "Strojové čištění",
  "voskování podlah",
  "Čištění garáží",
  "úklid hal",
  "Mytí fasád",
  "Hrubé broušení + leštění",
  "Přebroušení + leštění",
  "Leštění",
  "Mytí + impregnace",
  "Mytí + impregnace",
  "Broušení + leštění",
  "Mytí + impregnace",
  "Broušení + voskování",
];

export default function HomePage() {
  const { t, lang } = useLang();
  const rootRef = useReveal<HTMLDivElement>();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderPct, setSliderPct] = useState(50);
  const [marqPaused, setMarqPaused] = useState(false);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"form" | "loading" | "success">("form");
  const [submitError, setSubmitError] = useState("");
  const [touched, setTouched] = useState<Partial<Record<keyof FormErrors, boolean>>>({});

  const [serviceIdx, setServiceIdx] = useState<number[]>([]);
  const [serviceOpen, setServiceOpen] = useState(false);
  const serviceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (serviceRef.current && !serviceRef.current.contains(e.target as Node)) {
        setServiceOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function toggleService(i: number) {
    setServiceIdx((prev) => {
      const next = prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i];
      setForm((f) => ({ ...f, service: next.map((idx) => SERVICE_OPTIONS[idx]) }));
      return next;
    });
  }

  const set = useCallback(
    <K extends keyof FormState>(key: K) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
        setForm((f) => ({ ...f, [key]: value as FormState[K] }));
      },
    []
  );

  const setDigitsOnly = useCallback(
    (key: "phone" | "area") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, "");
      setForm((f) => ({ ...f, [key]: digits }));
    },
    []
  );

  const markTouched = useCallback(
    (key: keyof FormErrors) => () => setTouched((t) => ({ ...t, [key]: true })),
    []
  );

  function startSlider(clientX: number) {
    function move(x: number) {
      const rect = sliderRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pct = Math.max(4, Math.min(96, ((x - rect.left) / rect.width) * 100));
      setSliderPct(pct);
    }
    function onMouseMove(e: MouseEvent) {
      move(e.clientX);
    }
    function onTouchMove(e: TouchEvent) {
      if (e.touches[0]) move(e.touches[0].clientX);
    }
    function up() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", up);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", up);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", up);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", up);
    move(clientX);
  }

  function validate(): FormErrors {
    const req = t("Povinné pole", "Required", "Povinné pole", "Обов’язкове поле");
    const er: FormErrors = {};
    if (!form.company.trim()) er.company = req;
    if (!form.name.trim()) er.name = req;
    if (!form.city.trim()) er.city = req;
    if (!form.objectType.trim()) er.objectType = req;
    if (!form.address.trim()) er.address = req;
    if (!form.phone.trim()) er.phone = t("Zadejte telefon", "Enter phone", "Zadajte telefón", "Вкажіть телефон");
    else if (form.phone.replace(/[^0-9]/g, "").length < 9)
      er.phone = t("Zkontrolujte číslo", "Check number", "Skontrolujte číslo", "Перевірте номер");
    if (!form.email.trim()) er.email = t("Zadejte e-mail", "Enter e-mail", "Zadajte e-mail", "Вкажіть e-mail");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      er.email = t("Neplatný e-mail", "Invalid e-mail", "Neplatný e-mail", "Некоректний e-mail");
    return er;
  }

  const errors = validate();

  async function saveLead(rec: Record<string, unknown>): Promise<boolean> {
    // Send the application to the server (stored in SQLite, shown in /admin).
    // Marketing/technical metadata is attached only when cookies are accepted.
    // Returns true only when the server actually accepted the lead.
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rec, lang, meta: getLeadMeta() }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  function onSubmit() {
    setStatus("loading");
    setSubmitError("");
    // Keep the spinner up for a short minimum so the transition to the success
    // screen stays smooth even when the server responds almost instantly.
    const minLoading = new Promise((r) => setTimeout(r, 800));
    // Spread into a fresh literal: `FormState` is an interface and so has no
    // index signature of its own to satisfy `saveLead`'s Record parameter.
    Promise.all([saveLead({ ...form }), minLoading]).then(([ok]) => {
      if (ok) {
        setStatus("success");
      } else {
        // Keep the filled form so the visitor can simply retry.
        setStatus("form");
        setSubmitError(t(
          "Nepodařilo se odeslat. Zkuste to prosím znovu nebo nám zavolejte.",
          "Could not send. Please try again or call us.",
          "Nepodarilo sa odoslať. Skúste to prosím znova alebo nám zavolajte.",
          "Не вдалося надіслати. Спробуйте ще раз або зателефонуйте нам."
        ));
      }
    });
  }

  function reset() {
    setStatus("form");
    setForm(emptyForm);
    setServiceIdx([]);
    setTouched({});
  }

  const U_kus = t("/kus", "/pc", "/ks", "/шт");
  const odLabel = t("od", "from", "od", "від");

  const serviceCats: ServiceCat[] = [
    {
      n: "01",
      anchor: "general",
      href: "/generalni-uklid",
      title: t("Generální úklid", "General cleaning", "Generálne upratovanie", "Генеральне прибирання"),
      subtitle: t(
        "Komplexní péče o komerční objekty, jednorázově i pravidelně.",
        "Complete care for commercial sites, one-off or scheduled.",
        "Komplexná starostlivosť o komerčné objekty, jednorazovo aj pravidelne.",
        "Комплексний догляд за комерційними об’єктами, разово або за графіком."
      ),
      img: "/images/services/generalni-uklid.jpg",
      imgAlt: t(
        "Uklizená kancelář po generálním úklidu",
        "A tidy office after a deep clean",
        "Upratovaná kancelária po generálnom upratovaní",
        "Прибраний офіс після генерального прибирання"
      ),
      cta: t("Objednat úklid", "Order cleaning", "Objednať upratovanie", "Замовити прибирання"),
      groups: [
        {
          items: [
            { name: t("Úklid po stavbě", "Post-construction cleaning", "Upratovanie po stavbe", "Прибирання після будівництва"), price: "55 Kč", unit: "/m²", href: "/uklid-po-stavbe" },
            { name: t("Mytí oken", "Window cleaning", "Umývanie okien", "Миття вікон"), price: "18 Kč", unit: "/m²", href: "/myti-oken" },
            { name: t("Mytí koberců", "Carpet cleaning", "Čistenie kobercov", "Чищення килимів"), price: "18 Kč", unit: "/m²", href: "/cisteni-koberce-calouneni" },
            { name: t("Čištění čalounění", "Upholstery cleaning", "Čistenie čalúnenia", "Чищення оббивки"), price: "400 Kč", unit: U_kus, href: "/cisteni-koberce-calouneni" },
            { name: t("Strojové čištění podlah", "Machine floor cleaning", "Strojové čistenie podláh", "Машинне чищення підлог"), price: "35 Kč", unit: "/m²", href: "/cisteni-a-voskovani-podlah" },
            { name: t("Voskování podlah", "Floor waxing", "Voskovanie podláh", "Воскування підлог"), price: "70 Kč", unit: "/m²", href: "/cisteni-a-voskovani-podlah" },
            { name: t("Čištění garáží", "Garage cleaning", "Čistenie garáží", "Прибирання гаражів"), price: "9 Kč", unit: "/m²", href: "/uklid-garazi-a-hal" },
            { name: t("Úklid hal", "Warehouse & hall cleaning", "Upratovanie hál", "Прибирання цехів і складів"), price: "55 Kč", unit: "/m²", href: "/uklid-garazi-a-hal" },
            { name: t("Mytí fasád", "Facade washing", "Umývanie fasád", "Миття фасадів"), price: "70 Kč", unit: "/m²", href: "/myti-fasad" },
          ],
        },
      ],
    },
    {
      n: "02",
      anchor: "stone",
      href: "/renovace-mramoru",
      title: t("Renovace kamene", "Stone renovation", "Renovácia kameňa", "Регенерація каменю"),
      subtitle: t(
        "Renovace a ochrana kamenných povrchů bez výměny.",
        "Restoration and protection of stone surfaces without replacement.",
        "Renovácia a ochrana kamenných povrchov bez výmeny.",
        "Відновлення та захист кам’яних поверхонь без заміни покриття."
      ),
      img: "/images/stone-renovation-floor.jpg",
      imgAlt: t(
        "Vyleštěná mramorová podlaha po renovaci",
        "Polished marble floor after restoration",
        "Vyleštená mramorová podlaha po renovácii",
        "Відполірована мармурова підлога після реставрації"
      ),
      cta: t("Získat konzultaci", "Get a consultation", "Získať konzultáciu", "Отримати консультацію"),
      groups: [
        {
          label: t("Renovace mramoru", "Marble renovation", "Renovácia mramoru", "Регенерація мармуру"),
          items: [
            { no: "1", name: t("Hrubé broušení + leštění", "Coarse grinding + polishing", "Hrubé brúsenie + leštenie", "Груба шліфовка + полірування"), price: "1300 Kč", unit: "/m²", href: "/renovace-mramoru" },
            { no: "2", name: t("Přebroušení + leštění", "Re-grinding + polishing", "Prebrúsenie + leštenie", "Перешліфовка + полірування"), price: "800 Kč", unit: "/m²", href: "/renovace-mramoru" },
            { no: "3", name: t("Leštění", "Polishing", "Leštenie", "Полірування"), price: "350 Kč", unit: "/m²", href: "/renovace-mramoru" },
            { no: "4", name: t("Mytí + impregnace", "Washing + impregnation", "Umývanie + impregnácia", "Миття + імпрегнація"), price: "180 Kč", unit: "/m²", href: "/renovace-mramoru" },
          ],
        },
        {
          label: t("Renovace žuly", "Granite renovation", "Renovácia žuly", "Регенерація граніту"),
          items: [
            { no: "1", name: t("Mytí + impregnace", "Washing + impregnation", "Umývanie + impregnácia", "Миття + імпрегнація"), price: "250 Kč", unit: "/m²", href: "/renovace-zuly" },
            { no: "2", name: t("Broušení + leštění", "Grinding + polishing", "Brúsenie + leštenie", "Шліфовка + полірування"), price: "1650 Kč", unit: "/m²", href: "/renovace-zuly" },
          ],
        },
        {
          label: t("Renovace terasy", "Terrace renovation", "Renovácia terasy", "Регенерація тераси"),
          items: [
            { no: "1", name: t("Mytí + impregnace", "Washing + impregnation", "Umývanie + impregnácia", "Миття + імпрегнація"), price: "320 Kč", unit: "/m²", href: "/renovace-terasy" },
            { no: "2", name: t("Broušení + voskování", "Grinding + waxing", "Brúsenie + voskovanie", "Шліфовка + воскування"), price: "430 Kč", unit: "/m²", href: "/renovace-terasy" },
          ],
        },
      ],
    },
  ];

  const stats = [
    { num: "10+", label: t("let zkušeností", "years of experience", "rokov skúseností", "років досвіду") },
    { num: "500+", label: t("dokončených zakázek", "projects completed", "dokončených zákaziek", "виконаних об’єктів") },
    { num: "98%", label: t("klientů se vrací", "clients return", "klientov sa vracia", "клієнтів повертаються") },
    { num: "24/7", label: t("dostupnost týmu", "team availability", "dostupnosť tímu", "доступність команди") },
  ];

  const steps = [
    { n: "01", title: t("Poptávka", "Request", "Dopyt", "Заявка"), text: t("Zašlete poptávku. Zaznamenáme úkol a naplánujeme prohlídku.", "Submit a request. We log the task and schedule a survey.", "Zašlite dopyt. Zaznamenáme úlohu a naplánujeme obhliadku.", "Залиште заявку. Зафіксуємо завдання і призначимо огляд.") },
    { n: "02", title: t("Prohlídka a kalkulace", "Survey & estimate", "Obhliadka a kalkulácia", "Огляд і кошторис"), text: t("Posoudíme rozsah a připravíme transparentní kalkulaci.", "We assess scope and prepare a transparent estimate.", "Posúdime rozsah a pripravíme transparentnú kalkuláciu.", "Оцінимо обсяг і підготуємо прозорий кошторис.") },
    { n: "03", title: t("Dohoda", "Agreement", "Dohoda", "Погодження"), text: t("Potvrdíme plán, tým a vhodný termín.", "We confirm the plan, crew and a convenient date.", "Potvrdíme plán, tím a vhodný termín.", "Затвердимо план, бригаду і зручну дату.") },
    { n: "04", title: t("Předání", "Handover", "Odovzdanie", "Здача об’єкта"), text: t("Provedeme práce, zkontrolujeme výsledek, zašleme fotoreport.", "We complete the work, verify the result, send a photo report.", "Vykonáme práce, skontrolujeme výsledok, zašleme fotoreport.", "Виконаємо роботи, перевіримо результат, надішлемо фотозвіт.") },
  ];

  const reviewsBase = [
    {
      ini: "L.N.",
      name: "Lucie Nováková",
      role: t("Správkyně OC Mercury", "Manager, Mercury Tower", "Správkyňa OC Mercury", "Керуюча БЦ «Меркурій»"),
      text: t(
        "Přešli jsme na ApexGold pro noční úklid. Stabilní kvalita, fotoreport po každé směně a vstřícný manažer.",
        "We switched to ApexGold for night cleaning. Consistent quality, a photo report after every shift and a responsive manager, exactly what a business centre needs.",
        "Prešli sme na ApexGold pre nočné upratovanie. Stabilná kvalita, fotoreport po každej zmene a ústretový manažér.",
        "Перейшли на ApexGold для нічного прибирання. Стабільна якість, фотозвіт після кожної зміни і адекватний менеджер."
      ),
    },
    {
      ini: "T.H.",
      name: "Tomáš Horák",
      role: t("Provozní ředitel, retail síť", "Operations Director, retail chain", "Prevádzkový riaditeľ, retailová sieť", "Операційний директор, retail-мережа"),
      text: t(
        "Renovovali žulu ve třech obchodech. Podlahy vypadají jako nové a výměna by stála několikrát více.",
        "They restored granite in three stores. Floors look brand new, and replacement would have cost several times more. They worked at night, so trading never stopped.",
        "Renovovali žulu v troch predajniach. Podlahy vyzerajú ako nové a výmena by stála niekoľkonásobne viac.",
        "Регенерували граніт у трьох магазинах. Підлоги виглядають як нові, а заміна обійшлася б у рази дорожче."
      ),
    },
    {
      ini: "M.K.",
      name: "Martina Kovářová",
      role: t("Manažerka restaurace", "Restaurant manager", "Manažérka reštaurácie", "Керуюча рестораном"),
      text: t(
        "Generální úklid před otevřením za jednu noc. Čistě, precizně, bez stop na vybavení. Profesionální a dochvilný tým.",
        "A full deep clean before opening in one night. Spotless, careful, no marks on equipment. A professional and punctual team.",
        "Generálne upratovanie pred otvorením za jednu noc. Čisto, precízne, bez stôp na vybavení. Profesionálny a dochvíľny tím.",
        "Генеральне прибирання перед відкриттям за одну ніч. Чисто, акуратно, без слідів на обладнанні. Команда професійна і пунктуальна."
      ),
    },
  ];
  const reviewsDouble = [...reviewsBase, ...reviewsBase];

  const isSuccess = status === "success";
  const isLoading = status === "loading";
  const hasErrors = Object.keys(errors).length > 0;
  const showError = Object.keys(touched).some((k) => touched[k as keyof FormErrors] && errors[k as keyof FormErrors]);

  return (
    <div ref={rootRef}>
      <Header />

      <main>

      {/* HERO */}
      <section id="top" className={styles.hero}>
        <div className={`${styles.heroWrap} hero-wrap`}>
          <div className={styles.heroImg}>
            {/* The LCP element: loaded eagerly at high priority, never lazily. */}
            <Image
              src="/images/hero-team.jpg"
              alt={t(
                "Tým ApexGold při generálním úklidu kancelářských prostor v Praze",
                "The ApexGold team during a deep clean of offices in Prague",
                "Tím ApexGold pri generálnom upratovaní kancelárskych priestorov v Prahe",
                "Команда ApexGold під час генерального прибирання офісів у Празі"
              )}
              fill
              sizes="100vw"
              quality={80}
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className={`${styles.heroScrimLeft} hero-scrim-left`} />
          <div className={`${styles.heroScrimMob} hero-scrim-mob`} />
          <div className={`${styles.heroContent} hero-content-pad`}>
            <div className={styles.heroInner}>
              <h1 className={styles.heroTitle}>
                {t(
                  "Generální úklid a renovace kamenných podlah v Praze",
                  "Deep cleaning and stone floor restoration in Prague",
                  "Generálne upratovanie a renovácia kamenných podláh v Prahe",
                  "Генеральне прибирання та реставрація кам’яних підлог у Празі"
                )}
              </h1>
              <p className={styles.heroTagline}>
                {t(
                  "Čistota, která pracuje pro vaše podnikání.",
                  "Cleanliness that works for your business.",
                  "Čistota, ktorá pracuje pre vaše podnikanie.",
                  "Чистота, яка працює на ваш бізнес."
                )}
              </p>
              <p className={styles.heroSub}>
                {t(
                  "Profesionální generální úklid a renovace kamenných podlah pro kanceláře, obchodní centra, retail a HoReCa.",
                  "Professional deep cleaning and stone floor restoration for offices, business centres, retail and HoReCa.",
                  "Profesionálne generálne upratovanie a renovácia kamenných podláh pre kancelárie, obchodné centrá, retail a HoReCa.",
                  "Професійне генеральне прибирання та відновлення кам’яних підлог для офісів, бізнес-центрів, retail та HoReCa."
                )}
              </p>
              <div className={`${styles.heroBtns} hero-btns`}>
                <a href="#request" className="hero-zoom cta-primary">
                  {t("Získat nabídku", "Get a quote", "Získať ponuku", "Отримати розрахунок")}
                  <ArrowIcon />
                </a>
                <a href="#services" className="hero-zoom cta-ghost">
                  {t("Naše služby", "Our services", "Naše služby", "Наші послуги")}
                </a>
              </div>
              <div className={styles.heroTrust}>
                <span className={styles.dot} />
                <span className={styles.heroTrustText}>
                  <strong style={{ color: "#fff", fontWeight: 700 }}>500+</strong>{" "}
                  {t("dokončených zakázek", "projects completed", "dokončených zákaziek", "виконаних об’єктів")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="sec-sm" id="about" style={{ background: "#F4F8F5" }}>
        <div className="W">
          <div className={`stagger ${styles.sectionHead}`}>
            <span className="eyebrow">{t("Proč ApexGold", "Why ApexGold", "Prečo ApexGold", "Чому ApexGold")}</span>
            <h2>{t("Služba, na kterou se lze spolehnout", "A service you can rely on", "Služba, na ktorú sa dá spoľahnúť", "Сервіс, на який можна покластися")}</h2>
          </div>
          <div className="g4 stagger">
            {[
              {
                icon: <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4M10 10h4M10 14h4M10 18h4" />,
                title: t("Komerční objekty", "Commercial sites", "Komerčné objekty", "Комерційні об’єкти"),
                text: t("Kanceláře, OC, retail, HoReCa: známe specifika každého.", "Offices, BCs, retail, HoReCa: we know each format.", "Kancelárie, OC, retail, HoReCa: poznáme špecifiká každého.", "Офіси, БЦ, retail, HoReCa: знаємо специфіку кожного."),
              },
              {
                icon: <><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-5" /></>,
                title: t("Kontrola kvality", "Quality control", "Kontrola kvality", "Контроль якості"),
                text: t("Kontrolní seznamy, přejímka manažerem a fotoreport pro každý objekt.", "Checklists, manager sign-off and a photo report for every site.", "Kontrolné zoznamy, preberanie manažérom a fotoreport pre každý objekt.", "Чек-листи, прийомка менеджером і фотозвіт по кожному об’єкту."),
              },
              {
                icon: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
                title: t("Transparentní kalkulace", "Clear estimate", "Transparentná kalkulácia", "Прозорий кошторис"),
                text: t("Rozsah a cenu fixujeme předem. Bez skrytých příplatků.", "Fixed scope and price before we start. No hidden charges.", "Rozsah a cenu fixujeme vopred. Bez skrytých príplatkov.", "Фіксуємо обсяг і вартість до початку робіт. Без прихованих доплат."),
              },
              {
                icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
                title: t("Šetrnost k povrchům", "Care for finishes", "Šetrnosť k povrchom", "Дбайливе ставлення до оздоблення"),
                text: t("Bezpečná chemie a správná technologie pro každý materiál.", "Safe chemistry and the right method for each material.", "Bezpečná chémia a správna technológia pre každý materiál.", "Безпечна хімія і правильна технологія для кожного матеріалу."),
              },
            ].map((a, i) => (
              <div key={i} className={styles.advCard}>
                <span className={styles.advIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0E5540" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    {a.icon}
                  </svg>
                </span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
          <div className={styles.ctaRowEnd}>
            <a href="#request" className="cta-primary">
              {t("Získat nabídku", "Get a quote", "Získať ponuku", "Отримати розрахунок")}
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="sec" id="services" style={{ background: "#fff" }}>
        <div className="W">
          <div className={`stagger ${styles.sectionHead}`} style={{ marginBottom: 44 }}>
            <span className="eyebrow">{t("Služby", "Services", "Služby", "Послуги")}</span>
            <h2>{t("Co děláme", "What we do", "Čo robíme", "Що ми робимо")}</h2>
          </div>
          <div className="g2 stagger" id="general">
            {serviceCats.map((cat) => (
              <div key={cat.anchor} className={styles.serviceCard} id={cat.anchor}>
                <div className={styles.serviceCardHead}>
                  <Image src={cat.img} alt={cat.imgAlt} fill sizes="(max-width: 1000px) 100vw, 50vw" />
                  <div className={styles.serviceCardScrim} />
                  <div className={styles.serviceCardKicker}>
                    <span />
                    {cat.n}
                  </div>
                  <div className={styles.serviceCardTitleWrap}>
                    <h3>{cat.href ? <a href={`/${lang}${cat.href}`}>{cat.title}</a> : cat.title}</h3>
                    <p>{cat.subtitle}</p>
                  </div>
                </div>
                <div className={styles.priceList}>
                  {cat.groups.map((grp, gi) => (
                    <div key={gi} style={{ paddingTop: 6 }}>
                      {grp.label && (
                        <div className={styles.priceGroupLabel}>
                          <span />
                          <span className={styles.label}>{grp.label}</span>
                          <span className={styles.rule} />
                        </div>
                      )}
                      {grp.items.map((it, ii) =>
                        it.href ? (
                          <a key={ii} href={`/${lang}${it.href}`} className="price-row">
                            <span className={styles.priceItemName}>
                              {it.no && <span className={styles.priceItemNo}>{it.no}</span>}
                              <span className={styles.priceItemLabel}>{it.name}</span>
                            </span>
                            <span className={styles.priceValue}>
                              <span className={styles.priceOd}>{odLabel}</span>
                              <strong className={styles.priceAmount}>{it.price}</strong>
                              <span className={styles.priceUnit}>{it.unit}</span>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#25B373" strokeWidth="2.4" strokeLinecap="round" style={{ marginLeft: 4, flexShrink: 0 }}>
                                <path d="M9 6l6 6-6 6" />
                              </svg>
                            </span>
                          </a>
                        ) : (
                          <div key={ii} className="price-row">
                            <span className={styles.priceItemName}>
                              {it.no && <span className={styles.priceItemNo}>{it.no}</span>}
                              <span className={styles.priceItemLabel}>{it.name}</span>
                            </span>
                            <span className={styles.priceValue}>
                              <span className={styles.priceOd}>{odLabel}</span>
                              <strong className={styles.priceAmount}>{it.price}</strong>
                              <span className={styles.priceUnit}>{it.unit}</span>
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
                <div className={styles.serviceCardCta}>
                  <a href="#request">
                    {cat.cta}
                    <ArrowIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className={`stagger ${styles.priceNote}`}>
            {t(
              "Ceny jsou orientační, „od“. Přesnou kalkulaci připravíme zdarma po prohlídce objektu. Cena závisí na ploše, stavu povrchů a harmonogramu prací.",
              "Prices are indicative, “from”. We prepare an exact quote free of charge after an on-site survey. The cost depends on area, surface condition and schedule.",
              "Ceny sú orientačné, „od“. Presnú kalkuláciu pripravíme zdarma po obhliadke objektu. Cena závisí od plochy, stavu povrchov a harmonogramu prác.",
              "Ціни вказані орієнтовно, «від». Точний кошторис готуємо безкоштовно після огляду об’єкта. Вартість залежить від площі, стану поверхонь і графіка робіт."
            )}
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className={styles.statsBar}>
        <div className={styles.statsInner}>
          <div className="g4s stagger">
            {stats.map((s, i) => (
              <div key={i} className={styles.statCell}>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="sec" id="process" style={{ background: "#fff" }}>
        <div className="W">
          <div className={`stagger ${styles.sectionHead}`} style={{ marginBottom: 52 }}>
            <span className="eyebrow">{t("Postup", "Process", "Postup", "Процес")}</span>
            <h2>{t("Jak pracujeme", "How we work", "Ako pracujeme", "Як ми працюємо")}</h2>
          </div>
          <div className={styles.procWrap}>
            <div className={`proc-line-h ${styles.procLineH}`}>
              <svg width="100%" height="2" style={{ overflow: "visible", display: "block" }}>
                <line x1="0" y1="1" x2="100%" y2="1" stroke="#25B373" strokeWidth="1.5" strokeDasharray="6 5" strokeOpacity=".45" />
              </svg>
            </div>
            <div className={`proc-steps stagger ${styles.procSteps}`}>
              {steps.map((st) => (
                <div key={st.n} className={`proc-step ${styles.procStep}`}>
                  <div className={styles.procBadge}>{st.n}</div>
                  <h3>{st.title}</h3>
                  <p>{st.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.procFooter}>
            <p>
              {t(
                "Postup je jasný. Spusťte ho nyní. Manažer přijede na prohlídku v čas, který vám vyhovuje.",
                "The process is clear. Now start it. A manager will visit at a time that works for you.",
                "Postup je jasný. Spustite ho teraz. Manažér príde na obhliadku v čase, ktorý vám vyhovuje.",
                "Процес описаний. Тепер запустіть його. Менеджер приїде на огляд у зручний для вас час."
              )}
            </p>
            <a href="#request" className="cta-primary">
              {t("Získat nabídku", "Get a quote", "Získať ponuku", "Отримати розрахунок")}
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {/* CASE */}
      <section className="sec" style={{ background: "#F4F8F5" }}>
        <div className="W">
          <div className={`stagger ${styles.sectionHead}`}>
            <span className="eyebrow">{t("Případová studie", "Case study", "Prípadová štúdia", "Кейс")}</span>
            <h2>{t("Úklid kuchyně po rekonstrukci", "Kitchen renovation cleanup", "Upratovanie kuchyne po rekonštrukcii", "Прибирання кухні після ремонту")}</h2>
          </div>
          <div
            className={`stagger ${styles.caseSlider}`}
            ref={sliderRef}
            onMouseDown={(e) => {
              e.preventDefault();
              startSlider(e.clientX);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              startSlider(e.touches[0].clientX);
            }}
          >
            <Image
              src="/images/case-after.jpg"
              alt={t(
                "Kuchyně po generálním úklidu po rekonstrukci",
                "Kitchen after a post-renovation deep clean",
                "Kuchyňa po generálnom upratovaní po rekonštrukcii",
                "Кухня після генерального прибирання після ремонту"
              )}
              fill
              sizes="(max-width: 1000px) 100vw, 1100px"
            />
            <div className={styles.caseBeforeClip} style={{ clipPath: `inset(0 ${100 - sliderPct}% 0 0)` }}>
              <Image
                src="/images/case-before.jpg"
                alt={t(
                  "Kuchyně před úklidem, se stavebním prachem po rekonstrukci",
                  "Kitchen before cleaning, covered in construction dust",
                  "Kuchyňa pred upratovaním, so stavebným prachom po rekonštrukcii",
                  "Кухня до прибирання, з будівельним пилом після ремонту"
                )}
                fill
                sizes="(max-width: 1000px) 100vw, 1100px"
              />
            </div>
            <div className={styles.caseDivider} style={{ left: `${sliderPct}%` }}>
              <div className={styles.caseHandle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0E5540" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 4L4 12l5 8" />
                  <path d="M15 4l5 8-5 8" />
                </svg>
              </div>
            </div>
            <span className={styles.caseLabel} style={{ left: 16 }}>
              {t("Před", "Before", "Pred", "До")}
            </span>
            <span className={styles.caseLabelAfter}>{t("Po", "After", "Po", "Після")}</span>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="sec" id="reviews" style={{ background: "#F4F8F5" }}>
        <div className="W">
          <div className={`stagger ${styles.reviewsHead}`}>
            <span className="eyebrow">{t("Recenze", "Reviews", "Recenzie", "Відгуки")}</span>
            <h2>{t("Věří nám", "They trust us", "Veria nám", "Нам довіряють")}</h2>
            <div className={styles.ratingBadge}>
              <div className={styles.stars}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <StarIcon key={i} size={16} />
                ))}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#15201B" }}>4.9</span>
              <span style={{ fontSize: 13, color: "#8A968A" }}>/ 5.0</span>
            </div>
          </div>
          <div className={styles.marqOuter} onMouseEnter={() => setMarqPaused(true)} onMouseLeave={() => setMarqPaused(false)}>
            <div className={`marq-track ${marqPaused ? "paused" : ""} ${styles.marqTrack}`}>
              {reviewsDouble.map((r, i) => (
                <div key={i} className={styles.reviewCard}>
                  <div className={styles.stars}>
                    {[0, 1, 2, 3, 4].map((j) => (
                      <StarIcon key={j} size={15} />
                    ))}
                  </div>
                  <p>{r.text}</p>
                  <div className={styles.reviewFooter}>
                    <span className={styles.reviewAvatar}>{r.ini}</span>
                    <div>
                      <div className={styles.reviewName}>{r.name}</div>
                      <div className={styles.reviewRole}>{r.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.fadeL} />
            <div className={styles.fadeR} />
          </div>
        </div>
      </section>

      {/* REQUEST FORM */}
      <section className={`sec ${styles.formSection}`} id="request">
        <div className="W">
          <div className="form-outer">
            <div className={`stagger ${styles.formIntro}`}>
              <span className={styles.formKicker}>{t("Poptávka", "Request", "Dopyt", "Заявка")}</span>
              <h2>{t("Řekněte nám o vašem objektu", "Tell us about your site", "Povedzte nám o vašom objekte", "Розкажіть про ваш об’єкт")}</h2>
              <p>
                {t(
                  "Vyplňte formulář. Manažer vás kontaktuje do jednoho pracovního dne a připraví přesnou kalkulaci.",
                  "Fill in the form. A manager will contact you within a business day and prepare a precise estimate.",
                  "Vyplňte formulár. Manažér vás kontaktuje do jedného pracovného dňa a pripraví presnú kalkuláciu.",
                  "Заповніть форму. Менеджер зв’яжеться з вами протягом робочого дня і підготує точний розрахунок."
                )}
              </p>
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8.1 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
                    </svg>
                  </span>
                  <div>
                    <div className={styles.contactLabel}>{t("Telefon", "Phone", "Telefón", "Телефон")}</div>
                    <a href="tel:+420775052281" className={styles.contactValue}>{COMPANY.phone}</a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.8" strokeLinecap="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 7l10 6 10-6" />
                    </svg>
                  </span>
                  <div>
                    <div className={styles.contactLabel}>E-mail</div>
                    <a href="mailto:info@apexgold.cz" className={styles.contactValue} style={{ color: "#C5E8D6" }}>info@apexgold.cz</a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.8" strokeLinecap="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  </span>
                  <div>
                    <div className={styles.contactLabel}>{t("Pracovní doba", "Working hours", "Pracovný čas", "Години роботи")}</div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{t("Po–Ne, 24/7", "Mon–Sun, 24/7", "Po–Ne, 24/7", "Пн–Нд, 24/7")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`stagger ${styles.formPanel}`}>
              {isSuccess ? (
                <div className={`${styles.successBox} vis`}>
                  <span className={styles.successIcon}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0E5540" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <h3>{t("Poptávka přijata!", "Request received!", "Dopyt prijatý!", "Заявку прийнято!")}</h3>
                  <p>{t("Manažer ApexGold vás brzy kontaktuje.", "An ApexGold manager will contact you shortly.", "Manažér ApexGold vás čoskoro kontaktuje.", "Менеджер ApexGold зв’яжеться з вами найближчим часом.")}</p>
                  <button type="button" onClick={reset} className={styles.resetBtn}>
                    {t("Odeslat další", "Send another", "Odoslať ďalší", "Надіслати ще одну")}
                  </button>
                </div>
              ) : (
                <div className={`${styles.formFields} vis`}>
                  <div className="form-row">
                    <div>
                      <label className={styles.fieldLabel}>{t("Společnost *", "Company *", "Spoločnosť *", "Компанія *")}</label>
                      <input type="text" value={form.company} onChange={set("company")} onBlur={markTouched("company")} placeholder={t("Název společnosti", "Company name", "Názov spoločnosti", "Назва компанії")} className={`field-input ${touched.company && errors.company ? "has-error" : ""}`} />
                      <span className="field-error">{(touched.company && errors.company) || ""}</span>
                    </div>
                    <div>
                      <label className={styles.fieldLabel}>{t("Jméno a příjmení *", "Full name *", "Meno a priezvisko *", "Ім’я та прізвище *")}</label>
                      <input type="text" value={form.name} onChange={set("name")} onBlur={markTouched("name")} placeholder={t("Jan Novák", "John Smith", "Ján Novák", "Іван Іванов")} className={`field-input ${touched.name && errors.name ? "has-error" : ""}`} />
                      <span className="field-error">{(touched.name && errors.name) || ""}</span>
                    </div>
                  </div>
                  <div className="form-row">
                    <div>
                      <label className={styles.fieldLabel}>{t("Telefon *", "Phone *", "Telefón *", "Телефон *")}</label>
                      <input type="tel" inputMode="numeric" value={form.phone} onChange={setDigitsOnly("phone")} onBlur={markTouched("phone")} placeholder="420777123456" className={`field-input ${touched.phone && errors.phone ? "has-error" : ""}`} />
                      <span className="field-error">{(touched.phone && errors.phone) || ""}</span>
                    </div>
                    <div>
                      <label className={styles.fieldLabel}>{t("E-mail *", "E-mail *", "E-mail *", "E-mail *")}</label>
                      <input type="email" value={form.email} onChange={set("email")} onBlur={markTouched("email")} placeholder="jmeno@firma.cz" className={`field-input ${touched.email && errors.email ? "has-error" : ""}`} />
                      <span className="field-error">{(touched.email && errors.email) || ""}</span>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className={styles.multiSelect} ref={serviceRef}>
                      <label className={styles.fieldLabel}>{t("Služba", "Service", "Služba", "Послуга")}</label>
                      <button
                        type="button"
                        className={styles.multiSelectTrigger}
                        onClick={() => setServiceOpen((o) => !o)}
                      >
                        <span className={styles.multiSelectTriggerText}>
                          {form.service.length
                            ? form.service.join(", ")
                            : t("Vyberte služby", "Select services", "Vyberte služby", "Виберіть послуги")}
                        </span>
                        <ArrowIcon color="#1F4D37" />
                      </button>
                      {serviceOpen && (
                        <div className={styles.multiSelectPanel}>
                          {SERVICE_OPTIONS.map((opt, i) => (
                            <label key={i} className={styles.multiSelectOption}>
                              <input
                                type="checkbox"
                                checked={serviceIdx.includes(i)}
                                onChange={() => toggleService(i)}
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className={styles.fieldLabel}>{t("Plocha, m²", "Area, m²", "Plocha, m²", "Площа, м²")}</label>
                      <input type="text" inputMode="numeric" value={form.area} onChange={setDigitsOnly("area")} placeholder="350" className="field-input" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div>
                      <label className={styles.fieldLabel}>{t("Město *", "City *", "Mesto *", "Місто *")}</label>
                      <input type="text" value={form.city} onChange={set("city")} onBlur={markTouched("city")} placeholder={t("Praha", "Prague", "Praha", "Прага")} className={`field-input ${touched.city && errors.city ? "has-error" : ""}`} />
                      <span className="field-error">{(touched.city && errors.city) || ""}</span>
                    </div>
                    <div>
                      <label className={styles.fieldLabel}>{t("Typ objektu *", "Property type *", "Typ objektu *", "Тип об’єкта *")}</label>
                      <input type="text" value={form.objectType} onChange={set("objectType")} onBlur={markTouched("objectType")} placeholder={t("kancelář", "office", "kancelária", "офіс")} className={`field-input ${touched.objectType && errors.objectType ? "has-error" : ""}`} />
                      <span className="field-error">{(touched.objectType && errors.objectType) || ""}</span>
                    </div>
                  </div>
                  <div className="form-row">
                    <div>
                      <label className={styles.fieldLabel}>{t("Adresa *", "Address *", "Adresa *", "Адреса *")}</label>
                      <input type="text" value={form.address} onChange={set("address")} onBlur={markTouched("address")} placeholder={t("Vinohradská 12, Praha 2", "Vinohradská 12, Prague 2", "Vinohradská 12, Praha 2", "Виноградська 12, Прага 2")} className={`field-input ${touched.address && errors.address ? "has-error" : ""}`} />
                      <span className="field-error">{(touched.address && errors.address) || ""}</span>
                    </div>
                    <div>
                      <label className={styles.fieldLabel}>{t("Preferovaný termín prohlídky", "Preferred inspection date", "Preferovaný termín obhliadky", "Бажана дата огляду")}</label>
                      <input type="date" value={form.visitDate} onChange={set("visitDate")} className="field-input" />
                    </div>
                  </div>
                  <div>
                    <label className={styles.fieldLabel}>{t("Komentář", "Comment", "Komentár", "Коментар")}</label>
                    <textarea value={form.comment} onChange={set("comment")} rows={3} placeholder={t("Popište úkol nebo specifika objektu", "Describe the task or site specifics", "Opíšte úlohu alebo špecifiká objektu", "Опишіть завдання або особливості об’єкта")} className="field-textarea" />
                  </div>
                  <p className={styles.consentNote}>
                    {t(
                      "Odesláním formuláře souhlasíte se zpracováním osobních údajů pro vyřízení poptávky. Více v ",
                      "By submitting the form you agree to the processing of personal data to handle your request. More in the ",
                      "Odoslaním formulára súhlasíte so spracovaním osobných údajov na vybavenie dopytu. Viac v ",
                      "Надсиланням форми ви погоджуєтесь на обробку персональних даних для опрацювання запиту. Докладніше в "
                    )}
                    <Link href={`/${lang}/zasady-ochrany-osobnich-udaju`} className={styles.consentLink}>
                      {t("Zásadách zpracování osobních údajů", "Personal data processing policy", "Zásadách spracovania osobných údajov", "Політиці обробки персональних даних")}
                    </Link>
                    .
                  </p>
                  {showError && (
                    <div className={styles.errorBanner}>{t("Vyplňte zvýrazněná pole.", "Please fill in the required fields.", "Vyplňte zvýraznené polia.", "Заповніть виділені поля.")}</div>
                  )}
                  {submitError && <div className={styles.errorBanner}>{submitError}</div>}
                  <button type="button" onClick={onSubmit} disabled={isLoading || hasErrors} className="submit-btn">
                    {isLoading && <span className={styles.spinner} />}
                    {isLoading ? t("Odesíláme…", "Sending…", "Odosielame…", "Надсилаємо…") : t("Odeslat poptávku", "Submit request", "Odoslať dopyt", "Надіслати заявку")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}
