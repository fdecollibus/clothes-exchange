import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function UserDoc() {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Benutzerhandbuch</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Erste Schritte</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Registrierung</h3>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              Klicken Sie auf den Button "Jetzt registrieren" auf der Login-Seite
            </li>
            <li>
              Füllen Sie das Registrierungsformular aus:
              <ul className="list-disc pl-6 mt-2">
                <li>E-Mail-Adresse (wird für die Anmeldung verwendet)</li>
                <li>Name (wird für die Kommunikation verwendet)</li>
                <li>Passwort (mindestens 8 Zeichen)</li>
              </ul>
            </li>
            <li>
              Nach erfolgreicher Registrierung werden Sie automatisch eingeloggt und zum Willkommens-Assistenten weitergeleitet
            </li>
          </ol>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. Anmeldung</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              Geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein
            </li>
            <li>
              Klicken Sie auf "Anmelden"
            </li>
            <li>
              Bei erfolgreicher Anmeldung werden Sie zum Dashboard weitergeleitet
            </li>
          </ol>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. Artikel verkaufen</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              Melden Sie sich an und gehen Sie zum Dashboard
            </li>
            <li>
              Klicken Sie auf "Neuer Artikel"
            </li>
            <li>
              Füllen Sie die Artikelinformationen aus:
              <ul className="list-disc pl-6 mt-2">
                <li>Beschreibung des Artikels (z.B. "Rosa Sommerkleid, Größe 98")</li>
                <li>Preis (in CHF)</li>
                <li>Größe (z.B. 98, 104, 110)</li>
                <li>Zustand (neu, sehr gut, gut)</li>
                <li>Kategorie (z.B. Kleider, Hosen, Schuhe)</li>
              </ul>
            </li>
            <li>
              Klicken Sie auf "Speichern" um den Artikel zu veröffentlichen
            </li>
          </ol>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. Artikel verwalten</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Ihre Artikel</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Alle Ihre Artikel werden im Dashboard angezeigt</li>
            <li>Sie können Artikel bearbeiten oder löschen</li>
            <li>Der Status zeigt an, ob ein Artikel verfügbar, reserviert oder verkauft ist</li>
            <li>Die Artikel werden nach Datum sortiert angezeigt (neueste zuerst)</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">Artikel bearbeiten</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Klicken Sie auf den "Bearbeiten" Button neben dem Artikel</li>
            <li>Ändern Sie die gewünschten Informationen</li>
            <li>Klicken Sie auf "Speichern" um die Änderungen zu übernehmen</li>
          </ol>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">5. Verkäufe abwickeln</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              Wenn ein Artikel verkauft wurde:
              <ul className="list-disc pl-6 mt-2">
                <li>Markieren Sie den Artikel als "Verkauft"</li>
                <li>Tragen Sie das Verkaufsdatum ein</li>
                <li>Der Artikel wird aus der aktiven Liste entfernt</li>
              </ul>
            </li>
            <li>
              Am Ende der Verkaufsperiode:
              <ul className="list-disc pl-6 mt-2">
                <li>Sie erhalten eine Abrechnung über alle Verkäufe</li>
                <li>Die Auszahlung erfolgt per Banküberweisung</li>
                <li>Nicht verkaufte Artikel können Sie am Ende der Verkaufsperiode abholen</li>
              </ul>
            </li>
          </ol>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">6. Profil verwalten</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              Klicken Sie auf "Profil" in der Navigation
            </li>
            <li>
              Hier können Sie:
              <ul className="list-disc pl-6 mt-2">
                <li>Ihre persönlichen Daten aktualisieren</li>
                <li>Ihre Bankverbindung für Auszahlungen angeben</li>
                <li>Ihr Passwort ändern</li>
              </ul>
            </li>
          </ol>
        </div>
      </section>

      <div className="mt-8 text-center">
        <Link
          to="/login"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Zurück zur Anmeldung
        </Link>
      </div>
    </div>
  )
} 