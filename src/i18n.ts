import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "hero.title": "Smart Inventory Management",
      "hero.subtitle": "Streamline your business with StockSence",
      "hero.cta": "Get Started",
      "features.title": "Features",
      "features.inventory": "Inventory Management",
      "features.inventory.desc": "Track your stock in real-time with ease",
      "features.sales": "Sales Tracking",
      "features.sales.desc": "Monitor your sales and revenue effortlessly",
      "features.reports": "Smart Reports",
      "features.reports.desc": "Get insights to grow your business",
      "pricing.title": "Pricing Plans",
      "pricing.starter": "Starter",
      "pricing.pro": "Professional",
      "pricing.enterprise": "Enterprise",
      "about.title": "About Us",
      "about.desc": "StockSence is your partner in business growth",
      "nav.features": "Features",
      "nav.pricing": "Pricing",
      "nav.about": "About",
      "nav.login": "Login",
      "nav.signup": "Sign Up",
      "theme.light": "Light",
      "theme.dark": "Dark",
      "theme.system": "System"
    }
  },
  ar: {
    translation: {
      "hero.title": "إدارة المخزون الذكية",
      "hero.subtitle": "قم بتبسيط أعمالك مع ستوك سينس",
      "hero.cta": "ابدأ الآن",
      "features.title": "المميزات",
      "features.inventory": "إدارة المخزون",
      "features.inventory.desc": "تتبع مخزونك بسهولة في الوقت الفعلي",
      "features.sales": "تتبع المبيعات",
      "features.sales.desc": "راقب مبيعاتك وإيراداتك بدون عناء",
      "features.reports": "تقارير ذكية",
      "features.reports.desc": "احصل على رؤى لتنمية عملك",
      "pricing.title": "خطط الأسعار",
      "pricing.starter": "المبتدئ",
      "pricing.pro": "المحترف",
      "pricing.enterprise": "المؤسسات",
      "about.title": "من نحن",
      "about.desc": "ستوك سينس شريكك في نمو الأعمال",
      "nav.features": "المميزات",
      "nav.pricing": "الأسعار",
      "nav.about": "من نحن",
      "nav.login": "تسجيل الدخول",
      "nav.signup": "إنشاء حساب",
      "theme.light": "فاتح",
      "theme.dark": "داكن",
      "theme.system": "النظام"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;