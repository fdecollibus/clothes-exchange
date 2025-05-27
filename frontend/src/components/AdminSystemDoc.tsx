import React from 'react';
import { useTranslation } from 'react-i18next';

const AdminSystemDoc: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">System- und Architekturdokumentation</h2>

      {/* System Overview */}
      <section className="mb-8">
        <h3 className="text-xl font-medium mb-4">1. Systemübersicht</h3>
        <div className="space-y-4 text-gray-700">
          <p>
            Die Kinderkleiderbörse ist eine Full-Stack-Webanwendung, die auf einer modernen, skalierbaren Architektur basiert.
            Das System ist in drei Hauptkomponenten unterteilt:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Frontend (React + TypeScript)</li>
            <li>Backend (Node.js + Express)</li>
            <li>Datenbank (MongoDB)</li>
          </ul>
        </div>
      </section>

      {/* Database Schema */}
      <section className="mb-8">
        <h3 className="text-xl font-medium mb-4">2. Datenbankschema</h3>
        <div className="space-y-4 text-gray-700">
          <h4 className="font-medium">User Collection</h4>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}`}
          </pre>

          <h4 className="font-medium">Seller Collection</h4>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  sellerNumber: String,
  street: String,
  city: String,
  iban: String,
  createdAt: Date,
  updatedAt: Date
}`}
          </pre>

          <h4 className="font-medium">Item Collection</h4>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  _id: ObjectId,
  sellerId: ObjectId (ref: Seller),
  itemNumber: Number,
  title: String,
  description: String,
  price: Number,
  size: String,
  condition: String,
  category: String,
  status: String,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}`}
          </pre>

          <h4 className="font-medium">Sale Collection</h4>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  _id: ObjectId,
  itemId: ObjectId (ref: Item),
  sellerId: ObjectId (ref: Seller),
  price: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date
}`}
          </pre>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="mb-8">
        <h3 className="text-xl font-medium mb-4">3. API-Endpunkte</h3>
        <div className="space-y-4 text-gray-700">
          <h4 className="font-medium">Authentifizierung</h4>
          <ul className="list-disc ml-6 space-y-2">
            <li>POST /api/auth/register - Neue Benutzerregistrierung</li>
            <li>POST /api/auth/login - Benutzeranmeldung</li>
            <li>POST /api/auth/logout - Benutzerabmeldung</li>
          </ul>

          <h4 className="font-medium">Verkäufer</h4>
          <ul className="list-disc ml-6 space-y-2">
            <li>GET /api/sellers - Alle Verkäufer abrufen</li>
            <li>GET /api/sellers/:id - Verkäuferdetails abrufen</li>
            <li>PUT /api/sellers/:id - Verkäufer aktualisieren</li>
          </ul>

          <h4 className="font-medium">Artikel</h4>
          <ul className="list-disc ml-6 space-y-2">
            <li>GET /api/items - Alle Artikel abrufen</li>
            <li>POST /api/items - Neuen Artikel erstellen</li>
            <li>PUT /api/items/:id - Artikel aktualisieren</li>
            <li>DELETE /api/items/:id - Artikel löschen</li>
          </ul>

          <h4 className="font-medium">Admin</h4>
          <ul className="list-disc ml-6 space-y-2">
            <li>GET /api/admin/sellers - Alle Verkäufer mit Details</li>
            <li>GET /api/admin/sellers/:id/items - Artikel eines Verkäufers</li>
            <li>GET /api/admin/sellers/:id/items/download - Artikel-Liste herunterladen</li>
          </ul>
        </div>
      </section>

      {/* Security */}
      <section className="mb-8">
        <h3 className="text-xl font-medium mb-4">4. Sicherheit</h3>
        <div className="space-y-4 text-gray-700">
          <h4 className="font-medium">Authentifizierung</h4>
          <ul className="list-disc ml-6 space-y-2">
            <li>JWT-basierte Authentifizierung</li>
            <li>Passwort-Hashing mit bcrypt</li>
            <li>Token-Expiration nach 24 Stunden</li>
          </ul>

          <h4 className="font-medium">Autorisierung</h4>
          <ul className="list-disc ml-6 space-y-2">
            <li>Rollenbasierte Zugriffskontrolle (Admin/Mitarbeiter)</li>
            <li>Middleware für geschützte Routen</li>
            <li>Validierung aller Benutzereingaben</li>
          </ul>
        </div>
      </section>

      {/* Deployment */}
      <section>
        <h3 className="text-xl font-medium mb-4">5. Deployment</h3>
        <div className="space-y-4 text-gray-700">
          <h4 className="font-medium">Umgebungsvariablen</h4>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
{`PORT=3001
MONGODB_URI=mongodb://localhost:27017/clothes-exchange
JWT_SECRET=your-secret-key
NODE_ENV=development`}
          </pre>

          <h4 className="font-medium">Build-Prozess</h4>
          <ul className="list-disc ml-6 space-y-2">
            <li>Frontend: Vite Build mit TypeScript</li>
            <li>Backend: TypeScript Compilation</li>
            <li>Datenbank: MongoDB Migration</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AdminSystemDoc; 