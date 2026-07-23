import type { Tr3 } from "./locales";

function T(cs: string, en: string, sk: string, uk: string): Tr3 {
  return { cs, en, sk, uk };
}

export interface ServiceStep {
  n: string;
  title: Tr3;
  text: Tr3;
}
export interface ServicePriceItem {
  name: Tr3;
  price: string;
  unit: string;
  href?: string;
}
export interface ServiceWho {
  title: Tr3;
  text: Tr3;
}
export interface ServiceFaq {
  q: Tr3;
  a: Tr3;
}
export type GalleryItem =
  | { type: "before-after"; before: string; after: string }
  | { type: "photos"; images: [string, string] };
export interface ServiceEntry {
  crumb: Tr3;
  h1: Tr3;
  heroSub: Tr3;
  img: string;
  /** Describes the hero photo itself — the H1 already carries the service name. */
  heroImgAlt: Tr3;
  introTitle: Tr3;
  intro1: Tr3;
  intro2: Tr3;
  included: Tr3[];
  steps: ServiceStep[];
  priceTitle: Tr3;
  prices: ServicePriceItem[];
  who: ServiceWho[];
  faqs: ServiceFaq[];
  related: string[];
  gallery?: GalleryItem[];
}

export const SERVICE_SLUGS = [
  "generalni-uklid",
  "uklid-po-stavbe",
  "myti-oken",
  "cisteni-koberce-calouneni",
  "cisteni-a-voskovani-podlah",
  "uklid-garazi-a-hal",
  "myti-fasad",
  "renovace-mramoru",
  "renovace-zuly",
  "renovace-terasy",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const servicePageData: Record<ServiceSlug, ServiceEntry> = {
  "generalni-uklid": {
    crumb: T("Generální úklid", "General cleaning", "Generálne upratovanie", "Генеральне прибирання"),
    h1: T("Generální úklid Praha a Středočeský kraj", "General cleaning in Prague and Central Bohemia", "Generálne upratovanie Praha a Stredočeský kraj", "Генеральне прибирання в Празі та Середньочеському краї"),
    heroSub: T(
      "Hloubkový úklid kanceláří, provozoven a bytů po rekonstrukci, jednorázově i podle pravidelného harmonogramu. Smlouva, kontrolní seznam a fotoreport ke každé zakázce.",
      "Deep cleaning of offices, business premises and apartments after renovation, one-off or on a regular schedule. Contract, checklist and photo report with every job.",
      "Hĺbkové upratovanie kancelárií, prevádzok a bytov po rekonštrukcii, jednorazovo aj podľa pravidelného harmonogramu. Zmluva, kontrolný zoznam a fotoreport ku každej zákazke.",
      "Глибоке прибирання офісів, комерційних приміщень і квартир після ремонту, разово або за регулярним графіком. Договір, чек-лист і фотозвіт для кожного об’єкта."
    ),
    img: "/images/hero-team.jpg",
    heroImgAlt: T("Tým ApexGold při generálním úklidu komerčních prostor v Praze", "The ApexGold team during a deep clean of commercial premises in Prague", "Tím ApexGold pri generálnom upratovaní komerčných priestorov v Prahe", "Команда ApexGold під час генерального прибирання комерційних приміщень у Празі"),
    introTitle: T("Co je generální úklid a kdy ho objednat", "What general cleaning is and when to book it", "Čo je generálne upratovanie a kedy si ho objednať", "Що таке генеральне прибирання і коли його замовляти"),
    intro1: T(
      "Generální úklid je hloubkové čištění celého objektu od podlahy po strop, včetně míst, na která běžný úklid nestačí. Umyjeme okna i rámy, vyčistíme koberce a čalounění, strojově ošetříme tvrdé podlahy, vydezinfikujeme sanitu a kuchyňky a odstraníme prach ze všech povrchů včetně těch těžko dostupných.",
      "General cleaning is a deep clean of an entire property, floor to ceiling, including spots a regular clean cannot reach. We wash windows and frames, clean carpets and upholstery, machine-treat hard floors, disinfect sanitary facilities and kitchenettes, and remove dust from every surface, including hard-to-reach places.",
      "Generálne upratovanie je hĺbkové čistenie celého objektu od podlahy po strop, vrátane miest, na ktoré bežné upratovanie nestačí. Umyjeme okná aj rámy, vyčistíme koberce a čalúnenie, strojovo ošetríme tvrdé podlahy, vydezinfikujeme sanitu a kuchynky a odstránime prach zo všetkých povrchov vrátane ťažko dostupných.",
      "Генеральне прибирання означає глибоке очищення всього об’єкта від підлоги до стелі, включно з місцями, куди звичайне прибирання не дістає. Ми миємо вікна й рами, чистимо килими та оббивку, обробляємо тверді підлоги машинним способом, дезінфікуємо сантехніку й кухні та видаляємо пил з усіх поверхонь, включно з важкодоступними."
    ),
    intro2: T(
      "Službu poskytujeme bytům a rodinným domům, kancelářím, obchodním jednotkám i celým administrativním budovám v Praze a Středočeském kraji. Nejčastěji nás klienti volají po rekonstrukci, před nastěhováním, při předání prostor pronajímateli nebo jako sezónní hloubkový úklid provozu. Pracujeme večer, v noci i o víkendu, aby úklid neomezil váš provoz.",
      "We provide the service for apartments and houses, offices, retail units and entire administrative buildings in Prague and Central Bohemia. Clients call us most often after a renovation, before moving in, when handing premises back to a landlord, or as a seasonal deep clean of a business. We work evenings, nights and weekends so the cleaning does not disrupt your operations.",
      "Službu poskytujeme bytom a rodinným domom, kanceláriám, obchodným jednotkám aj celým administratívnym budovám v Prahe a Stredočeskom kraji. Najčastejšie nás klienti volajú po rekonštrukcii, pred nasťahovaním, pri odovzdaní priestorov prenajímateľovi alebo ako sezónne hĺbkové upratovanie prevádzky. Pracujeme večer, v noci aj cez víkend, aby upratovanie neobmedzilo vašu prevádzku.",
      "Надаємо послугу квартирам і будинкам, офісам, торговим приміщенням і цілим адміністративним будівлям у Празі та Середньочеському краї. Найчастіше клієнти звертаються після ремонту, перед заселенням, під час передачі приміщення орендодавцю або як сезонне глибоке прибирання бізнесу. Працюємо ввечері, вночі та у вихідні, щоб прибирання не заважало вашій роботі."
    ),
    included: [
      T("Mytí oken, rámů a parapetů", "Window, frame and windowsill cleaning", "Umývanie okien, rámov a parapetov", "Миття вікон, рам і підвіконь"),
      T("Strojové čištění tvrdých podlah", "Machine cleaning of hard floors", "Strojové čistenie tvrdých podláh", "Машинне чищення твердих підлог"),
      T("Extrakční čištění koberců a čalounění", "Extraction cleaning of carpets and upholstery", "Extrakčné čistenie kobercov a čalúnenia", "Екстракційне чищення килимів та оббивки"),
      T("Dezinfekce sanitárních zařízení a kuchyněk", "Disinfection of sanitary facilities and kitchenettes", "Dezinfekcia sanitárnych zariadení a kuchyniek", "Дезінфекція сантехніки та кухонь"),
      T("Odstranění prachu ze všech povrchů včetně těžko dostupných míst", "Dust removal from all surfaces, including hard-to-reach spots", "Odstránenie prachu zo všetkých povrchov vrátane ťažko dostupných miest", "Видалення пилу з усіх поверхонь, включно з важкодоступними"),
      T("Mytí dveří, zárubní, vypínačů a radiátorů", "Cleaning of doors, frames, switches and radiators", "Umývanie dverí, zárubní, vypínačov a radiátorov", "Миття дверей, коробок, вимикачів і радіаторів"),
      T("Čištění svítidel a mřížek vzduchotechniky", "Cleaning of light fixtures and ventilation grilles", "Čistenie svietidiel a mriežok vzduchotechniky", "Чищення світильників і решіток вентиляції"),
      T("Vynesení a třídění odpadu", "Waste removal and sorting", "Vynesenie a triedenie odpadu", "Винесення та сортування сміття"),
    ],
    steps: [
      { n: "01", title: T("Poptávka", "Request", "Dopyt", "Заявка"), text: T("Zavoláte nebo vyplníte formulář. Manažer se ozve ještě týž pracovní den.", "Call us or fill in the form. A manager will get back to you the same business day.", "Zavoláte alebo vyplníte formulár. Manažér sa ozve ešte v ten istý pracovný deň.", "Зателефонуйте або заповніть форму. Менеджер зв’яжеться з вами того ж робочого дня.") },
      { n: "02", title: T("Prohlídka objektu", "Site survey", "Obhliadka objektu", "Огляд об’єкта"), text: T("Zdarma přijedeme, změříme plochy a upřesníme rozsah prací.", "We visit for free, measure the area and confirm the scope of work.", "Zdarma prídeme, zmeriame plochy a upresníme rozsah prác.", "Безкоштовно приїдемо, заміряємо площі та уточнимо обсяг робіт.") },
      { n: "03", title: T("Kalkulace a termín", "Estimate & date", "Kalkulácia a termín", "Кошторис і термін"), text: T("Do 24 hodin obdržíte závaznou cenovou nabídku a harmonogram.", "You receive a binding quote and schedule within 24 hours.", "Do 24 hodín dostanete záväznú cenovú ponuku a harmonogram.", "Протягом 24 годин ви отримаєте остаточну цінову пропозицію та графік.") },
      { n: "04", title: T("Realizace", "Execution", "Realizácia", "Виконання"), text: T("Tým provede úklid podle kontrolního seznamu, bez omezení vašeho provozu.", "The team cleans according to the checklist, without disrupting your operations.", "Tím vykoná upratovanie podľa kontrolného zoznamu, bez obmedzenia vašej prevádzky.", "Команда виконає прибирання за чек-листом, без обмеження вашої роботи.") },
      { n: "05", title: T("Předání", "Handover", "Odovzdanie", "Здача"), text: T("Společná kontrola výsledku a fotoreport z celé zakázky.", "Joint inspection of the result and a photo report of the whole job.", "Spoločná kontrola výsledku a fotoreport z celej zákazky.", "Спільна перевірка результату та фотозвіт по всьому об’єкту.") },
    ],
    priceTitle: T("Ceník generálního úklidu", "General cleaning price list", "Cenník generálneho upratovania", "Прайс-лист генерального прибирання"),
    prices: [
      { name: T("Úklid po stavbě", "Post-construction cleaning", "Upratovanie po stavbe", "Прибирання після будівництва"), price: "55 Kč", unit: "/m²", href: "uklid-po-stavbe" },
      { name: T("Mytí oken", "Window cleaning", "Umývanie okien", "Миття вікон"), price: "18 Kč", unit: "/m²", href: "myti-oken" },
      { name: T("Mytí koberců", "Carpet cleaning", "Čistenie kobercov", "Чищення килимів"), price: "18 Kč", unit: "/m²", href: "cisteni-koberce-calouneni" },
      { name: T("Čištění čalounění", "Upholstery cleaning", "Čistenie čalúnenia", "Чищення оббивки"), price: "400 Kč", unit: "/kus", href: "cisteni-koberce-calouneni" },
      { name: T("Strojové čištění podlah", "Machine floor cleaning", "Strojové čistenie podláh", "Машинне чищення підлог"), price: "35 Kč", unit: "/m²", href: "cisteni-a-voskovani-podlah" },
      { name: T("Voskování podlah", "Floor waxing", "Voskovanie podláh", "Воскування підлог"), price: "70 Kč", unit: "/m²", href: "cisteni-a-voskovani-podlah" },
      { name: T("Čištění garáží", "Garage cleaning", "Čistenie garáží", "Прибирання гаражів"), price: "9 Kč", unit: "/m²", href: "uklid-garazi-a-hal" },
      { name: T("Úklid hal a skladů", "Warehouse & hall cleaning", "Upratovanie hál a skladov", "Прибирання цехів і складів"), price: "55 Kč", unit: "/m²", href: "uklid-garazi-a-hal" },
      { name: T("Mytí fasád", "Facade washing", "Umývanie fasád", "Миття фасадів"), price: "70 Kč", unit: "/m²", href: "myti-fasad" },
    ],
    who: [
      { title: T("Byty a domy po rekonstrukci", "Apartments and houses after renovation", "Byty a domy po rekonštrukcii", "Квартири та будинки після ремонту"), text: T("Odstraníme stavební prach a připravíme prostor k nastěhování.", "We remove construction dust and prepare the space for moving in.", "Odstránime stavebný prach a pripravíme priestor na nasťahovanie.", "Видаляємо будівельний пил і готуємо простір до заселення.") },
      { title: T("Kanceláře a administrativní budovy", "Offices and administrative buildings", "Kancelárie a administratívne budovy", "Офіси та адміністративні будівлі"), text: T("Hloubkový úklid mimo pracovní dobu: večer, v noci nebo o víkendu.", "Deep cleaning outside business hours: evenings, nights or weekends.", "Hĺbkové upratovanie mimo pracovného času: večer, v noci alebo cez víkend.", "Глибоке прибирання поза робочим часом: увечері, вночі або у вихідні.") },
      { title: T("Provozovny před otevřením", "Premises before opening", "Prevádzky pred otvorením", "Приміщення перед відкриттям"), text: T("Restaurace, obchody a showroomy připravíme na první zákazníky.", "We prepare restaurants, shops and showrooms for their first customers.", "Reštaurácie, obchody a showroomy pripravíme na prvých zákazníkov.", "Готуємо ресторани, магазини й шоуруми до перших клієнтів.") },
      { title: T("Předání prostor pronajímateli", "Handover of premises to a landlord", "Odovzdanie priestorov prenajímateľovi", "Передача приміщення орендодавцю"), text: T("Uvedeme prostory do stavu odpovídajícího předávacímu protokolu.", "We bring the space up to the condition required by the handover protocol.", "Uvedieme priestory do stavu zodpovedajúceho odovzdávaciemu protokolu.", "Приводимо приміщення у стан, що відповідає акту приймання-передачі.") },
    ],
    faqs: [
      { q: T("Jak dlouho generální úklid trvá?", "How long does general cleaning take?", "Ako dlho trvá generálne upratovanie?", "Скільки триває генеральне прибирання?"), a: T("Běžný byt nebo menší kancelář zvládneme za jeden den. U větších objektů nasadíme více pracovníků nebo práci rozdělíme do etap. Přesný harmonogram dostanete spolu s kalkulací.", "A typical apartment or small office takes one day. For larger sites we assign more staff or split the work into stages. You will get the exact schedule with your quote.", "Bežný byt alebo menšiu kanceláriu zvládneme za jeden deň. Pri väčších objektoch nasadíme viac pracovníkov alebo prácu rozdelíme do etáp. Presný harmonogram dostanete spolu s kalkuláciou.", "Звичайну квартиру або невеликий офіс упораємо за один день. Для більших об’єктів залучаємо більше персоналу або розбиваємо роботу на етапи. Точний графік ви отримаєте разом із кошторисом.") },
      { q: T("Musím dodat úklidové prostředky nebo techniku?", "Do I need to provide cleaning supplies or equipment?", "Musím dodať upratovacie prostriedky alebo techniku?", "Чи потрібно надавати засоби або техніку для прибирання?"), a: T("Ne. Přijíždíme s vlastní profesionální technikou i chemií. Používáme prostředky šetrné k povrchům a vhodné pro komerční prostory.", "No. We arrive with our own professional equipment and chemicals, using products that are gentle on surfaces and suitable for commercial spaces.", "Nie. Prichádzame s vlastnou profesionálnou technikou aj chémiou. Používame prostriedky šetrné k povrchom a vhodné pre komerčné priestory.", "Ні. Ми приїжджаємо з власною професійною технікою та хімією. Засоби безпечні для поверхонь і підходять для комерційних приміщень.") },
      { q: T("Uklízíte i v noci a o víkendech?", "Do you clean at night and on weekends?", "Upratujete aj v noci a cez víkendy?", "Чи прибираєте вночі та у вихідні?"), a: T("Ano, termín přizpůsobíme vašemu provozu. Noční a víkendové úklidy jsou u komerčních klientů nejčastější a neúčtujeme za ně přirážku.", "Yes, we fit the schedule to your operations. Night and weekend cleaning is most common for commercial clients and we do not charge extra for it.", "Áno, termín prispôsobíme vašej prevádzke. Nočné a víkendové upratovania sú u komerčných klientov najčastejšie a neúčtujeme za ne prirážku.", "Так, підлаштовуємо графік під вашу роботу. Нічне та вихідне прибирання є найпоширенішим запитом комерційних клієнтів, і ми не беремо за це доплату.") },
      { q: T("Jak se počítá cena?", "How is the price calculated?", "Ako sa počíta cena?", "Як розраховується ціна?"), a: T("Cena vychází z plochy, stavu objektu a rozsahu prací. Po bezplatné prohlídce dostanete závaznou kalkulaci bez skrytých příplatků.", "The price depends on area, condition of the site and scope of work. After a free survey you get a binding quote with no hidden fees.", "Cena vychádza z plochy, stavu objektu a rozsahu prác. Po bezplatnej obhliadke dostanete záväznú kalkuláciu bez skrytých príplatkov.", "Ціна залежить від площі, стану об’єкта та обсягу робіт. Після безкоштовного огляду ви отримаєте остаточний кошторис без прихованих доплат.") },
      { q: T("Poskytujete i pravidelný úklid?", "Do you also offer regular cleaning?", "Poskytujete aj pravidelné upratovanie?", "Чи надаєте регулярне прибирання?"), a: T("Ano. Po generálním úklidu můžeme nastavit pravidelný servis s harmonogramem, kontrolním seznamem a fotoreportem po každé směně.", "Yes. After the general clean we can set up a regular service with a schedule, checklist and photo report after every shift.", "Áno. Po generálnom upratovaní môžeme nastaviť pravidelný servis s harmonogramom, kontrolným zoznamom a fotoreportom po každej zmene.", "Так. Після генерального прибирання можемо налаштувати регулярний сервіс із графіком, чек-листом і фотозвітом після кожної зміни.") },
    ],
    related: ["uklid-po-stavbe", "myti-oken", "cisteni-a-voskovani-podlah"],
  },

  "uklid-po-stavbe": {
    crumb: T("Úklid po stavbě", "Post-construction cleaning", "Upratovanie po stavbe", "Прибирання після будівництва"),
    h1: T("Úklid po stavbě a rekonstrukci Praha", "Post-construction & renovation cleaning in Prague", "Upratovanie po stavbe a rekonštrukcii Praha", "Прибирання після будівництва та ремонту в Празі"),
    heroSub: T(
      "Kompletní odstranění stavebního prachu a nečistot z novostaveb, rekonstruovaných bytů i kancelářských vestaveb. Předáme prostor připravený k nastěhování.",
      "Complete removal of construction dust and debris from new builds, renovated apartments and office fit-outs. We hand over a space ready to move into.",
      "Kompletné odstránenie stavebného prachu a nečistôt z novostavieb, rekonštruovaných bytov aj kancelárskych vstavieb. Odovzdáme priestor pripravený na nasťahovanie.",
      "Повне видалення будівельного пилу та бруду з новобудов, квартир після ремонту та офісних приміщень. Передаємо об’єкт, готовий до заселення."
    ),
    img: "/images/cases_for_pages/uklid_po_stavbe_po.jpg",
    heroImgAlt: T("Interiér bytu po dokončeném úklidu po rekonstrukci", "Apartment interior after a completed post-renovation clean", "Interiér bytu po dokončenom upratovaní po rekonštrukcii", "Інтер’єр квартири після завершеного прибирання після ремонту"),
    introTitle: T("Proč úklid po stavbě svěřit profesionálům", "Why leave post-construction cleaning to professionals", "Prečo upratovanie po stavbe zveriť profesionálom", "Чому прибирання після будівництва варто довірити професіоналам"),
    intro1: T(
      "Úklid po stavbě je specifická disciplína: jemný stavební prach se usazuje opakovaně a běžné postupy na něj nestačí. Pracujeme ve fázích: od hrubého úklidu a vynesení zbytků materiálu přes vysávání průmyslovými vysavači s HEPA filtrací až po finální mytí všech povrchů, skel a podlah.",
      "Post-construction cleaning is a specific discipline: fine construction dust keeps resettling and standard methods cannot keep up. We work in stages: from a rough clean and removal of leftover material, through vacuuming with industrial HEPA-filtered vacuums, to a final wash of every surface, glass and floor.",
      "Upratovanie po stavbe je špecifická disciplína: jemný stavebný prach sa usadzuje opakovane a bežné postupy naň nestačia. Pracujeme vo fázach: od hrubého upratovania a vynesenia zvyškov materiálu cez vysávanie priemyselnými vysávačmi s HEPA filtráciou až po finálne umývanie všetkých povrchov, skiel a podláh.",
      "Прибирання після будівництва є окремою дисципліною: дрібний будівельний пил осідає повторно, і звичайні методи з ним не справляються. Працюємо поетапно: від грубого прибирання й винесення залишків матеріалів через прибирання промисловими пилососами з HEPA-фільтрацією до фінального миття всіх поверхонь, скла й підлог."
    ),
    intro2: T(
      "Uklízíme novostavby developerských projektů, byty a rodinné domy po rekonstrukci i kancelářské fit-outy. Odstraníme zbytky lepidel, barev, malty a ochranných fólií, aniž bychom poškodili nové povrchy. Cena od 55 Kč/m². Po prohlídce ji fixujeme v závazné kalkulaci.",
      "We clean new-build developer projects, apartments and houses after renovation, and office fit-outs. We remove adhesive, paint, mortar and protective-film residue without damaging new surfaces. Price from 55 CZK/m², fixed in a binding quote after a site survey.",
      "Upratujeme novostavby developerských projektov, byty a rodinné domy po rekonštrukcii aj kancelárske fit-outy. Odstránime zvyšky lepidiel, farieb, malty a ochranných fólií bez poškodenia nových povrchov. Cena od 55 Kč/m². Po obhliadke ju fixujeme v záväznej kalkulácii.",
      "Прибираємо новобудови девелоперських проєктів, квартири й будинки після ремонту, а також офісні приміщення. Видаляємо залишки клею, фарби, розчину й захисної плівки, не пошкоджуючи нові поверхні. Ціна від 55 крон/м². Фіксуємо в остаточному кошторисі після огляду."
    ),
    included: [
      T("Odstranění stavebního prachu ze všech povrchů", "Removal of construction dust from all surfaces", "Odstránenie stavebného prachu zo všetkých povrchov", "Видалення будівельного пилу з усіх поверхонь"),
      T("Mytí oken včetně rámů a parapetů", "Window cleaning including frames and windowsills", "Umývanie okien vrátane rámov a parapetov", "Миття вікон, включно з рамами й підвіконнями"),
      T("Odstranění zbytků lepidel, barev, malty a fólií", "Removal of adhesive, paint, mortar and film residue", "Odstránenie zvyškov lepidiel, farieb, malty a fólií", "Видалення залишків клею, фарби, розчину й плівки"),
      T("Strojové mytí a ošetření podlah", "Machine washing and treatment of floors", "Strojové umývanie a ošetrenie podláh", "Машинне миття та обробка підлог"),
      T("Vyčištění a dezinfekce sanity a kuchyní", "Cleaning and disinfection of sanitary facilities and kitchens", "Vyčistenie a dezinfekcia sanity a kuchýň", "Чищення та дезінфекція сантехніки й кухонь"),
      T("Čištění svítidel, zásuvek a vypínačů", "Cleaning of light fixtures, sockets and switches", "Čistenie svietidiel, zásuviek a vypínačov", "Чищення світильників, розеток і вимикачів"),
      T("Vynesení zbytků stavebního materiálu (po dohodě)", "Removal of leftover construction material (by arrangement)", "Vynesenie zvyškov stavebného materiálu (po dohode)", "Винесення залишків будівельних матеріалів (за домовленістю)"),
    ],
    steps: [
      { n: "01", title: T("Prohlídka stavby", "Site survey", "Obhliadka stavby", "Огляд об’єкта"), text: T("Posoudíme míru znečištění, přístup na stavbu a návaznost na řemesla.", "We assess the level of contamination, site access and coordination with other trades.", "Posúdime mieru znečistenia, prístup na stavbu a nadväznosť na remeslá.", "Оцінюємо рівень забруднення, доступ до об’єкта та узгодження з іншими підрядниками.") },
      { n: "02", title: T("Kalkulace", "Quote", "Kalkulácia", "Кошторис"), text: T("Do 24 hodin obdržíte cenu, harmonogram a rozsah jednotlivých fází.", "You receive the price, schedule and scope of each stage within 24 hours.", "Do 24 hodín dostanete cenu, harmonogram a rozsah jednotlivých fáz.", "Протягом 24 годин отримаєте ціну, графік і обсяг кожного етапу.") },
      { n: "03", title: T("Hrubý úklid", "Rough clean", "Hrubé upratovanie", "Грубе прибирання"), text: T("Vyneseme zbytky materiálu a odstraníme první vrstvu prachu a nečistot.", "We remove leftover material and the first layer of dust and dirt.", "Vynesieme zvyšky materiálu a odstránime prvú vrstvu prachu a nečistôt.", "Виносимо залишки матеріалів і видаляємо перший шар пилу та бруду.") },
      { n: "04", title: T("Jemný úklid", "Fine clean", "Jemné upratovanie", "Чистове прибирання"), text: T("Detailní čištění všech povrchů, skel, podlah a sanity do finálního stavu.", "Detailed cleaning of all surfaces, glass, floors and sanitary ware to a final finish.", "Detailné čistenie všetkých povrchov, skiel, podláh a sanity do finálneho stavu.", "Детальне чищення всіх поверхонь, скла, підлог і сантехніки до фінального стану.") },
      { n: "05", title: T("Předání", "Handover", "Odovzdanie", "Здача"), text: T("Kontrola s objednatelem podle protokolu a fotoreport.", "Inspection with the client per protocol, plus a photo report.", "Kontrola s objednávateľom podľa protokolu a fotoreport.", "Перевірка з замовником за протоколом і фотозвіт.") },
    ],
    priceTitle: T("Ceník úklidu po stavbě", "Post-construction cleaning price list", "Cenník upratovania po stavbe", "Прайс-лист прибирання після будівництва"),
    prices: [
      { name: T("Úklid po stavbě", "Post-construction cleaning", "Upratovanie po stavbe", "Прибирання після будівництва"), price: "55 Kč", unit: "/m²" },
      { name: T("Mytí oken (doplňkově)", "Window cleaning (add-on)", "Umývanie okien (doplnkovo)", "Миття вікон (додатково)"), price: "18 Kč", unit: "/m²", href: "myti-oken" },
      { name: T("Strojové čištění podlah (doplňkově)", "Machine floor cleaning (add-on)", "Strojové čistenie podláh (doplnkovo)", "Машинне чищення підлог (додатково)"), price: "35 Kč", unit: "/m²", href: "cisteni-a-voskovani-podlah" },
    ],
    who: [
      { title: T("Developerské projekty", "Developer projects", "Developerské projekty", "Девелоперські проєкти"), text: T("Úklid bytů a společných prostor před předáním klientům.", "Cleaning apartments and common areas before handover to clients.", "Upratovanie bytov a spoločných priestorov pred odovzdaním klientom.", "Прибирання квартир і місць загального користування перед передачею клієнтам.") },
      { title: T("Byty a domy po rekonstrukci", "Apartments and houses after renovation", "Byty a domy po rekonštrukcii", "Квартири та будинки після ремонту"), text: T("Kompletní odstranění prachu před montáží nábytku a nastěhováním.", "Complete dust removal before furniture assembly and moving in.", "Kompletné odstránenie prachu pred montážou nábytku a nasťahovaním.", "Повне видалення пилу перед складанням меблів і заселенням.") },
      { title: T("Kancelářské fit-outy", "Office fit-outs", "Kancelárske fit-outy", "Офісні приміщення"), text: T("Vestavby a rekonstrukce kanceláří připravíme k prvnímu pracovnímu dni.", "We prepare office renovations and fit-outs for the first working day.", "Vstavby a rekonštrukcie kancelárií pripravíme na prvý pracovný deň.", "Готуємо офісні ремонти й переобладнання до першого робочого дня.") },
      { title: T("Obchodní jednotky před otevřením", "Retail units before opening", "Obchodné jednotky pred otvorením", "Торгові приміщення перед відкриттям"), text: T("Prodejny a provozovny uvedeme do stavu pro kolaudaci i zákazníky.", "We bring shops and premises to a state ready for both approval and customers.", "Predajne a prevádzky uvedieme do stavu na kolaudáciu aj pre zákazníkov.", "Приводимо магазини й приміщення у стан, готовий і до прийомки, і до клієнтів.") },
    ],
    faqs: [
      { q: T("Kdy je nejlepší úklid objednat?", "When is the best time to book the cleaning?", "Kedy je najlepšie upratovanie objednať?", "Коли краще замовити прибирання?"), a: T("Ideálně po dokončení všech řemesel a před montáží nábytku. Termín rezervujte s předstihem. Na stavbu umíme nastoupit do 48 hodin od potvrzení.", "Ideally after all trades have finished and before furniture is installed. Book ahead. We can start on site within 48 hours of confirmation.", "Ideálne po dokončení všetkých remesiel a pred montážou nábytku. Termín rezervujte s predstihom. Na stavbu vieme nastúpiť do 48 hodín od potvrdenia.", "Ідеально після завершення всіх робіт і перед встановленням меблів. Бронюйте заздалегідь. Ми можемо приступити протягом 48 годин після підтвердження.") },
      { q: T("Odvezete i stavební suť?", "Do you remove construction debris too?", "Odveziete aj stavebnú suť?", "Чи вивозите будівельне сміття?"), a: T("Drobné zbytky materiálu vyneseme a zlikvidujeme v rámci úklidu. Kontejnerovou suť řešíme po dohodě jako doplňkovou službu.", "We remove and dispose of small leftover material as part of the cleaning. Skip or container debris is handled by arrangement as an add-on service.", "Drobné zvyšky materiálu vynesieme a zlikvidujeme v rámci upratovania. Kontajnerovú suť riešime po dohode ako doplnkovú službu.", "Дрібні залишки матеріалів виносимо й утилізуємо в рамках прибирання. Вивезення контейнерного сміття вирішуємо за домовленістю як додаткову послугу.") },
      { q: T("Kolik fází úklid má?", "How many stages does the cleaning have?", "Koľko fáz upratovanie má?", "Скільки етапів має прибирання?"), a: T("Standardně dvě: hrubý úklid po skončení prací a finální jemný úklid před předáním. U dlouhých staveb doplňujeme průběžné úklidy.", "Usually two: a rough clean right after work finishes and a final fine clean before handover. For long projects we add interim cleans.", "Štandardne dve: hrubé upratovanie po skončení prác a finálne jemné upratovanie pred odovzdaním. Pri dlhých stavbách dopĺňame priebežné upratovania.", "Зазвичай два: грубе прибирання одразу після завершення робіт і фінальне чистове прибирання перед здачею. Для тривалих проєктів додаємо проміжні прибирання.") },
      { q: T("Nepoškodíte nové povrchy?", "Will you damage the new surfaces?", "Nepoškodíte nové povrchy?", "Чи не пошкодите нові поверхні?"), a: T("Ne. Lepidla, barvy a maltu odstraňujeme prostředky testovanými na daném materiálu. Na skle, dlažbě i sanitě pracujeme bez škrábanců.", "No. We remove adhesive, paint and mortar with products tested on the specific material. We work on glass, tiles and sanitary ware without scratching.", "Nie. Lepidlá, farby a maltu odstraňujeme prostriedkami testovanými na danom materiáli. Na skle, dlažbe aj sanite pracujeme bez škrabancov.", "Ні. Клей, фарбу й розчин видаляємо засобами, перевіреними на конкретному матеріалі. Працюємо зі склом, плиткою та сантехнікою без подряпин.") },
    ],
    related: ["generalni-uklid", "myti-oken", "cisteni-a-voskovani-podlah"],
    gallery: [
      { type: "before-after", before: "/images/cases_for_pages/uklid_po_stavbe_do.jpg", after: "/images/cases_for_pages/uklid_po_stavbe_po.jpg" },
    ],
  },

  "myti-oken": {
    crumb: T("Mytí oken", "Window cleaning", "Umývanie okien", "Миття вікон"),
    h1: T("Mytí oken Praha a okolí", "Window cleaning in Prague and the surrounding area", "Umývanie okien Praha a okolie", "Миття вікон у Празі та околицях"),
    heroSub: T(
      "Čistá skla bez šmouh pro kanceláře, výlohy, bytové domy i domácnosti. Myjeme klasicky i ve výškách, teleskopickými tyčemi s demineralizovanou vodou.",
      "Streak-free glass for offices, shopfronts, apartment buildings and homes. We clean at ground level and at height, with telescopic poles and demineralised water.",
      "Čisté sklá bez šmúh pre kancelárie, výklady, bytové domy aj domácnosti. Umývame klasicky aj vo výškach, teleskopickými tyčami s demineralizovanou vodou.",
      "Чисте скло без розводів для офісів, вітрин, багатоквартирних будинків і приватних домівок. Миємо класично та на висоті, телескопічними штангами з демінералізованою водою."
    ),
    img: "/images/cases_for_pages/myti_oken_po.jpg",
    heroImgAlt: T("Umyté okno bez šmouh po profesionálním mytí oken", "A streak-free window after professional window cleaning", "Umyté okno bez šmúh po profesionálnom umývaní okien", "Вимите вікно без розводів після професійного миття"),
    introTitle: T("Profesionální mytí oken a prosklených ploch", "Professional cleaning of windows and glazed surfaces", "Profesionálne umývanie okien a presklených plôch", "Професійне миття вікон і скляних поверхонь"),
    intro1: T(
      "Profesionální mytí oken vrátí interiéru světlo a budově reprezentativní vzhled. Myjeme skla z obou stran včetně rámů, parapetů a žaluzií. Na běžně nedostupná okna používáme teleskopické tyče s demineralizovanou vodou, která schne beze stop, bez lešení a bez omezení práce v kancelářích.",
      "Professional window cleaning brings light back into an interior and gives a building a presentable look. We clean glass from both sides, including frames, windowsills and blinds. For hard-to-reach windows we use telescopic poles with demineralised water, which dries streak-free, with no scaffolding, no disruption to office work.",
      "Profesionálne umývanie okien vráti interiéru svetlo a budove reprezentatívny vzhľad. Umývame sklá z oboch strán vrátane rámov, parapetov a žalúzií. Na bežne nedostupné okná používame teleskopické tyče s demineralizovanou vodou, ktorá schne bez stôp, bez lešenia a bez obmedzenia práce v kanceláriách.",
      "Професійне миття вікон повертає інтер’єру світло, а будівлі презентабельний вигляд. Миємо скло з обох боків, включно з рамами, підвіконнями та жалюзі. Для важкодоступних вікон використовуємо телескопічні штанги з демінералізованою водою, яка висихає без розводів, без риштувань і без обмеження роботи офісу."
    ),
    intro2: T(
      "Službu poskytujeme jednorázově i pravidelně: kancelářím a administrativním budovám, obchodům s výlohami, restauracím a hotelům, SVJ a bytovým družstvům i rodinným domům. Cena od 18 Kč/m² skla; u pravidelných smluv nabízíme zvýhodněné sazby a pevný harmonogram.",
      "We offer the service one-off or on a regular basis: to offices and administrative buildings, shops with display windows, restaurants and hotels, homeowner associations and housing co-ops, and family houses. Price from 18 CZK/m² of glass; regular contracts come with discounted rates and a fixed schedule.",
      "Službu poskytujeme jednorazovo aj pravidelne: kanceláriám a administratívnym budovám, obchodom s výkladmi, reštauráciám a hotelom, spoločenstvám vlastníkov a bytovým družstvám aj rodinným domom. Cena od 18 Kč/m² skla; pri pravidelných zmluvách ponúkame zvýhodnené sadzby a pevný harmonogram.",
      "Надаємо послугу разово й регулярно: офісам та адміністративним будівлям, магазинам з вітринами, ресторанам і готелям, ОСББ і житловим кооперативам, а також приватним будинкам. Ціна від 18 крон/м² скла; за регулярними договорами пропонуємо пільгові тарифи та фіксований графік."
    ),
    included: [
      T("Mytí skel z obou stran beze šmouh", "Streak-free cleaning of glass on both sides", "Umývanie skiel z oboch strán bez šmúh", "Миття скла з обох боків без розводів"),
      T("Čištění rámů, parapetů a žaluzií", "Cleaning of frames, windowsills and blinds", "Čistenie rámov, parapetov a žalúzií", "Чищення рам, підвіконь і жалюзі"),
      T("Výškové mytí teleskopickými tyčemi s demineralizovanou vodou", "High-level cleaning with telescopic poles and demineralised water", "Výškové umývanie teleskopickými tyčami s demineralizovanou vodou", "Висотне миття телескопічними штангами з демінералізованою водою"),
      T("Odstranění polepů, samolepek a zbytků lepidla", "Removal of stickers, decals and adhesive residue", "Odstránenie polepov, samolepiek a zvyškov lepidla", "Видалення наклейок, стікерів і залишків клею"),
      T("Mytí výloh a prosklených příček", "Cleaning of shopfronts and glazed partitions", "Umývanie výkladov a presklených priečok", "Миття вітрин і скляних перегородок"),
      T("Mytí prosklených fasád (i horolezeckou technikou)", "Cleaning of glazed facades (including rope access)", "Umývanie presklených fasád (aj horolezeckou technikou)", "Миття скляних фасадів (включно з промисловим альпінізмом)"),
    ],
    steps: [
      { n: "01", title: T("Poptávka", "Request", "Dopyt", "Заявка"), text: T("Pošlete plochu a typ oken. Orientační cenu sdělíme obratem.", "Send us the area and window type. We will give you an indicative price right away.", "Pošlite plochu a typ okien. Orientačnú cenu oznámime obratom.", "Надішліть площу і тип вікон. Орієнтовну ціну повідомимо одразу.") },
      { n: "02", title: T("Zaměření", "Measurement", "Zameranie", "Замір"), text: T("U větších objektů plochy zdarma zaměříme a upřesníme přístup.", "For larger sites we measure the area for free and confirm access.", "Pri väčších objektoch plochy zdarma zameriame a upresníme prístup.", "Для великих об’єктів безкоштовно заміряємо площу та уточнимо доступ.") },
      { n: "03", title: T("Termín dle provozu", "Schedule to fit your operations", "Termín podľa prevádzky", "Термін під ваш графік"), text: T("Myjeme brzy ráno, večer i o víkendu, aby vás práce neomezila.", "We clean early morning, evening or weekends so the work does not disrupt you.", "Umývame skoro ráno, večer aj cez víkend, aby vás práca neobmedzila.", "Миємо рано вранці, увечері та у вихідні, щоб робота вас не обмежувала.") },
      { n: "04", title: T("Mytí a kontrola", "Cleaning & check", "Umývanie a kontrola", "Миття і перевірка"), text: T("Provedeme mytí, zkontrolujeme kvalitu a předáme výsledek.", "We clean, check the quality and hand over the result.", "Vykonáme umývanie, skontrolujeme kvalitu a odovzdáme výsledok.", "Виконуємо миття, перевіряємо якість і передаємо результат.") },
    ],
    priceTitle: T("Ceník mytí oken", "Window cleaning price list", "Cenník umývania okien", "Прайс-лист миття вікон"),
    prices: [
      { name: T("Mytí oken", "Window cleaning", "Umývanie okien", "Миття вікон"), price: "18 Kč", unit: "/m²" },
      { name: T("Mytí výloh", "Shopfront cleaning", "Umývanie výkladov", "Миття вітрин"), price: "18 Kč", unit: "/m²" },
      { name: T("Mytí fasád (vč. prosklených)", "Facade washing (incl. glazing)", "Umývanie fasád (vr. presklených)", "Миття фасадів (включно зі склом)"), price: "70 Kč", unit: "/m²", href: "myti-fasad" },
    ],
    who: [
      { title: T("Kanceláře a administrativní budovy", "Offices and administrative buildings", "Kancelárie a administratívne budovy", "Офіси та адміністративні будівлі"), text: T("Pravidelné mytí podle smlouvy, včetně vyšších pater.", "Regular cleaning under contract, including upper floors.", "Pravidelné umývanie podľa zmluvy, vrátane vyšších poschodí.", "Регулярне миття за договором, включно з верхніми поверхами.") },
      { title: T("Obchody a výlohy", "Shops and shopfronts", "Obchody a výklady", "Магазини та вітрини"), text: T("Čisté výlohy prodávají. Myjeme je před otevírací dobou.", "Clean shopfronts sell better. We clean them before opening hours.", "Čisté výklady predávajú. Umývame ich pred otváracou dobou.", "Чисті вітрини продають краще. Миємо їх до відкриття.") },
      { title: T("Hotely a restaurace", "Hotels and restaurants", "Hotely a reštaurácie", "Готелі та ресторани"), text: T("Reprezentativní vzhled bez omezení hostů.", "A presentable look without disrupting guests.", "Reprezentatívny vzhľad bez obmedzenia hostí.", "Презентабельний вигляд без обмеження гостей.") },
      { title: T("SVJ a bytové domy", "Homeowner associations & apartment buildings", "Spoločenstvá vlastníkov a bytové domy", "ОСББ і багатоквартирні будинки"), text: T("Společné prosklené plochy, vstupy a zábradlí.", "Shared glazed areas, entrances and railings.", "Spoločné presklené plochy, vstupy a zábradlia.", "Спільні скляні поверхні, входи та поручні.") },
      { title: T("Rodinné domy", "Family houses", "Rodinné domy", "Приватні будинки"), text: T("Sezónní mytí včetně střešních a francouzských oken.", "Seasonal cleaning including roof and French windows.", "Sezónne umývanie vrátane strešných a francúzskych okien.", "Сезонне миття, включно з мансардними та французькими вікнами.") },
    ],
    faqs: [
      { q: T("Jak se počítá plocha oken?", "How is the window area calculated?", "Ako sa počíta plocha okien?", "Як рахується площа вікон?"), a: T("Účtujeme m² skla; mytí z obou stran je v ceně. U členitých oken s příčkami cenu upřesníme po zaměření.", "We charge per m² of glass; cleaning both sides is included in the price. For complex windows with mullions we confirm the price after measuring.", "Účtujeme m² skla; umývanie z oboch strán je v cene. Pri členitých oknách s priečkami cenu upresníme po zameraní.", "Рахуємо м² скла; миття з обох боків входить у ціну. Для вікон зі складною конфігурацією ціну уточнюємо після заміру.") },
      { q: T("Myjete i v zimě?", "Do you clean in winter?", "Umývate aj v zime?", "Миєте взимку?"), a: T("Ano, do teplot kolem −5 °C s prostředky proti namrzání. Ideální období je ale jaro a podzim.", "Yes, down to around −5 °C using anti-freeze products. Spring and autumn are the ideal seasons, though.", "Áno, do teplôt okolo −5 °C s prostriedkami proti namŕzaniu. Ideálne obdobie je však jar a jeseň.", "Так, до температури близько −5 °C із засобами проти обмерзання. Але найкращий період настає навесні та восени.") },
      { q: T("Zvládnete okna ve vyšších patrech?", "Can you handle windows on upper floors?", "Zvládnete okná vo vyšších poschodiach?", "Впораєтесь із вікнами на верхніх поверхах?"), a: T("Teleskopickými tyčemi myjeme bezpečně ze země zhruba do výše 4. podlaží. Výš pracujeme z plošiny nebo horolezeckou technikou.", "With telescopic poles we clean safely from the ground up to roughly the 4th floor. Higher up, we use a lift or rope access.", "Teleskopickými tyčami umývame bezpečne zo zeme zhruba do výšky 4. poschodia. Vyššie pracujeme z plošiny alebo horolezeckou technikou.", "Телескопічними штангами безпечно миємо з землі приблизно до 4-го поверху. Вище працюємо з підйомника або промисловим альпінізмом.") },
      { q: T("Jak často mýt okna v komerčním objektu?", "How often should windows be cleaned at a commercial site?", "Ako často umývať okná v komerčnom objekte?", "Як часто мити вікна в комерційному приміщенні?"), a: T("U kanceláří a výloh doporučujeme 4–6× ročně, u frekventovaných ulic častěji. Nastavíme harmonogram na míru.", "We recommend 4–6 times a year for offices and shopfronts, more often on busy streets. We set up a schedule to suit you.", "Pri kanceláriách a výkladoch odporúčame 4–6× ročne, na frekventovaných uliciach častejšie. Nastavíme harmonogram na mieru.", "Для офісів і вітрин рекомендуємо 4–6 разів на рік, на жвавих вулицях частіше. Налаштуємо графік під вас.") },
    ],
    related: ["myti-fasad", "generalni-uklid", "uklid-po-stavbe"],
    gallery: [
      { type: "before-after", before: "/images/cases_for_pages/myti_oken_do.jpg", after: "/images/cases_for_pages/myti_oken_po.jpg" },
    ],
  },

  "cisteni-koberce-calouneni": {
    crumb: T("Mytí koberců a čištění čalounění", "Carpet and upholstery cleaning", "Čistenie kobercov a čalúnenia", "Чищення килимів та оббивки"),
    h1: T("Mytí koberců a čištění čalounění Praha", "Carpet and upholstery cleaning in Prague", "Čistenie kobercov a čalúnenia Praha", "Чищення килимів та оббивки в Празі"),
    heroSub: T(
      "Extrakční hloubkové čištění koberců, sedaček, kancelářských židlí a matrací. Odstraníme skvrny, alergeny i zápach přímo u vás.",
      "Extraction deep cleaning of carpets, sofas, office chairs and mattresses. We remove stains, allergens and odours right at your location.",
      "Extrakčné hĺbkové čistenie kobercov, sedačiek, kancelárskych stoličiek a matracov. Odstránime škvrny, alergény aj zápach priamo u vás.",
      "Екстракційне глибоке чищення килимів, диванів, офісних крісел і матраців. Видаляємо плями, алергени та запах прямо у вас."
    ),
    img: "/images/services/cisteni-koberce-calouneni.jpg",
    heroImgAlt: T("Extrakční čištění koberce v kancelářském prostoru", "Extraction cleaning of a carpet in an office space", "Extrakčné čistenie koberca v kancelárskom priestore", "Екстракційне чищення килима в офісному приміщенні"),
    introTitle: T("Hloubkové čištění, na které vysavač nestačí", "Deep cleaning that a vacuum cleaner cannot match", "Hĺbkové čistenie, na ktoré vysávač nestačí", "Глибоке чищення, з яким пилосос не впорається"),
    intro1: T(
      "Koberce a čalouněný nábytek zachycují prach, alergeny a pachy, které běžné vysávání neodstraní. Používáme extrakční metodu: čisticí roztok se pod tlakem vpraví hluboko do vlákna a vzápětí se i s nečistotami odsaje. Výsledkem je čistý, oživený materiál bez zbytků chemie.",
      "Carpets and upholstered furniture trap dust, allergens and odours that regular vacuuming cannot remove. We use the extraction method: cleaning solution is injected deep into the fibre under pressure and immediately extracted along with the dirt. The result is a clean, refreshed material with no chemical residue.",
      "Koberce a čalúnený nábytok zachytávajú prach, alergény a pachy, ktoré bežné vysávanie neodstráni. Používame extrakčnú metódu: čistiaci roztok sa pod tlakom vpraví hlboko do vlákna a vzápätí sa aj s nečistotami odsaje. Výsledkom je čistý, oživený materiál bez zvyškov chémie.",
      "Килими та м’які меблі накопичують пил, алергени та запахи, які звичайне пилосмоктання не видаляє. Використовуємо екстракційний метод: чистячий розчин під тиском вводиться глибоко у волокно і одразу відсмоктується разом із бруднем. У результаті матеріал стає чистим і свіжим, без залишків хімії."
    ),
    intro2: T(
      "Čistíme kobercové plochy kanceláří, hotelů a kin, sedací soupravy, kancelářské a jídelní židle i matrace. Pracujeme na místě u klienta. Koberce od 18 Kč/m², čalounění od 400 Kč za kus. Většina materiálů je suchá do 4–6 hodin a hned k použití.",
      "We clean carpeted areas in offices, hotels and cinemas, sofas and armchairs, office and dining chairs, and mattresses. We work on-site at the client premises. Carpets from 18 CZK/m², upholstery from 400 CZK per piece. Most materials are dry within 4–6 hours and ready to use.",
      "Čistíme kobercové plochy kancelárií, hotelov a kín, sedacie súpravy, kancelárske a jedálenské stoličky aj matrace. Pracujeme na mieste u klienta. Koberce od 18 Kč/m², čalúnenie od 400 Kč za kus. Väčšina materiálov je suchá do 4–6 hodín a hneď na použitie.",
      "Чистимо килимові покриття офісів, готелів і кінотеатрів, дивани та крісла, офісні та обідні стільці, а також матраци. Працюємо на місці у клієнта. Килими від 18 крон/м², оббивка від 400 крон за одиницю. Більшість матеріалів висихає за 4–6 годин і одразу готова до використання."
    ),
    included: [
      T("Extrakční hloubkové čištění koberců", "Extraction deep cleaning of carpets", "Extrakčné hĺbkové čistenie kobercov", "Екстракційне глибоке чищення килимів"),
      T("Lokální odstranění skvrn (káva, víno, inkoust…)", "Spot removal of stains (coffee, wine, ink…)", "Lokálne odstránenie škvŕn (káva, víno, atrament…)", "Локальне видалення плям (кава, вино, чорнило…)"),
      T("Čištění sedacích souprav a křesel", "Cleaning of sofas and armchairs", "Čistenie sedacích súprav a kresiel", "Чищення диванів і крісел"),
      T("Čištění kancelářských a jídelních židlí", "Cleaning of office and dining chairs", "Čistenie kancelárskych a jedálenských stoličiek", "Чищення офісних та обідніх стільців"),
      T("Čištění matrací a odstranění alergenů", "Mattress cleaning and allergen removal", "Čistenie matracov a odstránenie alergénov", "Чищення матраців і видалення алергенів"),
      T("Neutralizace zápachu a impregnace proti skvrnám (příplatek)", "Odour neutralisation and stain-guard treatment (add-on)", "Neutralizácia zápachu a impregnácia proti škvrnám (príplatok)", "Нейтралізація запаху та просочення проти плям (додатково)"),
    ],
    steps: [
      { n: "01", title: T("Posouzení materiálu", "Material assessment", "Posúdenie materiálu", "Оцінка матеріалу"), text: T("Určíme typ vlákna a vhodnou technologii čištění.", "We identify the fibre type and the right cleaning technology.", "Určíme typ vlákna a vhodnú technológiu čistenia.", "Визначаємо тип волокна та відповідну технологію чищення.") },
      { n: "02", title: T("Test prostředku", "Product test", "Test prostriedku", "Тест засобу"), text: T("Na skrytém místě ověříme stálost barev a reakci materiálu.", "We test on a hidden spot to check colour-fastness and material reaction.", "Na skrytom mieste overíme stálosť farieb a reakciu materiálu.", "На прихованій ділянці перевіряємо стійкість кольору й реакцію матеріалу.") },
      { n: "03", title: T("Extrakční čištění", "Extraction cleaning", "Extrakčné čistenie", "Екстракційне чищення"), text: T("Hloubkové čištění strojem, lokální skvrny ošetříme zvlášť.", "Deep machine cleaning, with local stains treated separately.", "Hĺbkové čistenie strojom, lokálne škvrny ošetríme zvlášť.", "Глибоке чищення технікою, локальні плями обробляємо окремо.") },
      { n: "04", title: T("Sušení a předání", "Drying & handover", "Sušenie a odovzdanie", "Сушіння і здача"), text: T("Urychlíme sušení a předáme materiál připravený k použití.", "We speed up drying and hand over the material ready to use.", "Urýchlime sušenie a odovzdáme materiál pripravený na použitie.", "Прискорюємо сушіння і передаємо матеріал готовим до використання.") },
    ],
    priceTitle: T("Ceník čištění koberců a čalounění", "Carpet and upholstery cleaning price list", "Cenník čistenia kobercov a čalúnenia", "Прайс-лист чищення килимів та оббивки"),
    prices: [
      { name: T("Mytí koberců", "Carpet cleaning", "Čistenie kobercov", "Чищення килимів"), price: "18 Kč", unit: "/m²" },
      { name: T("Čištění čalounění", "Upholstery cleaning", "Čistenie čalúnenia", "Чищення оббивки"), price: "400 Kč", unit: "/kus" },
    ],
    who: [
      { title: T("Kanceláře", "Offices", "Kancelárie", "Офіси"), text: T("Kobercové plochy a stovky kancelářských židlí čistíme přes noc.", "We clean carpeted areas and hundreds of office chairs overnight.", "Kobercové plochy a stovky kancelárskych stoličiek čistíme cez noc.", "Килимові покриття та сотні офісних стільців чистимо вночі.") },
      { title: T("Hotely a penziony", "Hotels and guesthouses", "Hotely a penzióny", "Готелі та пансіони"), text: T("Koberce na pokojích a chodbách, čalouněný nábytek, matrace.", "Room and corridor carpets, upholstered furniture, mattresses.", "Koberce na izbách a chodbách, čalúnený nábytok, matrace.", "Килими в номерах і коридорах, м’які меблі, матраци.") },
      { title: T("Restaurace a kavárny", "Restaurants and cafés", "Reštaurácie a kaviarne", "Ресторани та кав’ярні"), text: T("Lavice, židle a koberce zbavíme skvrn i pachů z provozu.", "We remove stains and odours from benches, chairs and carpets caused by daily service.", "Lavice, stoličky a koberce zbavíme škvŕn aj pachov z prevádzky.", "Позбавляємо лавки, стільці й килими від плям і запахів після зміни.") },
      { title: T("Domácnosti", "Homes", "Domácnosti", "Приватні домівки"), text: T("Sedací soupravy, koberce a matrace čistíme šetrně k dětem i zvířatům.", "Sofas, carpets and mattresses cleaned gently for children and pets.", "Sedacie súpravy, koberce a matrace čistíme šetrne k deťom aj zvieratám.", "Дивани, килими та матраци чистимо дбайливо для дітей і тварин.") },
    ],
    faqs: [
      { q: T("Jak dlouho koberec schne?", "How long does a carpet take to dry?", "Ako dlho koberec schne?", "Скільки сохне килим?"), a: T("Standardně 4–6 hodin podle materiálu a větrání. S turbo sušením zkrátíme dobu zhruba na 2 hodiny.", "Typically 4–6 hours depending on material and ventilation. With turbo-drying we cut that to around 2 hours.", "Štandardne 4–6 hodín podľa materiálu a vetrania. S turbo sušením skrátime čas zhruba na 2 hodiny.", "Зазвичай 4–6 годин залежно від матеріалу й провітрювання. З турбосушінням скорочуємо час приблизно до 2 годин.") },
      { q: T("Odstraníte každou skvrnu?", "Will every stain come out?", "Odstránite každú škvrnu?", "Видаляєте будь-яку пляму?"), a: T("Většinu ano. U starých fixovaných skvrn (barviva, propálení) výsledek nelze garantovat. Po testu vám řekneme reálné očekávání předem.", "Most will. For old, set-in stains (dyes, burns) we cannot guarantee full removal. We will tell you what to realistically expect after a test.", "Väčšinu áno. Pri starých fixovaných škvrnách (farbivá, prepálenie) výsledok nemožno garantovať. Po teste vám povieme reálne očakávania vopred.", "Більшість плям видаляється. Старі стійкі плями (барвники, пропалення) гарантувати не можемо. Реальні очікування повідомимо заздалегідь після тесту.") },
      { q: T("Je použitá chemie bezpečná pro děti a zvířata?", "Is the chemistry used safe for children and pets?", "Je použitá chémia bezpečná pre deti a zvieratá?", "Чи безпечна хімія для дітей і тварин?"), a: T("Ano. Používáme certifikované prostředky, které se z materiálu beze zbytku odsají. Po uschnutí je povrch zcela bezpečný.", "Yes. We use certified products that are fully extracted from the material. Once dry, the surface is completely safe.", "Áno. Používame certifikované prostriedky, ktoré sa z materiálu bezo zvyšku odsajú. Po uschnutí je povrch úplne bezpečný.", "Так. Використовуємо сертифіковані засоби, які повністю відсмоктуються з матеріалу. Після висихання поверхня повністю безпечна.") },
      { q: T("Musíme před čištěním vyklidit nábytek?", "Do we need to move furniture before cleaning?", "Musíme pred čistením vypratať nábytok?", "Чи потрібно звільняти меблі перед чищенням?"), a: T("Ne. Lehčí kusy přesuneme sami a po vyčištění vrátíme na místo; těžký nábytek čistíme kolem.", "No. We move lighter items ourselves and put them back after cleaning; we clean around heavier furniture.", "Nie. Ľahšie kusy presunieme sami a po vyčistení vrátime na miesto; ťažký nábytok čistíme okolo.", "Ні. Легкі речі переставляємо самі й повертаємо після чищення; важкі меблі чистимо навколо.") },
    ],
    related: ["cisteni-a-voskovani-podlah", "generalni-uklid", "myti-oken"],
    gallery: [
      { type: "before-after", before: "/images/cases_for_pages/myti_kobercu_do.jpg", after: "/images/cases_for_pages/myti_kobercu_po.jpg" },
    ],
  },

  "cisteni-a-voskovani-podlah": {
    crumb: T("Strojové čištění a voskování podlah", "Machine floor cleaning & waxing", "Strojové čistenie a voskovanie podláh", "Машинне чищення та воскування підлог"),
    h1: T("Strojové čištění a voskování podlah Praha", "Machine floor cleaning and waxing in Prague", "Strojové čistenie a voskovanie podláh Praha", "Машинне чищення та воскування підлог у Празі"),
    heroSub: T(
      "Hloubkové strojové mytí PVC, linolea, dlažby i betonu a obnova ochranné voskové vrstvy. Podlahy, které vydrží provoz a dobře vypadají.",
      "Deep machine washing of PVC, linoleum, tiles and concrete, plus restoration of the protective wax layer. Floors that stand up to daily use and look good doing it.",
      "Hĺbkové strojové umývanie PVC, linolea, dlažby aj betónu a obnova ochrannej voskovej vrstvy. Podlahy, ktoré vydržia prevádzku a dobre vyzerajú.",
      "Глибоке машинне миття ПВХ, лінолеуму, плитки й бетону та відновлення захисного воскового шару. Підлоги, які витримують навантаження і добре виглядають."
    ),
    img: "/images/services/cisteni-a-voskovani-podlah.jpg",
    heroImgAlt: T("Strojově vyčištěná a navoskovaná podlaha s rovnoměrným leskem", "A machine-cleaned and waxed floor with an even sheen", "Strojovo vyčistená a navoskovaná podlaha s rovnomerným leskom", "Машинно очищена та навоскована підлога з рівномірним блиском"),
    introTitle: T("Obnova podlah bez výměny krytiny", "Floor restoration without replacing the covering", "Obnova podláh bez výmeny krytiny", "Відновлення підлог без заміни покриття"),
    intro1: T(
      "Tvrdé podlahy v komerčním provozu ztrácejí vzhled a ochrannou vrstvu během několika měsíců. Strojové čištění odstraní zažitou špínu, kterou mopování jen roztírá; voskování pak podlahu uzavře, sjednotí lesk a výrazně zpomalí opotřebení i pronikání nečistot.",
      "Hard floors in commercial use lose their look and protective layer within a few months. Machine cleaning removes ground-in dirt that mopping only smears around; waxing then seals the floor, evens out the gloss and significantly slows wear and dirt penetration.",
      "Tvrdé podlahy v komerčnej prevádzke strácajú vzhľad a ochrannú vrstvu počas niekoľkých mesiacov. Strojové čistenie odstráni zažratú špinu, ktorú mopovanie len rozotrie; voskovanie potom podlahu uzavrie, zjednotí lesk a výrazne spomalí opotrebenie aj prenikanie nečistôt.",
      "Тверді підлоги в комерційних приміщеннях втрачають вигляд і захисний шар за кілька місяців. Машинне чищення видаляє в’їдливий бруд, який протирання лише розмазує; воскування потім закриває підлогу, вирівнює блиск і суттєво уповільнює зношення та проникнення бруду."
    ),
    intro2: T(
      "Pracujeme s jednokotoučovými stroji i podlahovými automaty: umyjeme PVC, linoleum, dlažbu, epoxid i beton. Provádíme kompletní obnovu: stržení starých voskových vrstev (stripování), hloubkové mytí a aplikaci nových polymerových vrstev s vyleštěním. Vhodné pro obchody, školy, zdravotnictví, kanceláře i sklady.",
      "We work with single-disc machines and floor scrubber-driers to clean PVC, linoleum, tile, epoxy and concrete. We carry out full restoration: stripping old wax layers, deep washing and applying new polymer coats with polishing. Suitable for shops, schools, healthcare facilities, offices and warehouses.",
      "Pracujeme s jednokotúčovými strojmi aj podlahovými automatmi: umyjeme PVC, linoleum, dlažbu, epoxid aj betón. Vykonávame kompletnú obnovu: stiahnutie starých voskových vrstiev (stripovanie), hĺbkové umývanie a aplikáciu nových polymérových vrstiev s vyleštením. Vhodné pre obchody, školy, zdravotníctvo, kancelárie aj sklady.",
      "Працюємо з однодисковими машинами та підлогомийними автоматами: миємо ПВХ, лінолеум, плитку, епоксид і бетон. Виконуємо повне відновлення: зняття старих воскових шарів, глибоке миття та нанесення нових полімерних шарів з поліруванням. Підходить для магазинів, шкіл, медичних закладів, офісів і складів."
    ),
    included: [
      T("Strojové mytí PVC, linolea, dlažby a betonu", "Machine washing of PVC, linoleum, tile and concrete", "Strojové umývanie PVC, linolea, dlažby a betónu", "Машинне миття ПВХ, лінолеуму, плитки й бетону"),
      T("Stržení starých voskových vrstev (stripování)", "Stripping of old wax layers", "Stiahnutie starých voskových vrstiev (stripovanie)", "Зняття старих воскових шарів"),
      T("Aplikace polymerového vosku ve 2–3 vrstvách", "Application of polymer wax in 2–3 coats", "Aplikácia polymérového vosku v 2–3 vrstvách", "Нанесення полімерного воску у 2–3 шари"),
      T("Vyleštění vysokootáčkovým strojem", "Polishing with a high-speed machine", "Vyleštenie vysokootáčkovým strojom", "Полірування високошвидкісною машиною"),
      T("Protiskluzové ošetření (po dohodě)", "Anti-slip treatment (by arrangement)", "Protišmykové ošetrenie (po dohode)", "Протиковзка обробка (за домовленістю)"),
      T("Návrh plánu pravidelné údržby", "A proposed regular maintenance plan", "Návrh plánu pravidelnej údržby", "План регулярного обслуговування"),
    ],
    steps: [
      { n: "01", title: T("Prohlídka a test", "Survey & test", "Obhliadka a test", "Огляд і тест"), text: T("Určíme typ krytiny, stav starých vrstev a vhodnou technologii.", "We identify the covering type, condition of old layers and the right technology.", "Určíme typ krytiny, stav starých vrstiev a vhodnú technológiu.", "Визначаємо тип покриття, стан старих шарів і відповідну технологію.") },
      { n: "02", title: T("Kalkulace", "Quote", "Kalkulácia", "Кошторис"), text: T("Cena a harmonogram po sekcích do 24 hodin.", "Price and schedule by section within 24 hours.", "Cena a harmonogram po sekciách do 24 hodín.", "Ціна та графік за секціями протягом 24 годин.") },
      { n: "03", title: T("Stripování a mytí", "Stripping & washing", "Stripovanie a umývanie", "Зняття воску і миття"), text: T("Strhneme staré vosky a hloubkově umyjeme podklad.", "We strip old wax and deep-wash the surface.", "Stiahneme staré vosky a hĺbkovo umyjeme podklad.", "Знімаємо старий віск і глибоко миємо основу.") },
      { n: "04", title: T("Voskování a leštění", "Waxing & polishing", "Voskovanie a leštenie", "Воскування і полірування"), text: T("Naneseme nové ochranné vrstvy a vyleštíme do lesku.", "We apply new protective layers and polish to a shine.", "Nanesieme nové ochranné vrstvy a vyleštíme do lesku.", "Наносимо нові захисні шари та полируємо до блиску.") },
      { n: "05", title: T("Předání", "Handover", "Odovzdanie", "Здача"), text: T("Kontrola kvality a plán údržby, aby výsledek vydržel.", "Quality check and a maintenance plan so the result lasts.", "Kontrola kvality a plán údržby, aby výsledok vydržal.", "Перевірка якості та план обслуговування, щоб результат тримався довше.") },
    ],
    priceTitle: T("Ceník čištění a voskování podlah", "Floor cleaning & waxing price list", "Cenník čistenia a voskovania podláh", "Прайс-лист чищення та воскування підлог"),
    prices: [
      { name: T("Strojové čištění podlah", "Machine floor cleaning", "Strojové čistenie podláh", "Машинне чищення підлог"), price: "35 Kč", unit: "/m²" },
      { name: T("Voskování podlah", "Floor waxing", "Voskovanie podláh", "Воскування підлог"), price: "70 Kč", unit: "/m²" },
    ],
    who: [
      { title: T("Obchody a supermarkety", "Shops and supermarkets", "Obchody a supermarkety", "Магазини та супермаркети"), text: T("Lesklá podlaha ve špičkovém stavu i při vysoké frekvenci zákazníků.", "A shiny floor in top condition even under heavy footfall.", "Lesklá podlaha v špičkovom stave aj pri vysokej frekvencii zákazníkov.", "Блискуча підлога в ідеальному стані навіть при високому потоці клієнтів.") },
      { title: T("Školy a úřady", "Schools and public offices", "Školy a úrady", "Школи та державні установи"), text: T("Obnova PVC a linolea o prázdninách nebo přes víkend.", "PVC and linoleum restoration during holidays or over a weekend.", "Obnova PVC a linolea cez prázdniny alebo cez víkend.", "Відновлення ПВХ і лінолеуму на канікулах або у вихідні.") },
      { title: T("Zdravotnická zařízení", "Healthcare facilities", "Zdravotnícke zariadenia", "Медичні заклади"), text: T("Hygienicky nezávadné ošetření podlah s certifikovanou chemií.", "Hygienically safe floor treatment with certified chemicals.", "Hygienicky nezávadné ošetrenie podláh s certifikovanou chémiou.", "Гігієнічно безпечна обробка підлог сертифікованою хімією.") },
      { title: T("Kanceláře", "Offices", "Kancelárie", "Офіси"), text: T("Sjednocení vzhledu podlah bez nutnosti výměny krytiny.", "A uniform floor look without replacing the covering.", "Zjednotenie vzhľadu podláh bez nutnosti výmeny krytiny.", "Однорідний вигляд підлог без заміни покриття.") },
      { title: T("Sklady a výroba", "Warehouses and production sites", "Sklady a výroba", "Склади та виробництво"), text: T("Strojové mytí betonových a epoxidových ploch.", "Machine washing of concrete and epoxy surfaces.", "Strojové umývanie betónových a epoxidových plôch.", "Машинне миття бетонних та епоксидних поверхонь.") },
    ],
    faqs: [
      { q: T("Jak často je potřeba podlahu voskovat?", "How often does a floor need waxing?", "Ako často je potrebné podlahu voskovať?", "Як часто потрібно воскувати підлогу?"), a: T("Podle zátěže provozu 1–2× ročně; mezi tím stačí průběžné přeleštění. Navrhneme plán údržby na míru vašemu provozu.", "Depending on the load, 1–2 times a year; in between, a re-buff is enough. We propose a maintenance plan tailored to your operation.", "Podľa záťaže prevádzky 1–2× ročne; medzitým stačí priebežné preleštenie. Navrhneme plán údržby na mieru vašej prevádzke.", "Залежно від навантаження 1–2 рази на рік; між ними достатньо проміжного полірування. Запропонуємо план обслуговування під ваше приміщення.") },
      { q: T("Jak dlouho po voskování nesmí být podlaha zatížena?", "How soon after waxing can the floor take a load?", "Ako dlho po voskovaní nesmie byť podlaha zaťažená?", "Як довго після воскування підлогу не можна навантажувати?"), a: T("Pochozí je za 1–2 hodiny, plnou zátěž (nábytek, vozíky) doporučujeme až po 24 hodinách.", "It is walkable after 1–2 hours; we recommend full loading (furniture, trolleys) only after 24 hours.", "Pochôdzna je za 1–2 hodiny, plné zaťaženie (nábytok, vozíky) odporúčame až po 24 hodinách.", "Ходити можна вже за 1–2 години, повне навантаження (меблі, візки) рекомендуємо не раніше ніж за 24 години.") },
      { q: T("Musíme kvůli pracím zavřít provoz?", "Do we have to close the business for the work?", "Musíme kvôli prácam zatvoriť prevádzku?", "Чи потрібно закривати приміщення через роботи?"), a: T("Ne. Pracujeme v noci nebo o víkendu a plochu rozdělíme na sekce, takže provoz běží bez přerušení.", "No. We work at night or on weekends and split the area into sections, so operations continue without interruption.", "Nie. Pracujeme v noci alebo cez víkend a plochu rozdelíme na sekcie, takže prevádzka beží bez prerušenia.", "Ні. Працюємо вночі або у вихідні та ділимо площу на секції, тож робота триває без перерв.") },
      { q: T("Které podlahy voskovat nelze?", "Which floors cannot be waxed?", "Ktoré podlahy voskovať nemožno?", "Які підлоги не можна воскувати?"), a: T("Vosky aplikujeme na PVC, linoleum, kámen a beton. U dřevěných a olejovaných podlah navrhneme jiný vhodný postup ošetření.", "We apply wax to PVC, linoleum, stone and concrete. For wood and oiled floors we recommend a different suitable treatment.", "Vosky aplikujeme na PVC, linoleum, kameň a betón. Pri drevených a olejovaných podlahách navrhneme iný vhodný postup ošetrenia.", "Віск наносимо на ПВХ, лінолеум, камінь і бетон. Для дерев’яних і олійованих підлог пропонуємо інший відповідний спосіб обробки.") },
    ],
    related: ["cisteni-koberce-calouneni", "uklid-garazi-a-hal", "generalni-uklid"],
    gallery: [
      { type: "before-after", before: "/images/cases_for_pages/strojove_cisteni_do.jpg", after: "/images/cases_for_pages/strojove_cisteni_po.jpg" },
    ],
  },

  "uklid-garazi-a-hal": {
    crumb: T("Čištění garáží a úklid hal", "Garage and hall cleaning", "Čistenie garáží a upratovanie hál", "Чищення гаражів і прибирання цехів"),
    h1: T("Čištění garáží a úklid hal Praha", "Garage and hall cleaning in Prague", "Čistenie garáží a upratovanie hál Praha", "Чищення гаражів і прибирання цехів у Празі"),
    heroSub: T(
      "Strojový úklid podzemních garáží, parkovacích domů, skladů a výrobních hal. Velké plochy, výkonná technika, minimální omezení provozu.",
      "Machine cleaning of underground garages, parking structures, warehouses and production halls. Large areas, powerful equipment, minimal disruption to operations.",
      "Strojové upratovanie podzemných garáží, parkovacích domov, skladov a výrobných hál. Veľké plochy, výkonná technika, minimálne obmedzenie prevádzky.",
      "Машинне прибирання підземних гаражів, паркінгів, складів і виробничих цехів. Великі площі, потужна техніка, мінімальне обмеження роботи."
    ),
    img: "/images/cases_for_pages/uklid_hal_po_2.jpg",
    heroImgAlt: T("Uklizená skladová hala po strojovém čištění podlahy", "A cleaned warehouse hall after machine floor scrubbing", "Upratovaná skladová hala po strojovom čistení podlahy", "Прибраний складський цех після машинного чищення підлоги"),
    introTitle: T("Úklid velkých ploch výkonnou technikou", "Cleaning large areas with powerful equipment", "Upratovanie veľkých plôch výkonnou technikou", "Прибирання великих площ потужною технікою"),
    intro1: T(
      "Podlahy garáží a hal snášejí největší zátěž: prach z pneumatik, olejové skvrny, zimní posyp a průmyslové nečistoty. Nasazujeme podlahové mycí automaty, průmyslové vysavače a vysokotlaké čištění. Technologii volíme podle typu povrchu a míry znečištění.",
      "Garage and hall floors take the heaviest load: tyre dust, oil stains, winter grit and industrial dirt. We use floor-washing machines, industrial vacuums and pressure washing, choosing the technology based on surface type and level of soiling.",
      "Podlahy garáží a hál znášajú najväčšiu záťaž: prach z pneumatík, olejové škvrny, zimný posyp a priemyselné nečistoty. Nasadzujeme podlahové umývacie automaty, priemyselné vysávače a vysokotlakové čistenie. Technológiu volíme podľa typu povrchu a miery znečistenia.",
      "Підлоги гаражів і цехів витримують найбільше навантаження: пил від шин, масляні плями, зимовий реагент і промисловий бруд. Використовуємо підлогомийні автомати, промислові пилососи та мийку високого тиску. Технологію обираємо залежно від типу поверхні та рівня забруднення."
    ),
    intro2: T(
      "Uklízíme podzemní garáže bytových domů a SVJ, parkovací domy, logistické sklady, výrobní haly i autoservisy. Garáže čistíme od 9 Kč/m², haly a sklady od 55 Kč/m². Práci plánujeme po sekcích, takže parkování ani provoz nemusí být přerušeny.",
      "We clean underground garages of apartment buildings and homeowner associations, parking structures, logistics warehouses, production halls and car service centres. Garages from 9 CZK/m², halls and warehouses from 55 CZK/m². We plan the work by section, so parking and operations do not need to stop.",
      "Upratujeme podzemné garáže bytových domov a spoločenstiev vlastníkov, parkovacie domy, logistické sklady, výrobné haly aj autoservisy. Garáže čistíme od 9 Kč/m², haly a sklady od 55 Kč/m². Prácu plánujeme po sekciách, takže parkovanie ani prevádzka sa nemusia prerušiť.",
      "Прибираємо підземні гаражі багатоквартирних будинків та ОСББ, паркінги, логістичні склади, виробничі цехи та автосервіси. Гаражі від 9 крон/м², цехи та склади від 55 крон/м². Плануємо роботу по секціях, тож паркування і робота приміщення не мають зупинятись."
    ),
    included: [
      T("Strojové mytí podlah mycími automaty", "Machine washing of floors with scrubber machines", "Strojové umývanie podláh umývacími automatmi", "Машинне миття підлог мийними автоматами"),
      T("Odstranění olejových skvrn a stop pneumatik", "Removal of oil stains and tyre marks", "Odstránenie olejových škvŕn a stôp pneumatík", "Видалення масляних плям і слідів шин"),
      T("Vysokotlaké čištění ramp a parkovacích stání", "Pressure washing of ramps and parking bays", "Vysokotlakové čistenie rámp a parkovacích státí", "Мийка високого тиску рамп і паркомісць"),
      T("Zametání a průmyslové vysávání velkých ploch", "Sweeping and industrial vacuuming of large areas", "Zametanie a priemyselné vysávanie veľkých plôch", "Підмітання та промислове прибирання великих площ"),
      T("Čištění značení, sloupů a soklů", "Cleaning of markings, columns and skirting", "Čistenie značenia, stĺpov a soklov", "Чищення розмітки, колон і плінтусів"),
      T("Úklid venkovních parkovišť (po dohodě)", "Cleaning of outdoor car parks (by arrangement)", "Upratovanie vonkajších parkovísk (po dohode)", "Прибирання зовнішніх паркінгів (за домовленістю)"),
    ],
    steps: [
      { n: "01", title: T("Prohlídka objektu", "Site survey", "Obhliadka objektu", "Огляд об’єкта"), text: T("Zmapujeme plochy, znečištění a možnosti přístupu techniky.", "We map the areas, level of soiling and equipment access.", "Zmapujeme plochy, znečistenie a možnosti prístupu techniky.", "Картуємо площі, рівень забруднення та можливості доступу техніки.") },
      { n: "02", title: T("Plán sekcí", "Sectional plan", "Plán sekcií", "План по секціях"), text: T("Kalkulace a harmonogram tak, aby provoz běžel dál.", "A quote and schedule designed so operations keep running.", "Kalkulácia a harmonogram tak, aby prevádzka bežala ďalej.", "Кошторис і графік так, щоб робота приміщення тривала.") },
      { n: "03", title: T("Realizace po etapách", "Phased work", "Realizácia po etapách", "Поетапне виконання"), text: T("Strojové čištění sekcí podle plánu, včetně nocí a víkendů.", "Machine cleaning by section as planned, including nights and weekends.", "Strojové čistenie sekcií podľa plánu, vrátane nocí a víkendov.", "Машинне чищення секцій за планом, включно з ночами й вихідними.") },
      { n: "04", title: T("Kontrola a fotoreport", "Check & photo report", "Kontrola a fotoreport", "Перевірка і фотозвіт"), text: T("Projdeme výsledek se správcem a zašleme fotoreport.", "We review the result with the site manager and send a photo report.", "Prejdeme výsledok so správcom a zašleme fotoreport.", "Проходимо результат з керуючим і надсилаємо фотозвіт.") },
    ],
    priceTitle: T("Ceník čištění garáží a hal", "Garage and hall cleaning price list", "Cenník čistenia garáží a hál", "Прайс-лист чищення гаражів і цехів"),
    prices: [
      { name: T("Čištění garáží", "Garage cleaning", "Čistenie garáží", "Прибирання гаражів"), price: "9 Kč", unit: "/m²" },
      { name: T("Úklid hal a skladů", "Warehouse & hall cleaning", "Upratovanie hál a skladov", "Прибирання цехів і складів"), price: "55 Kč", unit: "/m²" },
    ],
    who: [
      { title: T("SVJ a bytová družstva", "Homeowner associations & co-ops", "Spoločenstvá vlastníkov a bytové družstvá", "ОСББ і житлові кооперативи"), text: T("Pravidelné čištění podzemních garáží, typicky 2× ročně.", "Regular cleaning of underground garages, typically twice a year.", "Pravidelné čistenie podzemných garáží, typicky 2× ročne.", "Регулярне чищення підземних гаражів, зазвичай двічі на рік.") },
      { title: T("Parkovací domy", "Parking structures", "Parkovacie domy", "Паркінги"), text: T("Úklid po sekcích bez uzavření provozu.", "Sectional cleaning without closing the facility.", "Upratovanie po sekciách bez uzavretia prevádzky.", "Прибирання по секціях без закриття роботи.") },
      { title: T("Logistické sklady", "Logistics warehouses", "Logistické sklady", "Логістичні склади"), text: T("Strojové mytí manipulačních uliček a ploch mezi regály.", "Machine washing of aisles and areas between racking.", "Strojové umývanie manipulačných uličiek a plôch medzi regálmi.", "Машинне миття проходів і площ між стелажами.") },
      { title: T("Výrobní haly", "Production halls", "Výrobné haly", "Виробничі цехи"), text: T("Odstranění průmyslových nečistot podle režimu provozu.", "Removal of industrial dirt to fit your operating schedule.", "Odstránenie priemyselných nečistôt podľa režimu prevádzky.", "Видалення промислового бруду відповідно до режиму роботи.") },
      { title: T("Autoservisy a showroomy", "Car dealerships and showrooms", "Autoservisy a showroomy", "Автосервіси та шоуруми"), text: T("Odmaštění podlah a reprezentativní čistota prodejních ploch.", "Degreasing floors and a presentable, clean sales area.", "Odmastenie podláh a reprezentatívna čistota predajných plôch.", "Знежирення підлог і презентабельна чистота торгових площ.") },
    ],
    faqs: [
      { q: T("Musí se garáž kvůli úklidu uzavřít?", "Does the garage need to close for cleaning?", "Musí sa garáž kvôli upratovaniu uzavrieť?", "Чи потрібно закривати гараж через прибирання?"), a: T("Ne. Plochu rozdělíme na sekce a rezidenty předem informujeme, kdy mají které stání uvolnit. Provoz běží bez přerušení.", "No. We split the area into sections and inform residents in advance which spaces to vacate. Operations continue without interruption.", "Nie. Plochu rozdelíme na sekcie a rezidentov vopred informujeme, kedy majú ktoré státie uvoľniť. Prevádzka beží bez prerušenia.", "Ні. Ділимо площу на секції та заздалегідь повідомляємо мешканців, коли звільнити місця. Робота триває без перерв.") },
      { q: T("Poradíte si s olejovými skvrnami?", "Can you handle oil stains?", "Poradíte si s olejovými škvrnami?", "Впораєтесь із масляними плямами?"), a: T("Ano, používáme průmyslové odmašťovače a tlakové čištění. Staré, hluboko vsáklé skvrny výrazně zesvětlíme; výsledek ukážeme na zkušební ploše.", "Yes, we use industrial degreasers and pressure washing. Old, deeply soaked stains are significantly lightened; we will show you the result on a test area.", "Áno, používame priemyselné odmasťovače a tlakové čistenie. Staré, hlboko vsiaknuté škvrny výrazne zosvetlíme; výsledok ukážeme na skúšobnej ploche.", "Так, використовуємо промислові знежирювачі та мийку високого тиску. Старі, глибоко ввібрані плями суттєво освітлюємо; результат покажемо на тестовій ділянці.") },
      { q: T("Potřebujete na místě vodu a elektřinu?", "Do you need water and electricity on site?", "Potrebujete na mieste vodu a elektrinu?", "Чи потрібні на об’єкті вода й електрика?"), a: T("Ideálně ano, ale technika má vlastní nádrže a baterie, takže úklid zvládneme i v objektech bez přípojek.", "Ideally yes, but our equipment has its own tanks and batteries, so we can clean sites without utility connections too.", "Ideálne áno, ale technika má vlastné nádrže a batérie, takže upratovanie zvládneme aj v objektoch bez prípojok.", "Бажано так, але техніка має власні баки й батареї, тож впораємось навіть без комунікацій.") },
      { q: T("Jak často garáže čistit?", "How often should garages be cleaned?", "Ako často garáže čistiť?", "Як часто чистити гаражі?"), a: T("Doporučujeme 2× ročně: na jaře po zimním posypu a na podzim. U frekventovaných parkovacích domů častěji.", "We recommend twice a year: in spring after winter grit and in autumn. Busy parking structures more often.", "Odporúčame 2× ročne: na jar po zimnom posype a na jeseň. Pri frekventovaných parkovacích domoch častejšie.", "Рекомендуємо двічі на рік: навесні після зимового реагенту та восени. Для жвавих паркінгів частіше.") },
    ],
    related: ["cisteni-a-voskovani-podlah", "uklid-po-stavbe", "myti-fasad"],
    gallery: [
      { type: "before-after", before: "/images/cases_for_pages/uklid_hal_do_2.jpg", after: "/images/cases_for_pages/uklid_hal_po_2.jpg" },
      { type: "photos", images: ["/images/cases_for_pages/uklik_hal_po.jpg", "/images/cases_for_pages/uklid_po_stavbe_do.jpg"] },
    ],
  },

  "myti-fasad": {
    crumb: T("Mytí fasád", "Facade washing", "Umývanie fasád", "Миття фасадів"),
    h1: T("Mytí fasád Praha a Středočeský kraj", "Facade washing in Prague and Central Bohemia", "Umývanie fasád Praha a Stredočeský kraj", "Миття фасадів у Празі та Середньочеському краї"),
    heroSub: T(
      "Šetrné mytí fasád bytových domů, kanceláří i rodinných domů. Odstraníme řasy, plísně a městskou špínu a ošetříme povrch proti novému růstu.",
      "Gentle facade cleaning for apartment buildings, offices and family houses. We remove algae, mould and urban grime and treat the surface against new growth.",
      "Šetrné umývanie fasád bytových domov, kancelárií aj rodinných domov. Odstránime riasy, plesne a mestskú špinu a ošetríme povrch proti novému rastu.",
      "Дбайливе миття фасадів багатоквартирних будинків, офісів і приватних домівок. Видаляємо водорості, пліснявy та міський бруд, обробляємо поверхню проти нового росту."
    ),
    img: "/images/services/myti-fasad.jpg",
    heroImgAlt: T("Mytí fasády budovy z výškové plošiny", "Washing a building facade from an aerial platform", "Umývanie fasády budovy z výškovej plošiny", "Миття фасаду будівлі з висотної платформи"),
    introTitle: T("Čistá fasáda chrání hodnotu budovy", "A clean facade protects the value of a building", "Čistá fasáda chráni hodnotu budovy", "Чистий фасад захищає вартість будівлі"),
    intro1: T(
      "Znečištěná fasáda kazí dojem z budovy a zkracuje životnost omítky: řasy a plísně drží vlhkost a povrch postupně degradují. Myjeme nízkotlakou technologií s biocidními prostředky, které mikroorganismy zničí i v hloubce; u odolných povrchů nasazujeme horkou vodu pod tlakem.",
      "A dirty facade spoils the impression of a building and shortens the plaster lifespan: algae and mould trap moisture and gradually degrade the surface. We wash with low-pressure technology using biocidal products that kill micro-organisms at depth; for more resistant surfaces we use hot water under pressure.",
      "Znečistená fasáda kazí dojem z budovy a skracuje životnosť omietky: riasy a plesne držia vlhkosť a povrch postupne degradujú. Umývame nízkotlakovou technológiou s biocídnymi prostriedkami, ktoré mikroorganizmy zničia aj v hĺbke; pri odolných povrchoch nasadzujeme horúcu vodu pod tlakom.",
      "Забруднений фасад псує враження від будівлі й скорочує термін служби штукатурки: водорості й пліснява утримують вологу і поступово руйнують поверхню. Миємо технологією низького тиску з біоцидними засобами, які знищують мікроорганізми навіть углибині; для стійких поверхонь застосовуємо гарячу воду під тиском."
    ),
    intro2: T(
      "Postup vždy volíme podle materiálu. Zateplené fasády (ETICS) vyžadují jiný tlak než klinker, beton nebo kámen. Pracujeme z plošin, lešení i horolezeckou technikou, takže zvládneme rodinné domy stejně jako výškové budovy. Cena od 70 Kč/m²; po umytí doporučujeme preventivní impregnaci.",
      "We always choose the method by material. Insulated facades (ETICS) need different pressure than clinker, concrete or stone. We work from lifts, scaffolding and rope access, so we handle family houses as well as high-rise buildings. Price from 70 CZK/m²; after washing we recommend a preventive impregnation.",
      "Postup vždy volíme podľa materiálu. Zateplené fasády (ETICS) vyžadujú iný tlak než klinker, betón alebo kameň. Pracujeme z plošín, lešenia aj horolezeckou technikou, takže zvládneme rodinné domy rovnako ako výškové budovy. Cena od 70 Kč/m²; po umytí odporúčame preventívnu impregnáciu.",
      "Метод завжди обираємо залежно від матеріалу. Утеплені фасади (ETICS) потребують іншого тиску, ніж клінкер, бетон чи камінь. Працюємо з підйомників, риштувань та промисловим альпінізмом, тож впораємось як з приватними будинками, так і з висотними будівлями. Ціна від 70 крон/м²; після миття рекомендуємо профілактичне просочення."
    ),
    included: [
      T("Nízkotlaké mytí zateplených fasád (ETICS)", "Low-pressure washing of insulated facades (ETICS)", "Nízkotlakové umývanie zateplených fasád (ETICS)", "Миття утеплених фасадів низьким тиском (ETICS)"),
      T("Odstranění řas, mechů a plísní vč. biocidního ošetření", "Removal of algae, moss and mould with biocidal treatment", "Odstránenie rias, machov a plesní vr. biocídneho ošetrenia", "Видалення водоростей, моху та плісняви з біоцидною обробкою"),
      T("Vysokotlaké mytí betonu, klinkeru a kamene", "High-pressure washing of concrete, clinker and stone", "Vysokotlakové umývanie betónu, klinkeru a kameňa", "Мийка високого тиску бетону, клінкеру й каменю"),
      T("Preventivní impregnace proti novému růstu", "Preventive impregnation against new growth", "Preventívna impregnácia proti novému rastu", "Профілактичне просочення проти нового росту"),
      T("Odstranění graffiti (po dohodě)", "Graffiti removal (by arrangement)", "Odstránenie graffiti (po dohode)", "Видалення графіті (за домовленістю)"),
      T("Práce z plošin i horolezeckou technikou", "Work from lifts and by rope access", "Práca z plošín aj horolezeckou technikou", "Робота з підйомників та промисловим альпінізмом"),
    ],
    steps: [
      { n: "01", title: T("Prohlídka a posouzení", "Survey & assessment", "Obhliadka a posúdenie", "Огляд і оцінка"), text: T("Určíme materiál fasády, míru znečištění a způsob přístupu.", "We identify the facade material, level of soiling and access method.", "Určíme materiál fasády, mieru znečistenia a spôsob prístupu.", "Визначаємо матеріал фасаду, рівень забруднення та спосіб доступу.") },
      { n: "02", title: T("Kalkulace", "Quote", "Kalkulácia", "Кошторис"), text: T("Cena podle plochy a technologie do 24 hodin.", "Price by area and technology within 24 hours.", "Cena podľa plochy a technológie do 24 hodín.", "Ціна за площею і технологією протягом 24 годин.") },
      { n: "03", title: T("Zkušební plocha", "Test area", "Skúšobná plocha", "Тестова ділянка"), text: T("Na malém úseku ověříme postup a ukážeme výsledek.", "We verify the method on a small section and show you the result.", "Na malom úseku overíme postup a ukážeme výsledok.", "Перевіряємо метод на невеликій ділянці і показуємо результат.") },
      { n: "04", title: T("Mytí a ošetření", "Washing & treatment", "Umývanie a ošetrenie", "Миття та обробка"), text: T("Umyjeme celou fasádu a aplikujeme ochranné prostředky.", "We wash the whole facade and apply protective products.", "Umyjeme celú fasádu a aplikujeme ochranné prostriedky.", "Миємо весь фасад і наносимо захисні засоби.") },
      { n: "05", title: T("Předání", "Handover", "Odovzdanie", "Здача"), text: T("Kontrola výsledku a doporučení další péče.", "We review the result and recommend further care.", "Kontrola výsledku a odporúčania ďalšej starostlivosti.", "Перевірка результату та рекомендації щодо подальшого догляду.") },
    ],
    priceTitle: T("Ceník mytí fasád", "Facade washing price list", "Cenník umývania fasád", "Прайс-лист миття фасадів"),
    prices: [
      { name: T("Mytí fasád", "Facade washing", "Umývanie fasád", "Миття фасадів"), price: "70 Kč", unit: "/m²" },
      { name: T("Mytí oken (doplňkově)", "Window cleaning (add-on)", "Umývanie okien (doplnkovo)", "Миття вікон (додатково)"), price: "18 Kč", unit: "/m²", href: "myti-oken" },
    ],
    who: [
      { title: T("SVJ a bytové domy", "Homeowner associations & apartment buildings", "Spoločenstvá vlastníkov a bytové domy", "ОСББ і багатоквартирні будинки"), text: T("Mytí fasád panelových i zděných domů včetně lodžií.", "Washing of panel and brick building facades, including balconies.", "Umývanie fasád panelových aj murovaných domov vrátane loggií.", "Миття фасадів панельних і цегляних будинків, включно з балконами.") },
      { title: T("Administrativní budovy", "Administrative buildings", "Administratívne budovy", "Адміністративні будівлі"), text: T("Reprezentativní vzhled sídla bez lešení a dlouhých omezení.", "A presentable head-office look without scaffolding or long disruption.", "Reprezentatívny vzhľad sídla bez lešenia a dlhých obmedzení.", "Презентабельний вигляд офісу без риштувань і тривалих обмежень.") },
      { title: T("Hotely a penziony", "Hotels and guesthouses", "Hotely a penzióny", "Готелі та пансіони"), text: T("První dojem hostů začíná u fasády.", "Guests’ first impression starts with the facade.", "Prvý dojem hostí začína pri fasáde.", "Перше враження гостей починається з фасаду.") },
      { title: T("Rodinné domy", "Family houses", "Rodinné domy", "Приватні будинки"), text: T("Odstranění zelených map ze zateplených fasád.", "Removal of green patches from insulated facades.", "Odstránenie zelených máp zo zateplených fasád.", "Видалення зелених плям з утеплених фасадів.") },
      { title: T("Průmyslové objekty", "Industrial sites", "Priemyselné objekty", "Промислові об’єкти"), text: T("Vysokotlaké mytí hal, opláštění a betonových konstrukcí.", "High-pressure washing of halls, cladding and concrete structures.", "Vysokotlakové umývanie hál, opláštenia a betónových konštrukcií.", "Мийка високого тиску цехів, обшивки та бетонних конструкцій.") },
    ],
    faqs: [
      { q: T("Nepoškodí mytí zateplenou fasádu?", "Will washing damage an insulated facade?", "Nepoškodí umývanie zateplenú fasádu?", "Чи не пошкодить миття утеплений фасад?"), a: T("Ne. ETICS myjeme nízkým tlakem a vhodnou chemií; postup vždy ověříme na zkušební ploše, než začneme s celou fasádou.", "No. We wash ETICS with low pressure and suitable chemistry; we always verify the method on a test area before doing the whole facade.", "Nie. ETICS umývame nízkym tlakom a vhodnou chémiou; postup vždy overíme na skúšobnej ploche, než začneme s celou fasádou.", "Ні. ETICS миємо низьким тиском і відповідною хімією; метод завжди перевіряємо на тестовій ділянці, перш ніж мити весь фасад.") },
      { q: T("Kdy je nejlepší období na mytí fasády?", "What is the best time of year to wash a facade?", "Kedy je najlepšie obdobie na umývanie fasády?", "Коли найкраще мити фасад?"), a: T("Duben až říjen, při teplotách nad 5 °C, kdy biocidní prostředky působí nejúčinněji.", "April to October, at temperatures above 5 °C, when biocidal products work best.", "Apríl až október, pri teplotách nad 5 °C, keď biocídne prostriedky pôsobia najúčinnejšie.", "З квітня по жовтень, за температури понад 5 °C, саме тоді біоцидні засоби діють найефективніше.") },
      { q: T("Je potřeba stavět lešení?", "Do you need to put up scaffolding?", "Je potrebné stavať lešenie?", "Чи потрібно ставити риштування?"), a: T("Většinou ne. Pracujeme z pojízdných plošin nebo horolezeckou technikou, což je rychlejší i levnější.", "Usually not. We work from mobile lifts or by rope access, which is faster and cheaper.", "Väčšinou nie. Pracujeme z pojazdných plošín alebo horolezeckou technikou, čo je rýchlejšie aj lacnejšie.", "Здебільшого ні. Працюємо з мобільних підйомників або промисловим альпінізмом. Це швидше і дешевше.") },
      { q: T("Jak dlouho výsledek vydrží?", "How long does the result last?", "Ako dlho výsledok vydrží?", "Як довго тримається результат?"), a: T("S preventivní impregnací zůstává fasáda čistá zpravidla 3–5 let podle orientace a okolní zeleně.", "With a preventive impregnation the facade typically stays clean for 3–5 years, depending on orientation and nearby vegetation.", "S preventívnou impregnáciou zostáva fasáda čistá spravidla 3–5 rokov podľa orientácie a okolitej zelene.", "З профілактичним просоченням фасад зазвичай залишається чистим 3–5 років залежно від орієнтації та навколишньої зелені.") },
    ],
    related: ["myti-oken", "uklid-garazi-a-hal", "generalni-uklid"],
  },

  "renovace-mramoru": {
    crumb: T("Renovace mramoru", "Marble renovation", "Renovácia mramoru", "Регенерація мармуру"),
    h1: T("Renovace a leštění mramoru Praha", "Marble renovation and polishing in Prague", "Renovácia a leštenie mramoru Praha", "Регенерація та полірування мармуру в Празі"),
    heroSub: T(
      "Broušení, leštění a impregnace mramorových podlah, schodišť a parapetů. Odstraníme škrábance, matná místa i skvrny od kyselin. Kalkulace zdarma do 24 hodin.",
      "Grinding, polishing and impregnation of marble floors, staircases and windowsills. We remove scratches, dull patches and acid stains. Free quote within 24 hours.",
      "Brúsenie, leštenie a impregnácia mramorových podláh, schodísk a parapetov. Odstránime škrabance, matné miesta aj škvrny od kyselín. Kalkulácia zdarma do 24 hodín.",
      "Шліфування, полірування та імпрегнація мармурових підлог, сходів і підвіконь. Видаляємо подряпини, матові плями та плями від кислот. Безкоштовний кошторис протягом 24 годин."
    ),
    img: "/images/stone-renovation.jpg",
    heroImgAlt: T("Vyleštěná mramorová podlaha po renovaci a impregnaci", "A polished marble floor after restoration and impregnation", "Vyleštená mramorová podlaha po renovácii a impregnácii", "Відполірована мармурова підлога після реставрації та імпрегнації"),
    introTitle: T("Jak probíhá renovace mramoru", "How marble renovation works", "Ako prebieha renovácia mramoru", "Як проходить регенерація мармуру"),
    intro1: T(
      "Mramor je měkký a citlivý na kyseliny: ocet, víno nebo čisticí prostředky s nízkým pH ho matují a leptají povrch. Renovaci zahajujeme diagnostikou hloubky poškození, poté následuje hrubé nebo jemné broušení diamantovými kotouči a krystalizace, která povrch zpevní a vrátí mu zrcadlový lesk.",
      "Marble is soft and sensitive to acids: vinegar, wine or low-pH cleaning products dull it and etch the surface. We start renovation with a diagnosis of the damage depth, followed by coarse or fine diamond grinding and crystallisation, which hardens the surface and restores a mirror shine.",
      "Mramor je mäkký a citlivý na kyseliny: ocot, víno alebo čistiace prostriedky s nízkym pH ho matujú a leptajú povrch. Renováciu začíname diagnostikou hĺbky poškodenia, potom nasleduje hrubé alebo jemné brúsenie diamantovými kotúčmi a kryštalizácia, ktorá povrch spevní a vráti mu zrkadlový lesk.",
      "Мармур м’який і чутливий до кислот: оцет, вино чи засоби для чищення з низьким pH матують і роз’їдають поверхню. Регенерацію починаємо з діагностики глибини пошкодження, потім груба або тонка алмазна шліфовка й кристалізація, яка зміцнює поверхню та повертає дзеркальний блиск."
    ),
    intro2: T(
      "Renovujeme mramorové podlahy, schodiště, parapety, desky a obklady v bytech, hotelových lobby, koupelnách i obchodních prostorech. Po broušení a leštění aplikujeme impregnaci, která povrch chrání proti novým skvrnám a usnadňuje běžný úklid. Cena od 180 Kč/m². Po prohlídce ji fixujeme v závazné kalkulaci.",
      "We renovate marble floors, staircases, windowsills, countertops and cladding in apartments, hotel lobbies, bathrooms and commercial spaces. After grinding and polishing we apply an impregnation that protects the surface from new stains and makes routine cleaning easier. Price from 180 CZK/m², fixed in a binding quote after a site survey.",
      "Renovujeme mramorové podlahy, schodiská, parapety, dosky a obklady v bytoch, hotelových lobby, kúpeľniach aj obchodných priestoroch. Po brúsení a leštení aplikujeme impregnáciu, ktorá povrch chráni proti novým škvrnám a uľahčuje bežné upratovanie. Cena od 180 Kč/m². Po obhliadke ju fixujeme v záväznej kalkulácii.",
      "Регенеруємо мармурові підлоги, сходи, підвіконня, стільниці й облицювання в квартирах, готельних лобі, ванних кімнатах і комерційних приміщеннях. Після шліфування й полірування наносимо імпрегнацію, яка захищає поверхню від нових плям і полегшує повсякденне прибирання. Ціна від 180 крон/м². Фіксуємо в остаточному кошторисі після огляду."
    ),
    included: [
      T("Diagnostika poškození a výběr zrnitosti broušení", "Damage diagnosis and grit selection for grinding", "Diagnostika poškodenia a výber zrnitosti brúsenia", "Діагностика пошкоджень і вибір зернистості шліфування"),
      T("Hrubé i jemné broušení diamantovými kotouči", "Coarse and fine diamond grinding", "Hrubé aj jemné brúsenie diamantovými kotúčmi", "Груба й тонка алмазна шліфовка"),
      T("Krystalizace pro zrcadlový lesk a tvrdší povrch", "Crystallisation for a mirror shine and a harder surface", "Kryštalizácia pre zrkadlový lesk a tvrdší povrch", "Кристалізація для дзеркального блиску й твердішої поверхні"),
      T("Odstranění skvrn od kyselin, rzi a vodního kamene", "Removal of acid stains, rust and limescale", "Odstránenie škvŕn od kyselín, hrdze a vodného kameňa", "Видалення плям від кислот, іржі та накипу"),
      T("Impregnace proti skvrnám a snadnější údržba", "Stain-protection impregnation for easier maintenance", "Impregnácia proti škvrnám a jednoduchšia údržba", "Імпрегнація проти плям для легшого догляду"),
      T("Tmelení prasklin a spár na míru odstínu kamene", "Crack and joint filling matched to the stone shade", "Tmelenie prasklín a škár na mieru odtieňa kameňa", "Затирання тріщин і швів під колір каменю"),
    ],
    steps: [
      { n: "01", title: T("Poptávka", "Request", "Dopyt", "Заявка"), text: T("Zavoláte nebo vyplníte formulář. Manažer se ozve ještě týž pracovní den.", "Call us or fill in the form. A manager will get back to you the same business day.", "Zavoláte alebo vyplníte formulár. Manažér sa ozve ešte v ten istý pracovný deň.", "Зателефонуйте або заповніть форму. Менеджер зв’яжеться з вами того ж робочого дня.") },
      { n: "02", title: T("Prohlídka a test", "Survey & test patch", "Obhliadka a test", "Огляд і тестова ділянка"), text: T("Zdarma posoudíme stav mramoru a na malé ploše ověříme postup.", "We assess the marble's condition for free and verify the method on a small test patch.", "Zdarma posúdime stav mramoru a na malej ploche overíme postup.", "Безкоштовно оцінимо стан мармуру та перевіримо метод на невеликій ділянці.") },
      { n: "03", title: T("Kalkulace a termín", "Estimate & date", "Kalkulácia a termín", "Кошторис і термін"), text: T("Do 24 hodin obdržíte závaznou cenovou nabídku a harmonogram.", "You receive a binding quote and schedule within 24 hours.", "Do 24 hodín dostanete záväznú cenovú ponuku a harmonogram.", "Протягом 24 годин ви отримаєте остаточну цінову пропозицію та графік.") },
      { n: "04", title: T("Broušení a krystalizace", "Grinding & crystallisation", "Brúsenie a kryštalizácia", "Шліфування та кристалізація"), text: T("Postupné broušení v několika zrnitostech a krystalizace do vysokého lesku.", "Progressive grinding through several grits and crystallisation to a high gloss.", "Postupné brúsenie vo viacerých zrnitostiach a kryštalizácia do vysokého lesku.", "Поступова шліфовка кількома зернистостями та кристалізація до високого блиску.") },
      { n: "05", title: T("Impregnace a předání", "Impregnation & handover", "Impregnácia a odovzdanie", "Імпрегнація та здача"), text: T("Aplikujeme impregnaci a předáme výsledek s fotoreportem.", "We apply the impregnation and hand over the result with a photo report.", "Aplikujeme impregnáciu a odovzdáme výsledok s fotoreportom.", "Наносимо імпрегнацію та здаємо результат з фотозвітом.") },
    ],
    priceTitle: T("Ceník renovace mramoru", "Marble renovation price list", "Cenník renovácie mramoru", "Прайс-лист регенерації мармуру"),
    prices: [
      { name: T("Hrubé broušení + leštění", "Coarse grinding + polishing", "Hrubé brúsenie + leštenie", "Груба шліфовка + полірування"), price: "1300 Kč", unit: "/m²" },
      { name: T("Přebroušení + leštění", "Re-grinding + polishing", "Prebrúsenie + leštenie", "Перешліфовка + полірування"), price: "800 Kč", unit: "/m²" },
      { name: T("Leštění", "Polishing", "Leštenie", "Полірування"), price: "350 Kč", unit: "/m²" },
      { name: T("Mytí + impregnace", "Washing + impregnation", "Umývanie + impregnácia", "Миття + імпрегнація"), price: "180 Kč", unit: "/m²" },
    ],
    who: [
      { title: T("Byty a rodinné domy", "Apartments and family houses", "Byty a rodinné domy", "Квартири та приватні будинки"), text: T("Obnovíme mramorové podlahy, schodiště a parapety do původního lesku.", "We restore marble floors, staircases and windowsills to their original shine.", "Obnovíme mramorové podlahy, schodiská a parapety do pôvodného lesku.", "Відновлюємо мармурові підлоги, сходи й підвіконня до початкового блиску.") },
      { title: T("Hotely a lobby", "Hotels and lobbies", "Hotely a lobby", "Готелі та лобі"), text: T("Reprezentativní vzhled vstupních prostor bez omezení hostů.", "A presentable entrance area without disrupting guests.", "Reprezentatívny vzhľad vstupných priestorov bez obmedzenia hostí.", "Презентабельний вигляд вестибюлів без обмеження гостей.") },
      { title: T("Koupelny a wellness", "Bathrooms and wellness areas", "Kúpeľne a wellness", "Ванні кімнати та wellness-зони"), text: T("Odstraníme skvrny od vodního kamene a kosmetiky, obnovíme impregnaci.", "We remove limescale and cosmetics stains and renew the impregnation.", "Odstránime škvrny od vodného kameňa a kozmetiky, obnovíme impregnáciu.", "Видаляємо плями від накипу та косметики, оновлюємо імпрегнацію.") },
      { title: T("Obchodní prostory", "Commercial spaces", "Obchodné priestory", "Комерційні приміщення"), text: T("Práce mimo otevírací dobu, aby nedošlo k omezení provozu.", "Work outside opening hours, so business operations are never disrupted.", "Práce mimo otváracích hodín, aby nedošlo k obmedzeniu prevádzky.", "Роботи поза робочим часом, щоб не заважати роботі закладу.") },
    ],
    faqs: [
      { q: T("Proč mramor časem ztrácí lesk?", "Why does marble lose its shine over time?", "Prečo mramor časom stráca lesk?", "Чому мармур із часом втрачає блиск?"), a: T("Mramor je vápenatý kámen citlivý na kyseliny a mechanické opotřebení. Chůze, písek a kyselé čisticí prostředky postupně leptají a matují povrch.", "Marble is a calcium-based stone sensitive to acids and mechanical wear. Foot traffic, sand and acidic cleaning products gradually etch and dull the surface.", "Mramor je vápenatý kameň citlivý na kyseliny a mechanické opotrebenie. Chôdza, piesok a kyslé čistiace prostriedky postupne leptajú a matujú povrch.", "Мармур є вапнистим каменем, чутливим до кислот і механічного зношення. Ходіння, пісок і кислотні засоби для чищення поступово роз’їдають і матують поверхню.") },
      { q: T("Jde odstranit hluboké škrábance?", "Can deep scratches be removed?", "Dajú sa odstrániť hlboké škrabance?", "Чи можна прибрати глибокі подряпини?"), a: T("Ano, hlubší škrábance a matná místa odstraníme hrubším broušením, které povrch zarovná, a následným leštěním do vysokého lesku.", "Yes, deeper scratches and dull patches are removed with coarser grinding that levels the surface, followed by polishing to a high gloss.", "Áno, hlbšie škrabance a matné miesta odstránime hrubším brúsením, ktoré povrch zarovná, a následným leštením do vysokého lesku.", "Так, глибші подряпини й матові плями видаляємо грубішою шліфовкою, яка вирівнює поверхню, з подальшим поліруванням до високого блиску.") },
      { q: T("Jak často opakovat impregnaci?", "How often should the impregnation be repeated?", "Ako často opakovať impregnáciu?", "Як часто повторювати імпрегнацію?"), a: T("V interiéru obvykle jednou za 1–2 roky, u exponovaných ploch jako kuchyňské desky nebo vstupní haly i jednou ročně.", "Indoors typically every 1–2 years; for exposed surfaces such as kitchen countertops or entrance halls, once a year.", "V interiéri obvykle raz za 1–2 roky, pri exponovaných plochách ako kuchynské dosky alebo vstupné haly aj raz ročne.", "У приміщенні зазвичай раз на 1–2 роки, для експонованих поверхонь, як-от кухонні стільниці чи вестибюлі, навіть щороку.") },
      { q: T("Můžete pracovat i v obydleném bytě?", "Can you work in an occupied apartment?", "Môžete pracovať aj v obývanom byte?", "Чи можете працювати в заселеній квартирі?"), a: T("Ano. Pracovní plochu ohraničíme a chráníme okolní nábytek, práce probíhá bez zápachu díky vodou chlazenému broušení.", "Yes. We cordon off the work area and protect surrounding furniture; the work is odourless thanks to water-cooled grinding.", "Áno. Pracovnú plochu ohraničíme a chránime okolitý nábytok, práca prebieha bez zápachu vďaka vodou chladenému brúseniu.", "Так. Обмежуємо робочу зону та захищаємо навколишні меблі, робота проходить без запаху завдяки шліфуванню з водяним охолодженням.") },
      { q: T("Renovujete i mramorové kuchyňské desky?", "Do you also renovate marble kitchen countertops?", "Renovujete aj mramorové kuchynské dosky?", "Чи регенеруєте мармурові кухонні стільниці?"), a: T("Ano, včetně odstranění skvrn od potravin a nožů a obnovení odolné impregnace proti novým skvrnám.", "Yes, including removal of food and knife stains and renewal of a durable stain-resistant impregnation.", "Áno, vrátane odstránenia škvŕn od potravín a nožov a obnovenia odolnej impregnácie proti novým škvrnám.", "Так, включно з видаленням плям від їжі та ножів і оновленням стійкої імпрегнації проти нових плям.") },
    ],
    related: ["renovace-zuly", "renovace-terasy"],
    gallery: [
      { type: "before-after", before: "/images/cases_for_pages/renovace_mramoru_do.jpg", after: "/images/cases_for_pages/renovace_mramoru_po.jpg" },
      { type: "before-after", before: "/images/cases_for_pages/renovace_mramoru1_do.jpg", after: "/images/cases_for_pages/renovace_mramoru1_po.jpg" },
    ],
  },

  "renovace-zuly": {
    crumb: T("Renovace žuly", "Granite renovation", "Renovácia žuly", "Регенерація граніту"),
    h1: T("Renovace a leštění žuly Praha", "Granite renovation and polishing in Prague", "Renovácia a leštenie žuly Praha", "Регенерація та полірування граніту в Празі"),
    heroSub: T(
      "Broušení, leštění a impregnace žulových podlah, schodů a desek. Odolný lesk na roky, i ve vysoce zatížených prostorech. Kalkulace zdarma do 24 hodin.",
      "Grinding, polishing and impregnation of granite floors, steps and countertops. A durable shine for years, even in high-traffic areas. Free quote within 24 hours.",
      "Brúsenie, leštenie a impregnácia žulových podláh, schodov a dosiek. Odolný lesk na roky, aj vo vysoko zaťažených priestoroch. Kalkulácia zdarma do 24 hodín.",
      "Шліфування, полірування та імпрегнація гранітних підлог, сходів і стільниць. Стійкий блиск на роки навіть у зонах з високим навантаженням. Безкоштовний кошторис протягом 24 годин."
    ),
    img: "/images/cases_for_pages/renovace_zuly_1_po.jpg",
    heroImgAlt: T("Vyleštěná žulová podlaha po broušení a leštění", "A polished granite floor after grinding and polishing", "Vyleštená žulová podlaha po brúsení a leštení", "Відполірована гранітна підлога після шліфування та полірування"),
    introTitle: T("Jak probíhá renovace žuly", "How granite renovation works", "Ako prebieha renovácia žuly", "Як проходить регенерація граніту"),
    intro1: T(
      "Žula je výrazně tvrdší a odolnější než mramor, přesto v čase ztrácí lesk vlivem provozního opotřebení, usazené špíny v pórech a vysprávek po starých impregnacích. Renovaci provádíme diamantovým broušením v postupných zrnitostech a leštěním, které povrchu vrátí jednotný, hluboký lesk.",
      "Granite is significantly harder and more durable than marble, yet it still loses its shine over time from foot traffic, dirt embedded in the pores and residue from old impregnations. We renovate it with diamond grinding through progressive grits and polishing that restores a uniform, deep shine.",
      "Žula je výrazne tvrdšia a odolnejšia než mramor, napriek tomu časom stráca lesk vplyvom prevádzkového opotrebenia, usadenej špiny v póroch a zvyškov po starých impregnáciách. Renováciu vykonávame diamantovým brúsením v postupných zrnitostiach a leštením, ktoré povrchu vráti jednotný, hlboký lesk.",
      "Граніт значно твердіший і міцніший за мармур, проте з часом втрачає блиск через експлуатаційне зношення, забрудненість пор і залишки старих просочень. Регенеруємо алмазною шліфовкою поступовими зернистостями та поліруванням, яке повертає рівномірний, глибокий блиск."
    ),
    intro2: T(
      "Renovujeme žulové podlahy vstupních hal, schodiště, venkovní obklady i kuchyňské a pracovní desky v komerčních i obytných objektech. Vzhledem k tvrdosti materiálu je žula ideální i pro exteriéry a vysoce zatížené plochy. Po vyleštění povrch impregnujeme proti mastnotě a nečistotám. Cena od 250 Kč/m². Po prohlídce ji fixujeme v závazné kalkulaci.",
      "We renovate granite floors in entrance halls, staircases, outdoor cladding and kitchen or work countertops in both commercial and residential buildings. Thanks to its hardness, granite is also ideal for exteriors and high-traffic areas. After polishing we impregnate the surface against grease and dirt. Price from 250 CZK/m², fixed in a binding quote after a site survey.",
      "Renovujeme žulové podlahy vstupných hál, schodiská, vonkajšie obklady aj kuchynské a pracovné dosky v komerčných aj obytných objektoch. Vzhľadom na tvrdosť materiálu je žula ideálna aj pre exteriéry a vysoko zaťažené plochy. Po vyleštení povrch impregnujeme proti mastnote a nečistotám. Cena od 250 Kč/m². Po obhliadke ju fixujeme v záväznej kalkulácii.",
      "Регенеруємо гранітні підлоги вестибюлів, сходи, зовнішнє облицювання, а також кухонні та робочі стільниці в комерційних і житлових об’єктах. Завдяки твердості матеріалу граніт ідеально підходить і для екстер’єру, і для зон з високим навантаженням. Після полірування просочуємо поверхню проти жиру та бруду. Ціна від 250 крон/м². Фіксуємо в остаточному кошторисі після огляду."
    ),
    included: [
      T("Diagnostika povrchu a odstranění starých vrstev impregnace", "Surface diagnostics and removal of old impregnation layers", "Diagnostika povrchu a odstránenie starých vrstiev impregnácie", "Діагностика поверхні та видалення старих шарів просочення"),
      T("Diamantové broušení v postupných zrnitostech", "Diamond grinding through progressive grit stages", "Diamantové brúsenie v postupných zrnitostiach", "Алмазна шліфовка поступовими зернистостями"),
      T("Leštění do jednotného hlubokého lesku", "Polishing to a uniform, deep shine", "Leštenie do jednotného hlbokého lesku", "Полірування до рівномірного глибокого блиску"),
      T("Odstranění mastných skvrn a nečistot z pórů", "Removal of grease stains and dirt from the pores", "Odstránenie mastných škvŕn a nečistôt z pórov", "Видалення жирних плям і бруду з пор"),
      T("Impregnace odolná vůči mastnotě a povětrnosti", "Grease- and weather-resistant impregnation", "Impregnácia odolná voči mastnote a poveternosti", "Стійка до жиру та погодних умов імпрегнація"),
      T("Ošetření hran, spár a přechodů mezi deskami", "Treatment of edges, joints and slab transitions", "Ošetrenie hrán, škár a prechodov medzi doskami", "Обробка країв, швів і переходів між плитами"),
    ],
    steps: [
      { n: "01", title: T("Poptávka", "Request", "Dopyt", "Заявка"), text: T("Zavoláte nebo vyplníte formulář. Manažer se ozve ještě týž pracovní den.", "Call us or fill in the form. A manager will get back to you the same business day.", "Zavoláte alebo vyplníte formulár. Manažér sa ozve ešte v ten istý pracovný deň.", "Зателефонуйте або заповніть форму. Менеджер зв’яжеться з вами того ж робочого дня.") },
      { n: "02", title: T("Prohlídka a diagnostika", "Survey & diagnostics", "Obhliadka a diagnostika", "Огляд і діагностика"), text: T("Zdarma posoudíme stav žuly a míru opotřebení povrchu.", "We assess the granite's condition and level of surface wear for free.", "Zdarma posúdime stav žuly a mieru opotrebenia povrchu.", "Безкоштовно оцінимо стан граніту та ступінь зношення поверхні.") },
      { n: "03", title: T("Kalkulace a termín", "Estimate & date", "Kalkulácia a termín", "Кошторис і термін"), text: T("Do 24 hodin obdržíte závaznou cenovou nabídku a harmonogram.", "You receive a binding quote and schedule within 24 hours.", "Do 24 hodín dostanete záväznú cenovú ponuku a harmonogram.", "Протягом 24 годин ви отримаєте остаточну цінову пропозицію та графік.") },
      { n: "04", title: T("Broušení a leštění", "Grinding & polishing", "Brúsenie a leštenie", "Шліфування та полірування"), text: T("Diamantové broušení v několika zrnitostech a finální leštění.", "Diamond grinding through several grits and final polishing.", "Diamantové brúsenie vo viacerých zrnitostiach a finálne leštenie.", "Алмазна шліфовка кількома зернистостями та фінальне полірування.") },
      { n: "05", title: T("Impregnace a předání", "Impregnation & handover", "Impregnácia a odovzdanie", "Імпрегнація та здача"), text: T("Aplikujeme impregnaci a předáme výsledek s fotoreportem.", "We apply the impregnation and hand over the result with a photo report.", "Aplikujeme impregnáciu a odovzdáme výsledok s fotoreportom.", "Наносимо імпрегнацію та здаємо результат з фотозвітом.") },
    ],
    priceTitle: T("Ceník renovace žuly", "Granite renovation price list", "Cenník renovácie žuly", "Прайс-лист регенерації граніту"),
    prices: [
      { name: T("Mytí + impregnace", "Washing + impregnation", "Umývanie + impregnácia", "Миття + імпрегнація"), price: "250 Kč", unit: "/m²" },
      { name: T("Broušení + leštění", "Grinding + polishing", "Brúsenie + leštenie", "Шліфовка + полірування"), price: "1650 Kč", unit: "/m²" },
    ],
    who: [
      { title: T("Vstupní haly a recepce", "Entrance halls and receptions", "Vstupné haly a recepcie", "Вестибюлі та рецепції"), text: T("Obnovíme lesk žulových podlah namáhaných vysokou frekvencí chodců.", "We restore the shine of granite floors under heavy foot traffic.", "Obnovíme lesk žulových podláh namáhaných vysokou frekvenciou chodcov.", "Відновлюємо блиск гранітних підлог з високим пішохідним навантаженням.") },
      { title: T("Kuchyně a pracovní desky", "Kitchens and work countertops", "Kuchyne a pracovné dosky", "Кухні та робочі стільниці"), text: T("Odstraníme mastné skvrny a obnovíme impregnaci odolnou vůči potravinám.", "We remove grease stains and renew a food-resistant impregnation.", "Odstránime mastné škvrny a obnovíme impregnáciu odolnú voči potravinám.", "Видаляємо жирні плями та оновлюємо стійку до продуктів імпрегнацію.") },
      { title: T("Venkovní schody a obklady", "Outdoor steps and cladding", "Vonkajšie schody a obklady", "Зовнішні сходи та облицювання"), text: T("Žula díky tvrdosti odolá povětrnosti. Impregnace prodlouží životnost.", "Thanks to its hardness granite withstands the weather. Impregnation extends its lifespan.", "Žula vďaka tvrdosti odolá poveternosti. Impregnácia predĺži životnosť.", "Завдяки твердості граніт витримує погодні умови. Імпрегнація продовжує термін служби.") },
      { title: T("Obchodní a průmyslové provozy", "Commercial and industrial facilities", "Obchodné a priemyselné prevádzky", "Комерційні та промислові об’єкти"), text: T("Práce mimo otevírací dobu bez omezení provozu.", "Work outside opening hours without disrupting operations.", "Práce mimo otváracích hodín bez obmedzenia prevádzky.", "Роботи поза робочим часом без зупинки роботи об’єкта.") },
    ],
    faqs: [
      { q: T("Je žula tvrdší než mramor?", "Is granite harder than marble?", "Je žula tvrdšia než mramor?", "Чи твердіший граніт за мармур?"), a: T("Ano, žula je vyvřelý kámen s výrazně vyšší tvrdostí i odolností vůči kyselinám, proto se hodí i do exteriérů a míst s vysokou zátěží.", "Yes, granite is an igneous rock with significantly higher hardness and acid resistance, which is why it also suits exteriors and high-load areas.", "Áno, žula je vyvretý kameň s výrazne vyššou tvrdosťou aj odolnosťou voči kyselinám, preto sa hodí aj do exteriérov a miest s vysokou záťažou.", "Так, граніт є виверженою породою зі значно вищою твердістю та стійкістю до кислот, тому підходить і для екстер’єру, і для зон з високим навантаженням.") },
      { q: T("Proč žula ztrácí lesk, když je tak tvrdá?", "Why does granite lose its shine if it is so hard?", "Prečo žula stráca lesk, keď je taká tvrdá?", "Чому граніт втрачає блиск, якщо він такий твердий?"), a: T("Vliv má hlavně opotřebení povrchové vrstvy leštění, usazená špína v pórech a stará impregnace, která ztrácí účinnost. Broušením a novou impregnací lesk obnovíme.", "The main causes are wear of the top polished layer, dirt embedded in the pores and old impregnation losing its effect. Grinding and a fresh impregnation restore the shine.", "Vplyv má hlavne opotrebenie povrchovej vrstvy leštenia, usadená špina v póroch a stará impregnácia, ktorá stráca účinnosť. Brúsením a novou impregnáciou lesk obnovíme.", "Головні причини: зношення верхнього полірованого шару, забрудненість пор і старе просочення, що втрачає ефективність. Шліфуванням і новою імпрегнацією відновлюємо блиск.") },
      { q: T("Hodí se žula i pro venkovní schody?", "Is granite also suitable for outdoor steps?", "Hodí sa žula aj na vonkajšie schody?", "Чи підходить граніт для зовнішніх сходів?"), a: T("Ano, žula je jedním z nejodolnějších přírodních kamenů pro exteriér. Doporučujeme protiskluzovou úpravu povrchu u exponovaných schodů.", "Yes, granite is one of the most durable natural stones for exteriors. We recommend an anti-slip surface finish for exposed steps.", "Áno, žula je jedným z najodolnejších prírodných kameňov pre exteriér. Odporúčame protišmykovú úpravu povrchu pri exponovaných schodoch.", "Так, граніт є одним з найстійкіших природних каменів для екстер’єру. Для відкритих сходів рекомендуємо протиковзку обробку поверхні.") },
      { q: T("Jak dlouho renovace žulové podlahy trvá?", "How long does renovating a granite floor take?", "Ako dlho trvá renovácia žulovej podlahy?", "Скільки триває регенерація гранітної підлоги?"), a: T("Vzhledem k tvrdosti materiálu je broušení žuly časově náročnější než u mramoru. U běžné vstupní haly počítejte s 2–3 dny práce.", "Because of the material's hardness, grinding granite takes longer than marble. For a typical entrance hall, expect 2–3 days of work.", "Vzhľadom na tvrdosť materiálu je brúsenie žuly časovo náročnejšie než pri mramore. Pri bežnej vstupnej hale počítajte s 2–3 dňami práce.", "Через твердість матеріалу шліфування граніту триває довше, ніж мармуру. Для звичайного вестибюля розраховуйте на 2–3 дні роботи.") },
      { q: T("Chráníte i spáry a přechody mezi deskami?", "Do you also protect joints and slab transitions?", "Chránite aj škáry a prechody medzi doskami?", "Чи обробляєте шви й переходи між плитами?"), a: T("Ano, spáry a přechody ošetříme spolu s celou plochou, aby výsledný povrch působil jednotně a impregnace fungovala i v těchto místech.", "Yes, we treat joints and transitions together with the whole surface so the result looks uniform and the impregnation also works there.", "Áno, škáry a prechody ošetríme spolu s celou plochou, aby výsledný povrch pôsobil jednotne a impregnácia fungovala aj v týchto miestach.", "Так, шви й переходи обробляємо разом з усією площею, щоб результат виглядав рівномірно, а імпрегнація діяла й у цих місцях.") },
    ],
    related: ["renovace-mramoru", "renovace-terasy"],
    gallery: [
      { type: "before-after", before: "/images/cases_for_pages/renovace_zuly_do_1.jpg", after: "/images/cases_for_pages/renovace_zuly_1_po.jpg" },
    ],
  },

  "renovace-terasy": {
    crumb: T("Renovace terasy", "Terrace renovation", "Renovácia terasy", "Регенерація тераси"),
    h1: T("Renovace kamenných teras Praha", "Stone terrace renovation in Prague", "Renovácia kamenných terás Praha", "Регенерація кам’яних терас у Празі"),
    heroSub: T(
      "Mytí, broušení, impregnace a voskování venkovních kamenných teras a dlažeb. Ochráníme povrch proti mrazu, mechu a povětrnosti. Kalkulace zdarma do 24 hodin.",
      "Washing, grinding, impregnation and waxing of outdoor stone terraces and paving. We protect the surface against frost, moss and weathering. Free quote within 24 hours.",
      "Umývanie, brúsenie, impregnácia a voskovanie vonkajších kamenných terás a dlažieb. Ochránime povrch proti mrazu, machu a poveternosti. Kalkulácia zdarma do 24 hodín.",
      "Миття, шліфування, імпрегнація та воскування зовнішніх кам’яних терас і бруківки. Захищаємо поверхню від морозу, моху та погодних умов. Безкоштовний кошторис протягом 24 годин."
    ),
    img: "/images/cases_for_pages/renovace_terasy_po.jpg",
    heroImgAlt: T("Kamenná terasa po mytí, broušení a impregnaci", "A stone terrace after washing, grinding and impregnation", "Kamenná terasa po umytí, brúsení a impregnácii", "Кам’яна тераса після миття, шліфування та імпрегнації"),
    introTitle: T("Jak probíhá renovace kamenné terasy", "How stone terrace renovation works", "Ako prebieha renovácia kamennej terasy", "Як проходить регенерація кам’яної тераси"),
    intro1: T(
      "Venkovní kámen je vystaven dešti, mrazu, UV záření a mechanickému namáhání, což se projeví usazenou špínou, mechem a řasami v pórech, vyšisovanou barvou a ztrátou impregnace. Renovaci zahajujeme vysokotlakým mytím s biocidním ošetřením, u výrazněji poškozených ploch pokračujeme broušením, které povrch zarovná a obnoví.",
      "Outdoor stone is exposed to rain, frost, UV radiation and mechanical stress, which shows up as dirt, moss and algae embedded in the pores, faded colour and worn-off impregnation. We start renovation with high-pressure washing and biocidal treatment; for more damaged surfaces we continue with grinding that levels and restores the surface.",
      "Vonkajší kameň je vystavený dažďu, mrazu, UV žiareniu a mechanickému namáhaniu, čo sa prejaví usadenou špinou, machom a riasami v póroch, vyblednutou farbou a stratou impregnácie. Renováciu začíname vysokotlakovým umývaním s biocídnym ošetrením, pri výraznejšie poškodených plochách pokračujeme brúsením, ktoré povrch zarovná a obnoví.",
      "Зовнішній камінь зазнає впливу дощу, морозу, УФ-випромінювання та механічного навантаження, що проявляється забрудненням, мохом і водоростями в порах, вицвілим кольором і втратою просочення. Регенерацію починаємо з миття під високим тиском і біоцидної обробки, для більш пошкоджених поверхонь продовжуємо шліфуванням, яке вирівнює та відновлює поверхню."
    ),
    intro2: T(
      "Renovujeme terasy, venkovní schody, bazénové obklady a dlážděné cesty z přírodního kamene i betonové dlažby v zahradách, u rodinných domů i komerčních objektů. Po vymytí a případném broušení aplikujeme impregnaci nebo vosk, který povrch chrání proti vlhkosti, mrazu a novému růstu mechu. Cena od 320 Kč/m². Po prohlídce ji fixujeme v závazné kalkulaci.",
      "We renovate terraces, outdoor steps, pool surrounds and paved paths made of natural stone or concrete pavers in gardens, at family houses and commercial premises. After washing and any necessary grinding we apply an impregnation or wax that protects the surface against moisture, frost and new moss growth. Price from 320 CZK/m², fixed in a binding quote after a site survey.",
      "Renovujeme terasy, vonkajšie schody, bazénové obklady a dláždené cesty z prírodného kameňa aj betónovej dlažby v záhradách, pri rodinných domoch aj komerčných objektoch. Po umytí a prípadnom brúsení aplikujeme impregnáciu alebo vosk, ktorý povrch chráni proti vlhkosti, mrazu a novému rastu machu. Cena od 320 Kč/m². Po obhliadke ju fixujeme v záväznej kalkulácii.",
      "Регенеруємо тераси, зовнішні сходи, облицювання басейнів і вимощені доріжки з природного каменю чи бетонної бруківки в садах, у приватних будинках і на комерційних об’єктах. Після миття та за потреби шліфування наносимо просочення або віск, що захищає поверхню від вологи, морозу й нового росту моху. Ціна від 320 крон/м². Фіксуємо в остаточному кошторисі після огляду."
    ),
    included: [
      T("Vysokotlaké mytí s biocidním ošetřením proti mechu a řasám", "High-pressure washing with biocidal treatment against moss and algae", "Vysokotlakové umývanie s biocídnym ošetrením proti machu a riasam", "Миття під високим тиском з біоцидною обробкою проти моху та водоростей"),
      T("Broušení nerovností a poškozených míst dlažby", "Grinding of uneven and damaged paving spots", "Brúsenie nerovností a poškodených miest dlažby", "Шліфування нерівностей і пошкоджених ділянок бруківки"),
      T("Impregnace proti vodě, mrazu a mastným skvrnám", "Impregnation against water, frost and grease stains", "Impregnácia proti vode, mrazu a mastným škvrnám", "Імпрегнація проти води, морозу та жирних плям"),
      T("Voskování pro sytější barvu a snadnější údržbu", "Waxing for richer colour and easier maintenance", "Voskovanie pre sýtejšiu farbu a jednoduchšiu údržbu", "Воскування для насиченішого кольору та легшого догляду"),
      T("Spárování a doplnění chybějící spárovací hmoty", "Re-jointing and topping up missing joint filler", "Škárovanie a doplnenie chýbajúcej škárovacej hmoty", "Затирання швів і доповнення відсутнього затиральна"),
      T("Ošetření hran, schodů a přechodů k okolní zeleni", "Treatment of edges, steps and transitions to surrounding greenery", "Ošetrenie hrán, schodov a prechodov k okolitej zeleni", "Обробка країв, сходів і переходів до навколишньої зелені"),
    ],
    steps: [
      { n: "01", title: T("Poptávka", "Request", "Dopyt", "Заявка"), text: T("Zavoláte nebo vyplníte formulář. Manažer se ozve ještě týž pracovní den.", "Call us or fill in the form. A manager will get back to you the same business day.", "Zavoláte alebo vyplníte formulár. Manažér sa ozve ešte v ten istý pracovný deň.", "Зателефонуйте або заповніть форму. Менеджер зв’яжеться з вами того ж робочого дня.") },
      { n: "02", title: T("Prohlídka terasy", "Terrace survey", "Obhliadka terasy", "Огляд тераси"), text: T("Zdarma posoudíme druh kamene, míru znečištění a poškození.", "We assess the stone type and level of soiling and damage for free.", "Zdarma posúdime druh kameňa, mieru znečistenia a poškodenia.", "Безкоштовно оцінимо тип каменю, рівень забруднення та пошкоджень.") },
      { n: "03", title: T("Kalkulace a termín", "Estimate & date", "Kalkulácia a termín", "Кошторис і термін"), text: T("Do 24 hodin obdržíte závaznou cenovou nabídku a harmonogram.", "You receive a binding quote and schedule within 24 hours.", "Do 24 hodín dostanete záväznú cenovú ponuku a harmonogram.", "Протягом 24 годин ви отримаєте остаточну цінову пропозицію та графік.") },
      { n: "04", title: T("Mytí a broušení", "Washing & grinding", "Umývanie a brúsenie", "Миття та шліфування"), text: T("Vysokotlaké mytí, biocidní ošetření a broušení poškozených míst.", "High-pressure washing, biocidal treatment and grinding of damaged spots.", "Vysokotlakové umývanie, biocídne ošetrenie a brúsenie poškodených miest.", "Миття під високим тиском, біоцидна обробка та шліфування пошкоджених ділянок.") },
      { n: "05", title: T("Impregnace a předání", "Impregnation & handover", "Impregnácia a odovzdanie", "Імпрегнація та здача"), text: T("Aplikujeme impregnaci nebo vosk a předáme výsledek s fotoreportem.", "We apply the impregnation or wax and hand over the result with a photo report.", "Aplikujeme impregnáciu alebo vosk a odovzdáme výsledok s fotoreportom.", "Наносимо імпрегнацію або віск та здаємо результат з фотозвітом.") },
    ],
    priceTitle: T("Ceník renovace terasy", "Terrace renovation price list", "Cenník renovácie terasy", "Прайс-лист регенерації тераси"),
    prices: [
      { name: T("Mytí + impregnace", "Washing + impregnation", "Umývanie + impregnácia", "Миття + імпрегнація"), price: "320 Kč", unit: "/m²" },
      { name: T("Broušení + voskování", "Grinding + waxing", "Brúsenie + voskovanie", "Шліфовка + воскування"), price: "430 Kč", unit: "/m²" },
    ],
    who: [
      { title: T("Rodinné domy a zahrady", "Family houses and gardens", "Rodinné domy a záhrady", "Приватні будинки та сади"), text: T("Obnovíme barvu a lesk terasy i dlážděných cest kolem domu.", "We restore the colour and shine of terraces and paved paths around the house.", "Obnovíme farbu a lesk terasy aj dláždených ciest okolo domu.", "Відновлюємо колір і блиск тераси та вимощених доріжок навколо будинку.") },
      { title: T("Bazény a wellness zóny", "Pools and wellness areas", "Bazény a wellness zóny", "Басейни та wellness-зони"), text: T("Odstraníme řasy a vodní kámen z obkladů kolem bazénu.", "We remove algae and limescale from pool-surround cladding.", "Odstránime riasy a vodný kameň z obkladov okolo bazéna.", "Видаляємо водорості та накип з облицювання навколо басейну.") },
      { title: T("Restaurace a hotelové zahrady", "Restaurants and hotel gardens", "Reštaurácie a hotelové záhrady", "Ресторани та готельні сади"), text: T("Připravíme venkovní posezení na sezónu bez omezení hostů.", "We prepare outdoor seating for the season without disrupting guests.", "Pripravíme vonkajšie posedenie na sezónu bez obmedzenia hostí.", "Готуємо зону відпочинку до сезону без обмеження гостей.") },
      { title: T("Komerční a administrativní areály", "Commercial and administrative complexes", "Komerčné a administratívne areály", "Комерційні та адміністративні комплекси"), text: T("Renovace vstupních teras a chodníků z přírodního kamene.", "Renovation of entrance terraces and walkways made of natural stone.", "Renovácia vstupných terás a chodníkov z prírodného kameňa.", "Регенерація вхідних терас і доріжок з природного каменю.") },
    ],
    faqs: [
      { q: T("Proč terasa časem zezelená a je kluzká?", "Why does a terrace turn green and slippery over time?", "Prečo terasa časom zozelenie a je klzká?", "Чому тераса з часом зеленіє і стає слизькою?"), a: T("Vlivem vlhkosti a nedostatku slunce se v pórech kamene usazují řasy a mech. Vysokotlaké mytí s biocidem je odstraní a impregnace zpomalí jejich nový růst.", "Moisture and lack of sunlight cause algae and moss to settle in the stone's pores. High-pressure washing with biocide removes them, and impregnation slows their regrowth.", "Vplyvom vlhkosti a nedostatku slnka sa v póroch kameňa usadzujú riasy a mach. Vysokotlakové umývanie s biocídom ich odstráni a impregnácia spomalí ich nový rast.", "Через вологу та брак сонця в порах каменю осідають водорості й мох. Миття під високим тиском з біоцидом видаляє їх, а імпрегнація сповільнює новий ріст.") },
      { q: T("Vydrží renovace přes zimu?", "Will the renovation survive the winter?", "Vydrží renovácia cez zimu?", "Чи витримає регенерація зиму?"), a: T("Ano, používáme mrazuvzdorné impregnace určené pro exteriér, které chrání kámen před poškozením mrazem a solí.", "Yes, we use frost-resistant impregnations designed for outdoor use that protect the stone from frost and salt damage.", "Áno, používame mrazuvzdorné impregnácie určené pre exteriér, ktoré chránia kameň pred poškodením mrazom a soľou.", "Так, використовуємо морозостійкі просочення для екстер’єру, які захищають камінь від пошкоджень морозом і сіллю.") },
      { q: T("Broušení funguje i na dlažbu s nerovnostmi?", "Does grinding work on uneven paving too?", "Funguje brúsenie aj na dlažbu s nerovnosťami?", "Чи діє шліфування на нерівну бруківку?"), a: T("Ano, broušením zarovnáme mírné nerovnosti mezi deskami a odstraníme povrchová poškození. U výrazných propadů doporučíme přesazení dlažby.", "Yes, grinding levels minor unevenness between slabs and removes surface damage. For significant sinking we recommend re-laying the paving.", "Áno, brúsením zarovnáme mierne nerovnosti medzi doskami a odstránime povrchové poškodenia. Pri výrazných prepadoch odporučíme preloženie dlažby.", "Так, шліфуванням вирівнюємо незначні нерівності між плитами та усуваємо пошкодження поверхні. При значних просіданнях радимо перекласти бруківку.") },
      { q: T("Jak často terasu impregnovat?", "How often should a terrace be impregnated?", "Ako často terasu impregnovať?", "Як часто просочувати терасу?"), a: T("U exteriéru doporučujeme impregnaci obnovovat jednou ročně, ideálně na jaře před sezónou, kdy je povrch nejvíc namáhaný.", "For exteriors we recommend renewing the impregnation once a year, ideally in spring before the season when the surface is most stressed.", "Pri exteriéri odporúčame impregnáciu obnovovať raz ročne, ideálne na jar pred sezónou, keď je povrch najviac namáhaný.", "Для екстер’єру рекомендуємо оновлювати імпрегнацію раз на рік, бажано навесні перед сезоном, коли навантаження на поверхню найбільше.") },
      { q: T("Pracujete i s betonovou dlažbou, ne jen přírodním kamenem?", "Do you also work with concrete pavers, not just natural stone?", "Pracujete aj s betónovou dlažbou, nielen s prírodným kameňom?", "Чи працюєте з бетонною бруківкою, а не лише природним каменем?"), a: T("Ano, mytí, impregnaci i voskování nabízíme i pro betonovou zámkovou dlažbu, postup přizpůsobíme materiálu.", "Yes, we offer washing, impregnation and waxing for concrete interlocking pavers too, adapting the method to the material.", "Áno, umývanie, impregnáciu aj voskovanie ponúkame aj pre betónovú zámkovú dlažbu, postup prispôsobíme materiálu.", "Так, миття, імпрегнацію та воскування пропонуємо і для бетонної тротуарної плитки, метод адаптуємо під матеріал.") },
    ],
    related: ["renovace-mramoru", "renovace-zuly"],
    gallery: [
      { type: "before-after", before: "/images/cases_for_pages/renovace_terasy_do.jpg", after: "/images/cases_for_pages/renovace_terasy_po.jpg" },
    ],
  },
};
