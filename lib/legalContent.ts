// Legal documents as structured, localized content. The Czech version is the
// authoritative one (jurisdiction language); en/sk/uk are faithful translations
// of the Czech text, not independently generated. The "Czech version prevails"
// note is added by the renderer for non-cs locales.
//
// Content reflects the REAL setup of this site: an offline-contract B2B landing
// page whose only data intake is the contact (lead) form, plus Google Analytics
// and Google Ads / GCLID attribution. No e-shop, no newsletter, no Meta Pixel.

import type { Tr3 } from "./locales";
import { COMPANY } from "./company";

export type LegalDocId = "privacy" | "cookies";

export type LegalBlock =
  | { type: "h2"; text: Tr3 }
  | { type: "p"; text: Tr3 }
  | { type: "ul"; items: Tr3[] }
  | { type: "note"; text: Tr3 }
  | { type: "identity" }
  | { type: "table"; head: Tr3[]; rows: Tr3[][] };

export interface LegalDoc {
  slug: string;
  title: Tr3;
  intro: Tr3;
  blocks: LegalBlock[];
}

const privacy: LegalDoc = {
  slug: "zasady-ochrany-osobnich-udaju",
  title: {
    cs: "Zásady zpracování osobních údajů",
    en: "Personal data processing policy",
    sk: "Zásady spracovania osobných údajov",
    uk: "Політика обробки персональних даних",
  },
  intro: {
    cs: "Tyto zásady vysvětlují, jaké osobní údaje o vás zpracováváme, když nám napíšete přes kontaktní formulář nebo si prohlížíte tento web, proč to děláme a jaká máte práva. Web slouží k poptávce našich úklidových služeb pro firmy, smlouvy uzavíráme offline.",
    en: "This policy explains what personal data we process about you when you contact us through the form or browse this site, why we do it and what rights you have. The site is used to request our commercial cleaning services; contracts are concluded offline.",
    sk: "Tieto zásady vysvetľujú, aké osobné údaje o vás spracúvame, keď nám napíšete cez kontaktný formulár alebo si prezeráte túto stránku, prečo to robíme a aké máte práva. Stránka slúži na dopyt našich upratovacích služieb pre firmy, zmluvy uzatvárame offline.",
    uk: "Ця політика пояснює, які персональні дані про вас ми обробляємо, коли ви пишете нам через контактну форму або переглядаєте цей сайт, навіщо ми це робимо та які у вас права. Сайт слугує для замовлення наших послуг прибирання для бізнесу, договори укладаємо офлайн.",
  },
  blocks: [
    {
      type: "h2",
      text: { cs: "Kdo je správce údajů", en: "Who is the data controller", sk: "Kto je prevádzkovateľ", uk: "Хто є розпорядником даних" },
    },
    { type: "identity" },
    {
      type: "h2",
      text: { cs: "Jaké údaje zpracováváme", en: "What data we process", sk: "Aké údaje spracúvame", uk: "Які дані ми обробляємо" },
    },
    {
      type: "p",
      text: {
        cs: "a) Kontaktní údaje, které vyplníte do formuláře:",
        en: "a) Contact data you enter in the form:",
        sk: "a) Kontaktné údaje, ktoré vyplníte do formulára:",
        uk: "a) Контактні дані, які ви вводите у формі:",
      },
    },
    {
      type: "ul",
      items: [
        { cs: "název společnosti", en: "company name", sk: "názov spoločnosti", uk: "назва компанії" },
        { cs: "jméno kontaktní osoby", en: "contact person's name", sk: "meno kontaktnej osoby", uk: "ім’я контактної особи" },
        { cs: "telefon a e-mail", en: "phone and e-mail", sk: "telefón a e-mail", uk: "телефон та e-mail" },
        { cs: "město, typ a adresa objektu", en: "city, object type and address", sk: "mesto, typ a adresa objektu", uk: "місто, тип та адреса об’єкта" },
        {
          cs: "nepovinné údaje: požadovaná služba, plocha, termín prohlídky a poznámka",
          en: "optional details: requested service, area, survey date and a note",
          sk: "nepovinné údaje: požadovaná služba, plocha, termín obhliadky a poznámka",
          uk: "необов’язкові дані: бажана послуга, площа, дата огляду та примітка",
        },
      ],
    },
    {
      type: "p",
      text: {
        cs: "b) Technické a marketingové údaje, které se odesílají spolu s formulářem automaticky, ale pouze poté, co udělíte souhlas s cookies. Bez souhlasu tato pole zůstanou prázdná:",
        en: "b) Technical and marketing data sent automatically together with the form, but only after you grant cookie consent. Without consent these fields stay empty:",
        sk: "b) Technické a marketingové údaje, ktoré sa odosielajú spolu s formulárom automaticky, ale iba potom, čo udelíte súhlas s cookies. Bez súhlasu tieto polia zostanú prázdne:",
        uk: "b) Технічні та маркетингові дані, що надсилаються разом із формою автоматично, але лише після того, як ви надасте згоду на cookie. Без згоди ці поля залишаються порожніми:",
      },
    },
    {
      type: "ul",
      items: [
        { cs: "datum a čas odeslání", en: "date and time of submission", sk: "dátum a čas odoslania", uk: "дата й час відправлення" },
        { cs: "adresa (URL) a název stránky odeslání", en: "URL and title of the page of submission", sk: "adresa (URL) a názov stránky odoslania", uk: "адреса (URL) і назва сторінки відправлення" },
        { cs: "zdroj návštěvy (referrer)", en: "traffic source (referrer)", sk: "zdroj návštevy (referrer)", uk: "джерело переходу (referrer)" },
        { cs: "UTM parametry: source, medium, campaign, content, term", en: "UTM parameters: source, medium, campaign, content, term", sk: "UTM parametre: source, medium, campaign, content, term", uk: "UTM-параметри: source, medium, campaign, content, term" },
        { cs: "GCLID (identifikátor kliknutí Google Ads)", en: "GCLID (Google Ads click identifier)", sk: "GCLID (identifikátor kliknutia Google Ads)", uk: "GCLID (ідентифікатор кліку Google Ads)" },
        { cs: "typ zařízení (počítač, mobil, tablet)", en: "device type (desktop, mobile, tablet)", sk: "typ zariadenia (počítač, mobil, tablet)", uk: "тип пристрою (комп’ютер, мобільний, планшет)" },
        { cs: "jazyk prohlížeče", en: "browser language", sk: "jazyk prehliadača", uk: "мова браузера" },
      ],
    },
    {
      type: "h2",
      text: { cs: "Proč údaje zpracováváme a na jakém základě", en: "Why we process the data and on what legal basis", sk: "Prečo údaje spracúvame a na akom základe", uk: "Навіщо ми обробляємо дані та на якій підставі" },
    },
    {
      type: "ul",
      items: [
        {
          cs: "Vyřízení poptávky z kontaktního formuláře. Právní základ: jednání před uzavřením smlouvy na vaši žádost (čl. 6 odst. 1 písm. b GDPR). Bez těchto údajů vás nemůžeme kontaktovat ani připravit kalkulaci.",
          en: "Handling the request from the contact form. Legal basis: steps taken at your request prior to entering into a contract (Art. 6(1)(b) GDPR). Without this data we cannot contact you or prepare a quote.",
          sk: "Vybavenie dopytu z kontaktného formulára. Právny základ: rokovanie pred uzavretím zmluvy na vašu žiadosť (čl. 6 ods. 1 písm. b GDPR). Bez týchto údajov vás nemôžeme kontaktovať ani pripraviť kalkuláciu.",
          uk: "Опрацювання запиту з контактної форми. Правова підстава: дії на ваш запит перед укладенням договору (ст. 6(1)(b) GDPR). Без цих даних ми не можемо зв’язатися з вами чи підготувати кошторис.",
        },
        {
          cs: "Měření návštěvnosti webu pomocí Google Analytics. Právní základ: váš souhlas (čl. 6 odst. 1 písm. a GDPR).",
          en: "Measuring site traffic with Google Analytics. Legal basis: your consent (Art. 6(1)(a) GDPR).",
          sk: "Meranie návštevnosti webu pomocou Google Analytics. Právny základ: váš súhlas (čl. 6 ods. 1 písm. a GDPR).",
          uk: "Вимірювання відвідуваності сайту за допомогою Google Analytics. Правова підстава: ваша згода (ст. 6(1)(a) GDPR).",
        },
        {
          cs: "Vyhodnocení účinnosti reklamních kampaní a atribuce zdroje poptávky (UTM, GCLID, referrer). Právní základ: váš souhlas (čl. 6 odst. 1 písm. a GDPR).",
          en: "Evaluating advertising campaign performance and attributing the source of a request (UTM, GCLID, referrer). Legal basis: your consent (Art. 6(1)(a) GDPR).",
          sk: "Vyhodnotenie účinnosti reklamných kampaní a atribúcia zdroja dopytu (UTM, GCLID, referrer). Právny základ: váš súhlas (čl. 6 ods. 1 písm. a GDPR).",
          uk: "Оцінка ефективності рекламних кампаній та атрибуція джерела запиту (UTM, GCLID, referrer). Правова підстава: ваша згода (ст. 6(1)(a) GDPR).",
        },
      ],
    },
    {
      type: "note",
      text: {
        cs: "Pro analytiku i marketingovou atribuci volíme jako právní základ souhlas, nikoli oprávněný zájem. Tyto nástroje totiž pracují s cookies a s identifikátory, které se předávají reklamní platformě, a takové zpracování se bez souhlasu spustit nesmí.",
        en: "For both analytics and marketing attribution we rely on consent, not legitimate interest. These tools work with cookies and identifiers shared with an advertising platform, and such processing must not start without consent.",
        sk: "Pri analytike aj marketingovej atribúcii volíme ako právny základ súhlas, nie oprávnený záujem. Tieto nástroje totiž pracujú s cookies a s identifikátormi, ktoré sa odovzdávajú reklamnej platforme, a takéto spracovanie sa bez súhlasu spustiť nesmie.",
        uk: "Для аналітики та маркетингової атрибуції ми обираємо підставою згоду, а не правомірний інтерес. Ці інструменти працюють із cookie та ідентифікаторами, які передаються рекламній платформі, і таку обробку без згоди запускати не можна.",
      },
    },
    {
      type: "h2",
      text: { cs: "Komu údaje předáváme", en: "Who we share the data with", sk: "Komu údaje odovzdávame", uk: "Кому ми передаємо дані" },
    },
    {
      type: "p",
      text: {
        cs: "Kontaktní údaje z formuláře nepředáváme třetím stranám pro jejich vlastní účely. Jako zpracovatele využíváme:",
        en: "We do not share the contact data from the form with third parties for their own purposes. As processors we use:",
        sk: "Kontaktné údaje z formulára neposkytujeme tretím stranám na ich vlastné účely. Ako sprostredkovateľov využívame:",
        uk: "Контактні дані з форми ми не передаємо третім сторонам для їхніх власних цілей. Як обробників ми залучаємо:",
      },
    },
    {
      type: "ul",
      items: [
        {
          cs: "Google Ireland Limited jako poskytovatele Google Analytics (analytika návštěvnosti).",
          en: "Google Ireland Limited as the provider of Google Analytics (traffic analytics).",
          sk: "Google Ireland Limited ako poskytovateľa Google Analytics (analytika návštevnosti).",
          uk: "Google Ireland Limited як постачальника Google Analytics (аналітика відвідуваності).",
        },
        {
          cs: "Google Ireland Limited jako poskytovatele Google Ads. GCLID se vrací do Google Ads pro měření konverzí a atribuci poptávky ke kampani.",
          en: "Google Ireland Limited as the provider of Google Ads. The GCLID is returned to Google Ads to measure conversions and attribute a request to a campaign.",
          sk: "Google Ireland Limited ako poskytovateľa Google Ads. GCLID sa vracia do Google Ads na meranie konverzií a atribúciu dopytu ku kampani.",
          uk: "Google Ireland Limited як постачальника Google Ads. GCLID повертається до Google Ads для вимірювання конверсій та атрибуції запиту до кампанії.",
        },
      ],
    },
    {
      type: "p",
      text: {
        cs: "Google může údaje zpracovávat i mimo EU. V takovém případě se přenos opírá o standardní smluvní doložky schválené Evropskou komisí.",
        en: "Google may also process data outside the EU. In that case the transfer relies on the Standard Contractual Clauses approved by the European Commission.",
        sk: "Google môže údaje spracúvať aj mimo EÚ. V takom prípade sa prenos opiera o štandardné zmluvné doložky schválené Európskou komisiou.",
        uk: "Google може обробляти дані й за межами ЄС. У такому разі передавання ґрунтується на стандартних договірних положеннях, затверджених Європейською Комісією.",
      },
    },
    {
      type: "h2",
      text: { cs: "Jak dlouho údaje uchováváme", en: "How long we keep the data", sk: "Ako dlho údaje uchovávame", uk: "Як довго ми зберігаємо дані" },
    },
    {
      type: "ul",
      items: [
        {
          cs: "Kontaktní údaje z poptávky: po dobu vyřízení poptávky a následně nejvýše 12 měsíců, pokud nevznikne smluvní vztah. Vznikne-li smlouva, řídí se doba archivace zákonnými lhůtami.",
          en: "Contact data from a request: for the time needed to handle it and then no longer than 12 months if no contract arises. If a contract is concluded, retention follows the statutory periods.",
          sk: "Kontaktné údaje z dopytu: počas vybavenia dopytu a následne najviac 12 mesiacov, ak nevznikne zmluvný vzťah. Ak vznikne zmluva, doba archivácie sa riadi zákonnými lehotami.",
          uk: "Контактні дані із запиту: на час опрацювання запиту та потім не довше 12 місяців, якщо не виникає договірних відносин. Якщо укладено договір, строк зберігання визначають законодавчі строки.",
        },
        {
          cs: "Analytické údaje v Google Analytics: podle nastavení uchovávání v GA, standardně nejvýše 14 měsíců.",
          en: "Analytics data in Google Analytics: according to the GA retention setting, by default no more than 14 months.",
          sk: "Analytické údaje v Google Analytics: podľa nastavenia uchovávania v GA, štandardne najviac 14 mesiacov.",
          uk: "Аналітичні дані в Google Analytics: відповідно до налаштування зберігання в GA, за замовчуванням не більше 14 місяців.",
        },
        {
          cs: "Marketingová atribuce (UTM, GCLID, referrer): po dobu platnosti souhlasu, nejdéle však do jeho odvolání.",
          en: "Marketing attribution (UTM, GCLID, referrer): for as long as the consent is valid, at the latest until it is withdrawn.",
          sk: "Marketingová atribúcia (UTM, GCLID, referrer): počas platnosti súhlasu, najdlhšie však do jeho odvolania.",
          uk: "Маркетингова атрибуція (UTM, GCLID, referrer): протягом дії згоди, але не довше ніж до її відкликання.",
        },
      ],
    },
    {
      type: "h2",
      text: { cs: "Vaše práva", en: "Your rights", sk: "Vaše práva", uk: "Ваші права" },
    },
    {
      type: "ul",
      items: [
        { cs: "právo na přístup ke svým údajům", en: "the right of access to your data", sk: "právo na prístup k svojim údajom", uk: "право на доступ до своїх даних" },
        { cs: "právo na opravu nepřesných údajů", en: "the right to rectification of inaccurate data", sk: "právo na opravu nepresných údajov", uk: "право на виправлення неточних даних" },
        { cs: "právo na výmaz", en: "the right to erasure", sk: "právo na výmaz", uk: "право на видалення" },
        { cs: "právo na omezení zpracování", en: "the right to restriction of processing", sk: "právo na obmedzenie spracovania", uk: "право на обмеження обробки" },
        { cs: "právo vznést námitku proti zpracování", en: "the right to object to processing", sk: "právo namietať proti spracovaniu", uk: "право заперечувати проти обробки" },
        { cs: "právo na přenositelnost údajů", en: "the right to data portability", sk: "právo na prenosnosť údajov", uk: "право на перенесення даних" },
        {
          cs: "právo kdykoli odvolat udělený souhlas, aniž je dotčena zákonnost zpracování před odvoláním",
          en: "the right to withdraw a granted consent at any time, without affecting the lawfulness of processing before withdrawal",
          sk: "právo kedykoľvek odvolať udelený súhlas bez toho, aby bola dotknutá zákonnosť spracovania pred odvolaním",
          uk: "право будь-коли відкликати надану згоду, що не впливає на законність обробки до відкликання",
        },
        {
          cs: "právo podat stížnost u Úřadu pro ochranu osobních údajů (ÚOOÚ)",
          en: "the right to lodge a complaint with the Office for Personal Data Protection (ÚOOÚ)",
          sk: "právo podať sťažnosť na Úrade na ochranu osobných údajov (ÚOOÚ)",
          uk: "право подати скаргу до Управління із захисту персональних даних (ÚOOÚ)",
        },
      ],
    },
    {
      type: "h2",
      text: { cs: "Jak práva uplatnit", en: "How to exercise your rights", sk: "Ako uplatniť práva", uk: "Як реалізувати права" },
    },
    {
      type: "p",
      text: {
        cs: `Napište nám na ${COMPANY.email}. Souhlas s analytickými a marketingovými cookies můžete kdykoli změnit nebo odvolat přes odkaz Nastavení cookies v patičce webu. Stížnost lze podat u ÚOOÚ (${COMPANY.authority}).`,
        en: `Write to us at ${COMPANY.email}. You can change or withdraw consent to analytics and marketing cookies at any time via the Cookie settings link in the site footer. A complaint can be lodged with the ÚOOÚ (${COMPANY.authority}).`,
        sk: `Napíšte nám na ${COMPANY.email}. Súhlas s analytickými a marketingovými cookies môžete kedykoľvek zmeniť alebo odvolať cez odkaz Nastavenie cookies v pätičke webu. Sťažnosť možno podať na ÚOOÚ (${COMPANY.authority}).`,
        uk: `Напишіть нам на ${COMPANY.email}. Згоду на аналітичні та маркетингові cookie можна будь-коли змінити чи відкликати через посилання Налаштування cookie в підвалі сайту. Скаргу можна подати до ÚOOÚ (${COMPANY.authority}).`,
      },
    },
    {
      type: "h2",
      text: { cs: "Cookies", en: "Cookies", sk: "Cookies", uk: "Файли cookie" },
    },
    {
      type: "p",
      text: {
        cs: "Podrobnosti o cookies, jejich kategoriích a době platnosti najdete v samostatném dokumentu Zásady používání cookies.",
        en: "Details about cookies, their categories and lifetimes are in a separate document, the Cookie policy.",
        sk: "Podrobnosti o cookies, ich kategóriách a dobe platnosti nájdete v samostatnom dokumente Zásady používania cookies.",
        uk: "Докладніше про cookie, їхні категорії та строк дії дивіться в окремому документі Політика використання файлів cookie.",
      },
    },
    {
      type: "h2",
      text: { cs: "Změny těchto zásad", en: "Changes to this policy", sk: "Zmeny týchto zásad", uk: "Зміни цієї політики" },
    },
    {
      type: "p",
      text: {
        cs: "Zásady můžeme aktualizovat, když se změní nástroje nebo účely zpracování. Aktuální verze je vždy dostupná na této stránce.",
        en: "We may update this policy when the tools or purposes of processing change. The current version is always available on this page.",
        sk: "Zásady môžeme aktualizovať, keď sa zmenia nástroje alebo účely spracovania. Aktuálna verzia je vždy dostupná na tejto stránke.",
        uk: "Ми можемо оновлювати цю політику, коли змінюються інструменти чи цілі обробки. Актуальна версія завжди доступна на цій сторінці.",
      },
    },
  ],
};

