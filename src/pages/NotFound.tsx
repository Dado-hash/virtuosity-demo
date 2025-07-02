
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const translations = {
    it: {
      title: "404",
      message: "Oops! Pagina non trovata",
      backHome: "Torna alla Home"
    },
    en: {
      title: "404", 
      message: "Oops! Page not found",
      backHome: "Return to Home"
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LanguageSwitcher />
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{t.message}</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          {t.backHome}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
