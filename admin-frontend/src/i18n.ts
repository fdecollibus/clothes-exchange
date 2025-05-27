import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      adminDashboard: 'Admin Dashboard',
      adminLogin: 'Admin Login',
      email: 'Email',
      password: 'Password',
      login: 'Login',
      logout: 'Logout',
      loginError: 'Login failed. Please check your credentials.',
      fetchError: 'Failed to fetch data.',
      pdfError: 'Failed to download PDF.',
      loading: 'Loading...',
      itemCount: 'Items',
      totalValue: 'Total Value',
      viewItems: 'View Items',
      downloadPdf: 'Download PDF',
      downloadLabels: 'Download Labels',
      sellerItems: 'Seller Items',
      size: 'Size',
      consolidatedItems: 'All Items',
      edit: 'Edit',
      editSeller: 'Edit Seller',
      save: 'Save',
      cancel: 'Cancel',
      street: 'Street',
      city: 'City',
      iban: 'IBAN',
      dashboard: {
        totalItems: 'Total Items',
        totalValue: 'Total Value',
        soldItems: 'Sold Items',
        soldValue: 'Value of Sold Items',
        sellers: 'Sellers'
      },
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        select: 'Select...',
        actions: 'Actions',
        confirmDelete: 'Are you sure you want to delete this item?'
      },
      item: {
        number: 'Item No.',
        category: 'Category',
        size: 'Size',
        condition: 'Condition',
        price: 'Price',
        itemStatus: 'Status',
        comment: 'Comment',
        commentPlaceholder: 'Enter a comment...',
        status: {
          available: 'Available',
          sold: 'Sold',
          reserved: 'Reserved'
        },
        conditions: {
          new: 'New',
          very_good: 'Very Good',
          good: 'Good',
          acceptable: 'Acceptable'
        },
        categories: {
          clothing: 'Clothing',
          shoes: 'Shoes',
          toys: 'Toys',
          accessories: 'Accessories'
        }
      },
      seller: {
        name: 'Seller Name',
        number: 'Seller No.'
      }
    }
  },
  de: {
    translation: {
      adminDashboard: 'Admin Dashboard',
      adminLogin: 'Admin Login',
      email: 'E-Mail',
      password: 'Passwort',
      login: 'Anmelden',
      logout: 'Abmelden',
      loginError: 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.',
      fetchError: 'Daten konnten nicht abgerufen werden.',
      pdfError: 'PDF konnte nicht heruntergeladen werden.',
      loading: 'Laden...',
      itemCount: 'Artikel',
      totalValue: 'Gesamtwert',
      viewItems: 'Artikel anzeigen',
      downloadPdf: 'PDF herunterladen',
      downloadLabels: 'Etiketten herunterladen',
      sellerItems: 'Verkäufer Artikel',
      size: 'Größe',
      consolidatedItems: 'Alle Artikel',
      edit: 'Bearbeiten',
      editSeller: 'Verkäufer bearbeiten',
      save: 'Speichern',
      cancel: 'Abbrechen',
      street: 'Straße',
      city: 'Stadt',
      iban: 'IBAN',
      dashboard: {
        totalItems: 'Anzahl Artikel',
        totalValue: 'Gesamtwert der Artikel',
        soldItems: 'Verkaufte Artikel',
        soldValue: 'Wert der verkauften Artikel',
        sellers: 'Verkäufer'
      },
      common: {
        loading: 'Laden...',
        error: 'Ein Fehler ist aufgetreten',
        save: 'Speichern',
        cancel: 'Abbrechen',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        add: 'Hinzufügen',
        select: 'Auswählen...',
        actions: 'Aktionen',
        confirmDelete: 'Möchten Sie diesen Artikel wirklich löschen?'
      },
      item: {
        number: 'Artikel-Nr.',
        category: 'Kategorie',
        size: 'Größe',
        condition: 'Zustand',
        price: 'Preis',
        itemStatus: 'Status',
        comment: 'Kommentar',
        commentPlaceholder: 'Kommentar eingeben...',
        status: {
          available: 'Verfügbar',
          sold: 'Verkauft',
          reserved: 'Reserviert'
        },
        conditions: {
          new: 'Neu',
          very_good: 'Sehr gut',
          good: 'Gut',
          acceptable: 'Akzeptabel'
        },
        categories: {
          clothing: 'Kleidung',
          shoes: 'Schuhe',
          toys: 'Spielzeug',
          accessories: 'Accessoires'
        }
      },
      seller: {
        name: 'Verkäufer Name',
        number: 'Verkäufer-Nr.'
      }
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'de',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n 