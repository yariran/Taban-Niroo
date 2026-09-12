import type { Locale } from "@/lib/i18n";

/**
 * Hardcoded section prose that lives outside CMS blocks.
 * EN remains the source of truth in components; FA mirrors
 * `taban-niroo-fa-content.md` (product/family names stay Latin).
 */

export const ENGINEERING_FEATURES = {
  en: [
    {
      eyebrow: "Triple junction point",
      title: "No moisture infiltrate.",
      description:
        "Silicone rubber is directly moulded onto the ECR rod and permanently bonded to each fitting. Air and water cannot reach the triple junction point, eliminating the partial-discharge pathway that causes ageing in conventional insulators.",
    },
    {
      eyebrow: "Up to 420 kV",
      title: "Minimized electrical field.",
      description:
        "Rounded end-fitting geometry, validated by in-house field simulation, suppresses electrical-field concentration at the live end. The result is controlled corona behaviour and longer service life on transmission-class voltages.",
    },
  ],
  fa: [
    {
      eyebrow: "نقطهٔ اتصال سه‌گانه",
      title: "رطوبت نفوذ نمی‌کند.",
      description:
        "لاستیک سیلیکون مستقیماً روی میلهٔ ECR قالب‌گیری و به هر دو یراق به‌طور دائم متصل می‌شود. هوا و آب به نقطهٔ اتصال سه‌گانه نمی‌رسند و مسیر تخلیهٔ جزئی — عامل پیرشدگی مقره‌های متعارف از درون — حذف می‌شود.",
    },
    {
      eyebrow: "تا 420 kV",
      title: "میدان الکتریکی کنترل‌شده.",
      description:
        "هندسهٔ گرد یراق انتهایی، اعتبارسنجی‌شده با شبیه‌سازی میدان در داخل شرکت، تمرکز میدان الکتریکی را در سر فشار قوی کاهش می‌دهد. نتیجه، رفتار کرونای کنترل‌شده و عمر سرویس بیشتر در ولتاژهای کلاس انتقال است.",
    },
  ],
} as const;

export const ENGINEERING_PATENTS_BRIEF = {
  en: [
    {
      id: "01",
      title: "Hybrid Insulators",
      subtitle: "Silicone × Ceramic",
    },
    {
      id: "02",
      title: "Creepage Extenders & Covers",
      subtitle: "Pollution-zone retrofit",
    },
    {
      id: "03",
      title: "Hybrid Transformer Bushings",
      subtitle: "MV–HV transformers",
    },
  ],
  fa: [
    {
      id: "01",
      title: "Hybrid Insulators",
      subtitle: "سیلیکون × چینی",
    },
    {
      id: "02",
      title: "Creepage Extenders & Covers",
      subtitle: "بازسازی در مناطق آلوده",
    },
    {
      id: "03",
      title: "Hybrid Transformer Bushings",
      subtitle: "ترانسفورماتورهای MV–HV",
    },
  ],
} as const;

export const ENGINEERING_PATENTS_HEADER = {
  en: {
    eyebrow: "Patents & Innovation",
    title: "Three patents. One engineering culture.",
    body: "Innovations developed in-house, registered, and already deployed on live transmission and distribution networks.",
  },
  fa: {
    eyebrow: "ثبت اختراع‌ها",
    title: "سه ثبت اختراع. یک فرهنگ مهندسی.",
    body: "نوآوری‌های توسعه‌یافته در داخل شرکت، ثبت‌شده، و از پیش روی شبکه‌های انتقال و توزیع فعال.",
  },
} as const;

export const MATERIALS_STEPS_COPY = {
  en: [
    {
      title: "ECR rod",
      body: "Electrical-grade, corrosion-resistant fibre-reinforced plastic core. This is the mechanical load path of the insulator — every kilonewton of line tension runs through it. ECR grade resists the brittle-fracture mechanism that ends the service life of ordinary FRP cores.",
    },
    {
      title: "HTV silicone housing",
      body: "High-temperature vulcanised silicone, moulded directly onto the rod. Hydrophobic and UV-stable, and — the property that decides service life in a polluted zone — fully recoverable: the surface regains its water-repellency after contamination rather than degrading toward tracking and erosion.",
    },
    {
      title: "Hot-dip galvanized forged fittings",
      body: "Forged steel end-fittings, hot-dip galvanised for decades of atmospheric corrosion resistance. The geometry is rounded — validated by in-house field simulation — to suppress field concentration at the live end and control corona behaviour up to 420 kV.",
    },
    {
      title: "The triple junction point",
      body: "Where rod, housing and fitting meet. Silicone is permanently bonded to both, so air and water cannot reach the junction — eliminating the partial-discharge pathway that ages conventional insulators from the inside out. This is the whole argument for composite over porcelain, in one interface.",
    },
  ],
  fa: [
    {
      title: "میلهٔ ECR",
      body: "هستهٔ کامپوزیتی تقویت‌شده با الیاف، از نوع مقاوم به خوردگی الکتریکی. مسیر بار مکانیکی مقره؛ هر کیلونیوتن کشش خط از آن می‌گذرد.",
    },
    {
      title: "لاستیک سیلیکون HTV",
      body: "بدنهٔ سیلیکون ولکانیزه در دمای بالا. آب‌گریز، مقاوم به UV، و با بازیابی کامل آب‌گریزی در شرایط آلودگی — سطح پس از آلوده‌شدن خاصیت دفع آب خود را بازمی‌یابد، به‌جای آنکه به‌سمت ترکینگ و فرسایش برود.",
    },
    {
      title: "یراق فولادی فورج‌شده با گالوانیزهٔ گرم",
      body: "یراق انتهایی فورج‌شده، محافظت‌شده با گالوانیزهٔ گرم برای دهه‌ها مقاومت در برابر خوردگی جوی.",
    },
    {
      title: "نقطهٔ اتصال سه‌گانه",
      body: "محل تلاقی میله، بدنه و یراق. سیلیکون به هر دو به‌طور دائم متصل است، پس هوا و آب به اتصال نمی‌رسند — مسیر تخلیهٔ جزئی که مقره‌های متعارف را از درون پیر می‌کند حذف می‌شود.",
    },
  ],
} as const;

