import type { Locale } from "@/lib/i18n";

export type PageSeoKey =
  | "home"
  | "about"
  | "products"
  | "projects"
  | "contact"
  | "blog"
  | "privacy"
  | "terms"
  | "imprint"
  | "notFound";

type LocaleCopy = { title: string; description: string };

/**
 * Independent per-locale SEO copy — not machine translations.
 * FA strings target Persian search phrasing (مقره، فشار قوی، عایق کامپوزیتی).
 */
export const PAGE_SEO: Record<
  PageSeoKey,
  Record<Locale, LocaleCopy> & { path: string }
> = {
  home: {
    path: "/",
    en: {
      title: "Taban Niroo | High-Voltage Composite Insulators",
      description:
        "High-voltage composite insulators and power transmission. IEC-tested. 6-1000 kV. Shiraz, Iran.",
    },
    fa: {
      title: "تابان نیرو — سازندهٔ مقرهٔ کامپوزیتی سیلیکونی",
      description:
        "تولید مقرهٔ کامپوزیتی سیلیکونی، مقرهٔ هیبریدی و بوشینگ ترانسفورماتور برای شبکه‌های فشار متوسط و فشار قوی. تست‌شده بر اساس IEC، از ۶ تا ۱۰۰۰ کیلوولت.",
    },
  },
  about: {
    path: "/about",
    en: {
      title: "Company",
      description:
        "Taban Niroo: high-voltage composite insulators and power transmission equipment from Shiraz Especial Economic Zone. IEC-tested, serving the Middle East and beyond since 1997.",
    },
    fa: {
      title: "دربارهٔ تابان نیرو — بیش از ۲۵ سال تولید مقره",
      description:
        "تولیدکنندهٔ مقرهٔ کامپوزیتی در شیراز؛ سه ثبت اختراع، تست نوعی IEC، تأمین برای شبکه‌های انتقال و توزیع.",
    },
  },
  products: {
    path: "/products",
    en: {
      title: "Products",
      description:
        "Composite insulators, hybrid insulators, and transformer bushings. IEC 61109, 62217, and related standards. 6-420 kV.",
    },
    fa: {
      title: "محصولات — مقرهٔ کامپوزیتی، هیبریدی و بوشینگ",
      description:
        "سبد کامل مقرهٔ کامپوزیتی سیلیکونی، مقرهٔ اتکایی، مقرهٔ هیبریدی و بوشینگ. جست‌وجو بر اساس کلاس ولتاژ و کد DPL.",
    },
  },
  projects: {
    path: "/projects",
    en: {
      title: "Projects & Partners",
      description:
        "Taban Niroo insulators on transmission and distribution projects across the Middle East, Africa, and South America.",
    },
    fa: {
      title: "پروژه‌ها و همکاران — تابان نیرو",
      description:
        "مقره‌های کامپوزیتی تابان نیرو در پروژه‌های انتقال و توزیع، در شرایط آلودگی و اقلیم سخت.",
    },
  },
  contact: {
    path: "/contact",
    en: {
      title: "Contact",
      description:
        "Contact Taban Niroo for high-voltage composite insulator enquiries, technical support, and partnerships. Headquarters in Shiraz and office in Tehran.",
    },
    fa: {
      title: "تماس با تابان نیرو — استعلام فنی",
      description:
        "استعلام فنی، انتخاب محصول و مدارک مناقصه. دفتر مرکزی شیراز، دفتر تهران.",
    },
  },
  blog: {
    path: "/blog",
    en: {
      title: "Blog – R&D",
      description:
        "Research, testing, and field experience from Taban Niroo’s R&D team. IEC-based design for demanding electrical and environmental conditions.",
    },
    fa: {
      title: "بلاگ – تحقیق و توسعه",
      description:
        "پژوهش، آزمون و تجربه میدانی تیم تحقیق و توسعه تابان نیرو. طراحی بر پایه IEC برای شرایط الکتریکی و محیطی سخت.",
    },
  },
  privacy: {
    path: "/privacy",
    en: {
      title: "Privacy notice",
      description:
        "How Taban Niroo handles personal data collected through this website — analytics, contact submissions, retention and your rights.",
    },
    fa: {
      title: "حریم خصوصی",
      description:
        "نحوه رسیدگی تابان نیرو به داده‌های شخصی در این وب‌سایت — تحلیل ترافیک، فرم تماس، نگهداری و حقوق شما.",
    },
  },
  terms: {
    path: "/terms",
    en: {
      title: "Terms of use",
      description:
        "Terms governing your use of the Taban Niroo website — content accuracy, intellectual property and acceptable use.",
    },
    fa: {
      title: "شرایط استفاده",
      description:
        "شرایط استفاده از وب‌سایت تابان نیرو — صحت محتوا، مالکیت فکری و استفاده مجاز.",
    },
  },
  imprint: {
    path: "/imprint",
    en: {
      title: "Imprint",
      description:
        "Legal information for the Taban Niroo (Dena Power Line Insulators) corporate website.",
    },
    fa: {
      title: "شناسه قانونی",
      description:
        "اطلاعات حقوقی وب‌سایت شرکتی تابان نیرو (دنا مقره‌های خط انتقال نیرو).",
    },
  },
  notFound: {
    path: "/",
    en: {
      title: "Page not found",
      description: "The requested page could not be found on Taban Niroo.",
    },
    fa: {
      title: "صفحه پیدا نشد",
      description: "صفحه درخواستی در سایت تابان نیرو یافت نشد.",
    },
  },
};

export function pageSeoCopy(
  key: PageSeoKey,
  locale: Locale,
): LocaleCopy & { path: string } {
  const entry = PAGE_SEO[key];
  return { path: entry.path, ...entry[locale] };
}
