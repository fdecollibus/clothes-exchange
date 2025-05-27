import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  de: {
    translation: {
      checkout: {
        title: 'Kasse',
        sellerId: 'Verkäufer-Nr.',
        sellerIdPlaceholder: 'Verkäufer-Nr. eingeben',
        itemNumber: 'Artikel-Nr.',
        itemNumberPlaceholder: 'Artikel-Nr. eingeben',
        itemTitle: 'Titel',
        seller: 'Verkäufer',
        price: 'Preis',
        actions: 'Aktionen',
        total: 'Gesamtbetrag',
        process: 'Verkauf abschließen',
        success: 'Verkauf erfolgreich abgeschlossen',
        error: {
          missingFields: 'Bitte geben Sie Verkäufer-Nr. und Artikel-Nr. ein',
          itemNotFound: 'Artikel nicht gefunden',
          itemAlreadyAdded: 'Artikel wurde bereits hinzugefügt',
          itemNotAvailable: 'Artikel ist nicht verfügbar',
          noItems: 'Keine Artikel zum Bezahlen vorhanden',
          checkoutFailed: 'Verkauf konnte nicht abgeschlossen werden'
        }
      },
      common: {
        add: 'Hinzufügen',
        delete: 'Löschen'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 