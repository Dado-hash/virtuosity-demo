
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageSwitch = () => {
    const newLanguage = language === 'it' ? 'en' : 'it';
    setLanguage(newLanguage);
    
    toast({
      title: t('englishVersion'),
      description: t('englishComingSoon'),
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLanguageSwitch}
      className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
      title={t('switchToEnglish')}
    >
      <span className="text-lg">{language === 'it' ? '🇬🇧' : '🇮🇹'}</span>
    </Button>
  );
};

export default LanguageSwitcher;
