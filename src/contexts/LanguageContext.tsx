
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'it' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  it: {
    // Index page translations
    heroTitle: "Virtuosity",
    heroSubtitle: "Un modello innovativo che stimola l'interazione tra comuni, aziende e cittadini per costruire insieme un futuro sostenibile.",
    heroDescription: "La piattaforma che premia i tuoi comportamenti sostenibili. Tracciamento automatico, certificati blockchain e premi reali per un futuro più verde.",
    buttonVirtusosity: "Virtusosity",
    buttonUser: "Utente",
    buttonExchange: "Exchange",
    buttonCompanies: "Aziende",
    buttonMunicipalities: "Comuni",
    // Language switcher
    switchToEnglish: "Switch to English",
    englishVersion: "English Version",
    englishComingSoon: "English translation coming soon! 🇬🇧",
    // Report page translations
    reportTitle: "Report Virtuosity",
    reportSubtitle: "Report Attività Sostenibili",
    reportDescription: "Riepilogo completo delle tue attività e certificazioni - Periodo: Gennaio 2024",
    downloadReport: "Scarica Report",
    backToDashboard: "Torna alla Dashboard",
    totalCO2Saved: "CO₂ Totale Risparmiata",
    totalPoints: "Punti Totali",
    certifiedCO2: "CO₂ Certificata",
    certifiedPoints: "Punti Certificati",
    activitiesDetail: "Dettaglio Attività",
    activitiesDescription: "Elenco completo di tutte le attività sostenibili registrate",
    blockchainCertificates: "Certificati Blockchain",
    certificatesDescription: "Certificazioni digitali verificate e immutabili",
    // DashboardAziende page translations
    backToMenu: "Torna al Menu",
    employeeCertificates: "Certificati Dipendenti",
    externalCertificates: "Certificati Esterni",
    employeeCertificatesDesc: "Certificati DPP ricevuti dai dipendenti aziendali",
    externalCertificatesDesc: "Certificati DPP ricevuti da followers",
    welfareTitle: "Welfare, Premi e Gadget Aziendali",
    welfareDescription: "Gestisci i premi welfare, gadget aziendali e viaggi premio disponibili per i dipendenti",
    type: "Tipo",
    name: "Nome",
    value: "Valore",
    add: "Aggiungi",
    sustainabilityReport: "Report Bilancio di Sostenibilità",
    sustainabilityDescription: "Genera report con i dati per il bilancio di sostenibilità aziendale",
    certifyAndCompensate: "Certifica e Compensa",
    close: "Chiudi",
    exportReport: "Esporta Report",
    // Table headers
    activityType: "Tipo",
    activity: "Attività",
    distance: "Distanza",
    co2Saved: "CO₂ Risp.",
    points: "Punti",
    date: "Data",
    location: "Luogo",
    id: "ID",
    title: "Titolo",
    certifiedCO2Short: "CO₂ Certificata",
    validationDate: "Data Validazione",
    blockchainHash: "Hash Blockchain",
    status: "Stato",
    verified: "Verificato"
  },
  en: {
    // Index page translations
    heroTitle: "Virtuosity",
    heroSubtitle: "An innovative model that stimulates interaction between municipalities, companies and citizens to build a sustainable future together.",
    heroDescription: "The platform that rewards your sustainable behaviors. Automatic tracking, blockchain certificates and real rewards for a greener future.",
    buttonVirtusosity: "Virtusosity",
    buttonUser: "User",
    buttonExchange: "Exchange",
    buttonCompanies: "Companies",
    buttonMunicipalities: "Municipalities",
    // Language switcher
    switchToEnglish: "Passa all'Italiano",
    englishVersion: "Versione Italiana",
    englishComingSoon: "Traduzione italiana già disponibile! 🇮🇹",
    // Report page translations
    reportTitle: "Virtuosity Report",
    reportSubtitle: "Sustainable Activities Report",
    reportDescription: "Complete summary of your activities and certifications - Period: January 2024",
    downloadReport: "Download Report",
    backToDashboard: "Back to Dashboard",
    totalCO2Saved: "Total CO₂ Saved",
    totalPoints: "Total Points",
    certifiedCO2: "Certified CO₂",
    certifiedPoints: "Certified Points",
    activitiesDetail: "Activities Detail",
    activitiesDescription: "Complete list of all registered sustainable activities",
    blockchainCertificates: "Blockchain Certificates",
    certificatesDescription: "Verified and immutable digital certifications",
    // DashboardAziende page translations
    backToMenu: "Back to Menu",
    employeeCertificates: "Employee Certificates",
    externalCertificates: "External Certificates",
    employeeCertificatesDesc: "DPP certificates received from company employees",
    externalCertificatesDesc: "DPP certificates received from followers",
    welfareTitle: "Corporate Welfare, Rewards and Gadgets",
    welfareDescription: "Manage welfare rewards, corporate gadgets and prize trips available for employees",
    type: "Type",
    name: "Name",
    value: "Value",
    add: "Add",
    sustainabilityReport: "Sustainability Report",
    sustainabilityDescription: "Generate reports with data for corporate sustainability reporting",
    certifyAndCompensate: "Certify and Compensate",
    close: "Close",
    exportReport: "Export Report",
    // Table headers
    activityType: "Type",
    activity: "Activity",
    distance: "Distance",
    co2Saved: "CO₂ Saved",
    points: "Points",
    date: "Date",
    location: "Location",
    id: "ID",
    title: "Title",
    certifiedCO2Short: "Certified CO₂",
    validationDate: "Validation Date",
    blockchainHash: "Blockchain Hash",
    status: "Status",
    verified: "Verified"
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('it');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['it']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