export const PATENT_CARDS = {
  en: [
    {
      id: "01",
      title: "Hybrid Insulators",
      subtitle: "Silicone × Ceramic",
      description:
        "Patented composite construction that combines a silicone housing with a porcelain or glass body. Delivers the mechanical resilience of ceramic with the hydrophobic, self-cleaning performance of silicone.",
    },
    {
      id: "02",
      title: "Creepage Extenders & Covers",
      subtitle: "Pollution-zone retrofit",
      description:
        "Field-installable silicone booster sheds that increase the creepage distance of existing porcelain or glass insulators, eliminating flashover risk in heavily-polluted substations.",
    },
    {
      id: "03",
      title: "Hybrid Transformer Bushings",
      subtitle: "MV–HV transformers",
      description:
        "Polymer-housed transformer bushings with a silicone weather-shed system engineered by Taban Niroo for medium- and high-voltage power transformers.",
    },
  ],
  fa: [
    {
      id: "01",
      title: "Hybrid Insulators",
      subtitle: "سیلیکون × چینی",
      description:
        "ساخت کامپوزیتی ثبت‌شده که بدنهٔ سیلیکونی را با هستهٔ چینی یا شیشه‌ای ترکیب می‌کند. مقاومت مکانیکی سرامیک با آب‌گریزی و خودتمیزشوندگی سیلیکون.",
    },
    {
      id: "02",
      title: "Creepage Extenders & Covers",
      subtitle: "بازسازی در مناطق آلوده",
      description:
        "چترک‌های سیلیکونی قابل نصب در میدان که فاصلهٔ خزشی مقره‌های چینی یا شیشه‌ای موجود را افزایش می‌دهند و ریسک فلش‌اُور در پست‌های آلوده را کم می‌کنند.",
    },
    {
      id: "03",
      title: "Hybrid Transformer Bushings",
      subtitle: "ترانسفورماتورهای MV–HV",
      description:
        "بوشینگ ترانسفورماتور با محفظهٔ پلیمری و سیستم چترک سیلیکونی، طراحی‌شده توسط تابان نیرو برای ترانسفورماتورهای فشار متوسط و فشار قوی.",
    },
  ],
} as const;

export const CATALOGUE_UI = {
  en: {
    rangeEyebrow: "Product range",
    browseByFamily: "Browse by family",
    allProducts: "All products",
    all: "All",
    procurement: "Procurement",
    procurementBody: "Need a custom configuration, drawing or test report?",
    engineeringRequest: "Engineering request",
    product: "product",
    products: "products",
    acrossAll: " across all families.",
    matchFilter: " match your filter.",
    viewsHintBefore: "Every product card offers two quick views: ",
    viewTable: "Table",
    viewsHintMid: " for ratings and dimensions, ",
    viewDrawing: "Drawing",
    viewsHintAfter:
      " for the sectional diagram. Both open in place — you never leave the page.",
    searchPlaceholder: "Search…",
    searchAria: "Search products",
    clearSearch: "Clear search",
    total: "Total",
    showing: "Showing",
    noResults:
      "No products match the current search. Try another keyword or reset the family filter.",
    resetFilters: "Reset filters",
    item: "item",
    items: "items",
    filterAria: "Filter by product family",
    familyNavAria: "Product family navigator",
  },
  fa: {
    rangeEyebrow: "سبد محصول",
    browseByFamily: "مرور بر اساس خانواده",
    allProducts: "همهٔ محصولات",
    all: "همه",
    procurement: "تأمین",
    procurementBody: "به پیکربندی، نقشه یا گزارش تست سفارشی نیاز دارید؟",
    engineeringRequest: "استعلام فنی",
    product: "محصول",
    products: "محصول",
    acrossAll: " در همهٔ خانواده‌ها.",
    matchFilter: " مطابق فیلتر شما.",
    viewsHintBefore: "هر کارت دو نمای سریع دارد: ",
    viewTable: "جدول",
    viewsHintMid: " برای مقادیر نامی و ابعاد، ",
    viewDrawing: "نقشه",
    viewsHintAfter:
      " برای نمای مقطعی. هر دو در همان صفحه باز می‌شوند.",
    searchPlaceholder: "جست‌وجو…",
    searchAria: "جست‌وجوی محصولات",
    clearSearch: "پاک کردن جست‌وجو",
    total: "کل",
    showing: "نمایش",
    noResults: "موردی مطابق این جست‌وجو یافت نشد.",
    resetFilters: "بازنشانی فیلترها",
    item: "مورد",
    items: "مورد",
    filterAria: "فیلتر بر اساس خانوادهٔ محصول",
    familyNavAria: "ناوبری خانوادهٔ محصول",
  },
} as const;

export function pickLocale<TEn, TFa>(
  map: { en: TEn; fa: TFa },
  locale: Locale,
): TEn | TFa {
  return locale === "fa" ? map.fa : map.en;
}