const cookies: LegalDoc = {
  slug: "zasady-cookies",
  title: {
    cs: "Zásady používání cookies",
    en: "Cookie policy",
    sk: "Zásady používania cookies",
    uk: "Політика використання файлів cookie",
  },
  intro: {
    cs: "Tento dokument popisuje, jaké cookies a podobné technologie na webu používáme, k čemu slouží a jak nad nimi máte kontrolu.",
    en: "This document describes what cookies and similar technologies we use on the site, what they are for and how you stay in control of them.",
    sk: "Tento dokument popisuje, aké cookies a podobné technológie na webe používame, na čo slúžia a ako nad nimi máte kontrolu.",
    uk: "Цей документ описує, які cookie та подібні технології ми використовуємо на сайті, для чого вони потрібні та як ви ними керуєте.",
  },
  blocks: [
    {
      type: "h2",
      text: { cs: "Co jsou cookies", en: "What cookies are", sk: "Čo sú cookies", uk: "Що таке cookie" },
    },
    {
      type: "p",
      text: {
        cs: "Cookies jsou malé soubory, které web ukládá do vašeho prohlížeče. Pomáhají zapamatovat si vaše volby (například jazyk) a měřit, jak se web používá. Podobně funguje i úložiště prohlížeče (local a session storage), které využíváme k uložení vaší volby cookies.",
        en: "Cookies are small files a website stores in your browser. They help remember your choices (such as language) and measure how the site is used. Browser storage (local and session storage), which we use to remember your cookie choice, works in a similar way.",
        sk: "Cookies sú malé súbory, ktoré web ukladá do vášho prehliadača. Pomáhajú zapamätať si vaše voľby (napríklad jazyk) a merať, ako sa web používa. Podobne funguje aj úložisko prehliadača (local a session storage), ktoré využívame na uloženie vašej voľby cookies.",
        uk: "Cookie є невеликими файлами, які сайт зберігає у вашому браузері. Вони допомагають запам’ятати ваш вибір (наприклад, мову) та вимірювати, як використовується сайт. Подібно працює і сховище браузера (local та session storage), яке ми використовуємо для збереження вашого вибору щодо cookie.",
      },
    },
    {
      type: "h2",
      text: { cs: "Jaké cookies používáme", en: "What cookies we use", sk: "Aké cookies používame", uk: "Які cookie ми використовуємо" },
    },
    {
      type: "table",
      head: [
        { cs: "Kategorie", en: "Category", sk: "Kategória", uk: "Категорія" },
        { cs: "Název", en: "Name", sk: "Názov", uk: "Назва" },
        { cs: "Účel", en: "Purpose", sk: "Účel", uk: "Призначення" },
        { cs: "Doba platnosti", en: "Lifetime", sk: "Doba platnosti", uk: "Строк дії" },
        { cs: "Poskytovatel", en: "Provider", sk: "Poskytovateľ", uk: "Постачальник" },
        { cs: "Právní základ", en: "Legal basis", sk: "Právny základ", uk: "Правова підстава" },
      ],
      rows: [
        [
          { cs: "Nezbytné", en: "Necessary", sk: "Nevyhnutné", uk: "Необхідні" },
          { cs: "apexgold-consent", en: "apexgold-consent", sk: "apexgold-consent", uk: "apexgold-consent" },
          { cs: "uchování vaší volby cookies", en: "storing your cookie choice", sk: "uchovanie vašej voľby cookies", uk: "збереження вашого вибору щодо cookie" },
          { cs: "trvale (local storage)", en: "persistent (local storage)", sk: "trvalo (local storage)", uk: "постійно (local storage)" },
          { cs: "ApexGold", en: "ApexGold", sk: "ApexGold", uk: "ApexGold" },
          { cs: "nezbytné pro fungování", en: "necessary for operation", sk: "nevyhnutné pre fungovanie", uk: "необхідні для роботи" },
        ],
        [
          { cs: "Nezbytné", en: "Necessary", sk: "Nevyhnutné", uk: "Необхідні" },
          { cs: "apexgold-lang", en: "apexgold-lang", sk: "apexgold-lang", uk: "apexgold-lang" },
          { cs: "zapamatování zvoleného jazyka", en: "remembering the chosen language", sk: "zapamätanie zvoleného jazyka", uk: "запам’ятовування обраної мови" },
          { cs: "12 měsíců", en: "12 months", sk: "12 mesiacov", uk: "12 місяців" },
          { cs: "ApexGold", en: "ApexGold", sk: "ApexGold", uk: "ApexGold" },
          { cs: "nezbytné pro fungování", en: "necessary for operation", sk: "nevyhnutné pre fungovanie", uk: "необхідні для роботи" },
        ],
        [
          { cs: "Analytické", en: "Analytics", sk: "Analytické", uk: "Аналітичні" },
          { cs: "_ga, _ga_*", en: "_ga, _ga_*", sk: "_ga, _ga_*", uk: "_ga, _ga_*" },
          { cs: "měření návštěvnosti (Google Analytics)", en: "traffic measurement (Google Analytics)", sk: "meranie návštevnosti (Google Analytics)", uk: "вимірювання відвідуваності (Google Analytics)" },
          { cs: "až 2 roky", en: "up to 2 years", sk: "až 2 roky", uk: "до 2 років" },
          { cs: "Google", en: "Google", sk: "Google", uk: "Google" },
          { cs: "souhlas", en: "consent", sk: "súhlas", uk: "згода" },
        ],
        [
          { cs: "Marketingové", en: "Marketing", sk: "Marketingové", uk: "Маркетингові" },
          { cs: "_gcl_au", en: "_gcl_au", sk: "_gcl_au", uk: "_gcl_au" },
          { cs: "atribuce konverzí Google Ads (GCLID)", en: "Google Ads conversion attribution (GCLID)", sk: "atribúcia konverzií Google Ads (GCLID)", uk: "атрибуція конверсій Google Ads (GCLID)" },
          { cs: "90 dnů", en: "90 days", sk: "90 dní", uk: "90 днів" },
          { cs: "Google", en: "Google", sk: "Google", uk: "Google" },
          { cs: "souhlas", en: "consent", sk: "súhlas", uk: "згода" },
        ],
      ],
    },
    {
      type: "h2",
      text: { cs: "Analytické cookies (Google Analytics)", en: "Analytics cookies (Google Analytics)", sk: "Analytické cookies (Google Analytics)", uk: "Аналітичні cookie (Google Analytics)" },
    },
    {
      type: "p",
      text: {
        cs: "Google Analytics používáme v režimu opt-in. Analytické cookies i samotný skript se načtou až poté, co v cookie liště kliknete na Přijmout. Dokud souhlas neudělíte, žádné analytické cookies se neukládají.",
        en: "We use Google Analytics on an opt-in basis. The analytics cookies and the script itself load only after you click Accept in the cookie bar. Until you grant consent, no analytics cookies are stored.",
        sk: "Google Analytics používame v režime opt-in. Analytické cookies aj samotný skript sa načítajú až potom, čo v cookie lište kliknete na Prijať. Kým súhlas neudelíte, žiadne analytické cookies sa neukladajú.",
        uk: "Google Analytics ми використовуємо в режимі opt-in. Аналітичні cookie та сам скрипт завантажуються лише після того, як ви натиснете Прийняти в панелі cookie. Доки ви не надасте згоду, жодні аналітичні cookie не зберігаються.",
      },
    },
    {
      type: "h2",
      text: { cs: "Marketingová atribuce (UTM, GCLID)", en: "Marketing attribution (UTM, GCLID)", sk: "Marketingová atribúcia (UTM, GCLID)", uk: "Маркетингова атрибуція (UTM, GCLID)" },
    },
    {
      type: "p",
      text: {
        cs: "UTM parametry a GCLID slouží k vyhodnocení reklamních kampaní a přiřazení poptávky ke zdroji. Sbírají se na základě souhlasu, takže se do formuláře doplní a odešlou pouze po přijetí cookies. Bez souhlasu zůstávají tato pole prázdná.",
        en: "UTM parameters and GCLID are used to evaluate advertising campaigns and attribute a request to its source. They are collected on the basis of consent, so they are added to the form and sent only after cookies are accepted. Without consent these fields stay empty.",
        sk: "UTM parametre a GCLID slúžia na vyhodnotenie reklamných kampaní a priradenie dopytu k zdroju. Zbierajú sa na základe súhlasu, takže sa do formulára doplnia a odošlú iba po prijatí cookies. Bez súhlasu zostávajú tieto polia prázdne.",
        uk: "UTM-параметри та GCLID слугують для оцінки рекламних кампаній і прив’язки запиту до джерела. Вони збираються на підставі згоди, тож додаються до форми й надсилаються лише після прийняття cookie. Без згоди ці поля залишаються порожніми.",
      },
    },
    {
      type: "h2",
      text: { cs: "Jak odvolat nebo změnit souhlas", en: "How to withdraw or change consent", sk: "Ako odvolať alebo zmeniť súhlas", uk: "Як відкликати або змінити згоду" },
    },
    {
      type: "p",
      text: {
        cs: "Souhlas můžete kdykoli změnit přes odkaz Nastavení cookies v patičce webu, kde znovu otevřete cookie lištu. Cookies lze také smazat nebo zablokovat přímo v nastavení vašeho prohlížeče.",
        en: "You can change your consent at any time via the Cookie settings link in the site footer, which reopens the cookie bar. Cookies can also be deleted or blocked directly in your browser settings.",
        sk: "Súhlas môžete kedykoľvek zmeniť cez odkaz Nastavenie cookies v pätičke webu, kde znova otvoríte cookie lištu. Cookies možno tiež zmazať alebo zablokovať priamo v nastavení vášho prehliadača.",
        uk: "Згоду можна будь-коли змінити через посилання Налаштування cookie в підвалі сайту, де знову відкриється панель cookie. Cookie також можна видалити чи заблокувати безпосередньо в налаштуваннях вашого браузера.",
      },
    },
  ],
};

export const LEGAL_DOCS: Record<LegalDocId, LegalDoc> = { privacy, cookies };
