import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en';
import de from './translations/de';

const resources = {
  en: {
    translation: {
      ...en,
      dashboard: {
        myItems: 'My Items',
        totalItems: 'Total Items',
        totalValue: 'Total Value',
        soldItems: 'Sold Items',
        soldValue: 'Value of Sold Items',
        unsoldItems: 'Available Items',
        noItems: 'No items found',
        addFirstItem: 'Add your first item',
        downloadAllList: 'Download All Items',
        downloadSoldList: 'Download Sold Items',
        downloadUnsoldList: 'Download Available Items',
        downloadLabels: 'Download Labels'
      },
    }
  },
  de: {
    translation: {
      ...de,
      dashboard: {
        myItems: 'Meine Artikel',
        totalItems: 'Anzahl Artikel',
        totalValue: 'Gesamtwert der Artikel',
        soldItems: 'Verkaufte Artikel',
        soldValue: 'Wert der verkauften Artikel',
        unsoldItems: 'Verfügbare Artikel',
        noItems: 'Keine Artikel gefunden',
        addFirstItem: 'Fügen Sie Ihren ersten Artikel hinzu',
        downloadAllList: 'Alle Artikel herunterladen',
        downloadSoldList: 'Verkaufte Artikel herunterladen',
        downloadUnsoldList: 'Verfügbare Artikel herunterladen',
        downloadLabels: 'Etiketten herunterladen'
      },
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 