import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Sun, Moon, Languages, BarChart, Package, ShoppingCart, ChevronRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = React.useState<'light' | 'dark' | 'system'>('system');

  React.useEffect(() => {
    const handleSystemTheme = () => {
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', isDark);
      } else {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    };

    handleSystemTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemTheme);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleSystemTheme);
    };
  }, [theme]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  const features = [
    {
      icon: Package,
      title: t('features.inventory'),
      description: t('features.inventory.desc'),
    },
    {
      icon: ShoppingCart,
      title: t('features.sales'),
      description: t('features.sales.desc'),
    },
    {
      icon: BarChart,
      title: t('features.reports'),
      description: t('features.reports.desc'),
    },
  ];

  const plans = [
    {
      name: t('pricing.starter'),
      price: '29',
      features: ['100 Products', 'Basic Reports', 'Email Support'],
    },
    {
      name: t('pricing.pro'),
      price: '79',
      features: ['Unlimited Products', 'Advanced Reports', 'Priority Support'],
    },
    {
      name: t('pricing.enterprise'),
      price: '199',
      features: ['Custom Solutions', 'API Access', 'Dedicated Support'],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-teal-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">StockSence</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">
                {t('nav.features')}
              </a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">
                {t('nav.pricing')}
              </a>
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500">
                {t('nav.about')}
              </a>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleLanguage}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-500"
                >
                  <Languages className="h-5 w-5" />
                </button>
                
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                  className="bg-transparent text-gray-600 dark:text-gray-300 border-none focus:ring-0"
                >
                  <option value="light">{t('theme.light')}</option>
                  <option value="dark">{t('theme.dark')}</option>
                  <option value="system">{t('theme.system')}</option>
                </select>

                <Link
                  to="/auth"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                >
                  {t('nav.login')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
            {t('hero.subtitle')}
          </p>
          <div className="mt-10">
            <Link
              to="/auth"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
            >
              {t('hero.cta')}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t('features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 transition-transform hover:transform hover:-translate-y-1"
              >
                <feature.icon className="h-12 w-12 text-teal-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t('pricing.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 transition-transform hover:transform hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-teal-600 mb-6">
                  ${plan.price}
                  <span className="text-base font-normal text-gray-600 dark:text-gray-300">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-gray-600 dark:text-gray-300"
                    >
                      <ChevronRight className="h-5 w-5 text-teal-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/auth"
                  className="block w-full text-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
                >
                  {t('hero.cta')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {t('about.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('about.desc')}
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;