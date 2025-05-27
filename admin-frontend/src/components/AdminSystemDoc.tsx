import React from 'react'
import { useTranslation } from 'react-i18next'

export default function AdminSystemDoc() {
  const { t } = useTranslation()

  return (
    <div className="prose max-w-none">
      <h1 className="text-3xl font-bold mb-8">Systemarchitektur & Dokumentation</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Systemübersicht</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Systemarchitektur</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <svg width="800" height="400" className="w-full">
                {/* Frontend Box */}
                <rect x="50" y="50" width="200" height="300" fill="#f3f4f6" stroke="#4b5563" strokeWidth="2" />
                <text x="150" y="80" textAnchor="middle" className="font-semibold">Frontend</text>
                <text x="150" y="120" textAnchor="middle">React App</text>
                <text x="150" y="150" textAnchor="middle">User Interface</text>
                <text x="150" y="180" textAnchor="middle">State Management</text>
                <text x="150" y="210" textAnchor="middle">API Client</text>

                {/* Backend Box */}
                <rect x="300" y="50" width="200" height="300" fill="#f3f4f6" stroke="#4b5563" strokeWidth="2" />
                <text x="400" y="80" textAnchor="middle" className="font-semibold">Backend</text>
                <text x="400" y="120" textAnchor="middle">Express Server</text>
                <text x="400" y="150" textAnchor="middle">Authentication</text>
                <text x="400" y="180" textAnchor="middle">API Routes</text>
                <text x="400" y="210" textAnchor="middle">Business Logic</text>

                {/* Database Box */}
                <rect x="550" y="50" width="200" height="300" fill="#f3f4f6" stroke="#4b5563" strokeWidth="2" />
                <text x="650" y="80" textAnchor="middle" className="font-semibold">Database</text>
                <text x="650" y="120" textAnchor="middle">MongoDB</text>
                <text x="650" y="150" textAnchor="middle">Collections</text>

                {/* Connection Lines */}
                <line x1="250" y1="200" x2="300" y2="200" stroke="#4b5563" strokeWidth="2" />
                <line x1="500" y1="200" x2="550" y2="200" stroke="#4b5563" strokeWidth="2" />
              </svg>
            </div>
          </div>

          <p className="mb-4">
            Die Kinderkleiderbörse ist eine moderne Webanwendung, die aus drei Hauptkomponenten besteht:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Frontend</h3>
              <ul className="list-disc pl-5">
                <li>React mit TypeScript</li>
                <li>Vite als Build-Tool</li>
                <li>Tailwind CSS für Styling</li>
                <li>Zustand für State Management</li>
                <li>React Router für Navigation</li>
                <li>i18next für Internationalisierung</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Backend</h3>
              <ul className="list-disc pl-5">
                <li>Node.js mit Express</li>
                <li>TypeScript</li>
                <li>MongoDB mit Mongoose</li>
                <li>JWT für Authentifizierung</li>
                <li>Swagger für API-Dokumentation</li>
                <li>Helmet für Sicherheit</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Datenbank</h3>
              <ul className="list-disc pl-5">
                <li>MongoDB als NoSQL-Datenbank</li>
                <li>Mongoose als ODM</li>
                <li>Indexierung für Performance</li>
                <li>Validierung auf Schema-Ebene</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. API-Dokumentation (Swagger)</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Datenfluss</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <svg width="800" height="400" className="w-full">
                {/* User Box */}
                <rect x="50" y="150" width="100" height="60" fill="#f3f4f6" stroke="#4b5563" strokeWidth="2" />
                <text x="100" y="185" textAnchor="middle">User</text>

                {/* Frontend Box */}
                <rect x="200" y="150" width="100" height="60" fill="#f3f4f6" stroke="#4b5563" strokeWidth="2" />
                <text x="250" y="185" textAnchor="middle">Frontend</text>

                {/* Backend Box */}
                <rect x="350" y="150" width="100" height="60" fill="#f3f4f6" stroke="#4b5563" strokeWidth="2" />
                <text x="400" y="185" textAnchor="middle">Backend</text>

                {/* Database Box */}
                <rect x="500" y="150" width="100" height="60" fill="#f3f4f6" stroke="#4b5563" strokeWidth="2" />
                <text x="550" y="185" textAnchor="middle">Database</text>

                {/* Connection Lines */}
                <line x1="150" y1="180" x2="200" y2="180" stroke="#4b5563" strokeWidth="2" />
                <line x1="300" y1="180" x2="350" y2="180" stroke="#4b5563" strokeWidth="2" />
                <line x1="450" y1="180" x2="500" y2="180" stroke="#4b5563" strokeWidth="2" />
                <line x1="450" y1="180" x2="500" y2="180" stroke="#4b5563" strokeWidth="2" />
                <line x1="500" y1="180" x2="450" y2="180" stroke="#4b5563" strokeWidth="2" />
                <line x1="350" y1="180" x2="300" y2="180" stroke="#4b5563" strokeWidth="2" />
                <line x1="200" y1="180" x2="150" y2="180" stroke="#4b5563" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Authentifizierung</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">POST /api/auth/login</h4>
              <p className="text-sm text-gray-600 mb-2">Benutzeranmeldung</p>
              <pre className="bg-gray-100 p-3 rounded text-sm">
{`{
  "email": "string",
  "password": "string"
}`}
              </pre>
              <p className="text-sm text-gray-600 mt-2">Response: JWT Token</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Verkäufer</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">GET /api/admin/sellers</h4>
              <p className="text-sm text-gray-600 mb-2">Alle Verkäufer abrufen</p>
              <p className="text-sm text-gray-600">Response: Array von Seller-Objekten</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h4 className="font-medium mb-2">GET /api/admin/sellers/:id</h4>
              <p className="text-sm text-gray-600 mb-2">Verkäuferdetails abrufen</p>
              <p className="text-sm text-gray-600">Response: Seller-Objekt</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Artikel</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">GET /api/admin/items</h4>
              <p className="text-sm text-gray-600 mb-2">Alle Artikel abrufen</p>
              <p className="text-sm text-gray-600">Response: Array von Item-Objekten</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h4 className="font-medium mb-2">POST /api/admin/items</h4>
              <p className="text-sm text-gray-600 mb-2">Neuen Artikel erstellen</p>
              <pre className="bg-gray-100 p-3 rounded text-sm">
{`{
  "sellerId": "ObjectId",
  "description": "string",
  "price": "number",
  "size": "string",
  "condition": "string",
  "category": "string",
  "imageUrl": "string"
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. Datenmodell</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Entity-Relationship-Diagramm</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <svg width="800" height="400" className="w-full">
                {/* User Box */}
                <rect x="50" y="50" width="200" height="120" fill="#f3f4f6" stroke="#4b5563" strokeWidth="2" />
                <text x="150" y="80" textAnchor="middle" className="font-semibold">User</text>
                <text x="150" y="110" textAnchor="middle">_id: ObjectId</text>
                <text x="150" y="130" textAnchor="middle">email: String</text>
                <text x="150" y="150" textAnchor="middle">password: String</text>

                {/* Seller Box */}
                <rect x="300" y="50" width="200" height="120" fill="#f3f4f6" stroke="#4b5563" strokeWidth="2" />
                <text x="400" y="80" textAnchor="middle" className="font-semibold">Seller</text>
                <text x="400" y="110" textAnchor="middle">_id: ObjectId</text>
                <text x="400" y="130" textAnchor="middle">userId: ObjectId</text>
                <text x="400" y="150" textAnchor="middle">sellerNumber: String</text>

                {/* Item Box */}
                <rect x="550" y="50" width="200" height="120" fill="#f3f4f6" stroke="#4b5563" strokeWidth="2" />
                <text x="650" y="80" textAnchor="middle" className="font-semibold">Item</text>
                <text x="650" y="110" textAnchor="middle">_id: ObjectId</text>
                <text x="650" y="130" textAnchor="middle">sellerId: ObjectId</text>
                <text x="650" y="150" textAnchor="middle">itemNumber: Number</text>

                {/* Connection Lines */}
                <line x1="250" y1="110" x2="300" y2="110" stroke="#4b5563" strokeWidth="2" />
                <line x1="500" y1="110" x2="550" y2="110" stroke="#4b5563" strokeWidth="2" />
              </svg>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">User</h3>
            <pre className="bg-gray-100 p-4 rounded-lg">
{`{
  _id: ObjectId,
  email: String,          // Eindeutig, erforderlich
  password: String,       // Gehasht mit bcrypt
  name: String,          // Erforderlich
  isAdmin: Boolean,      // Standard: false
  createdAt: Date,       // Automatisch gesetzt
  updatedAt: Date        // Automatisch aktualisiert
}`}
            </pre>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Seller</h3>
            <pre className="bg-gray-100 p-4 rounded-lg">
{`{
  _id: ObjectId,
  userId: ObjectId,      // Referenz auf User
  sellerNumber: String,  // Eindeutig, automatisch generiert
  street: String,       // Erforderlich
  city: String,         // Erforderlich
  iban: String,         // Erforderlich, validiert
  createdAt: Date,      // Automatisch gesetzt
  updatedAt: Date       // Automatisch aktualisiert
}`}
            </pre>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Item</h3>
            <pre className="bg-gray-100 p-4 rounded-lg">
{`{
  _id: ObjectId,
  sellerId: ObjectId,    // Referenz auf Seller
  itemNumber: Number,    // Eindeutig pro Verkäufer
  description: String,   // Erforderlich
  price: Number,        // Erforderlich, > 0
  size: String,         // Erforderlich
  condition: String,    // Erforderlich
  category: String,     // Erforderlich
  status: String,       // Enum: ['available', 'sold', 'reserved']
  imageUrl: String,     // Optional
  createdAt: Date,      // Automatisch gesetzt
  updatedAt: Date       // Automatisch aktualisiert
}`}
            </pre>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. Sicherheit</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Authentifizierung</h3>
              <ul className="list-disc pl-5">
                <li>JWT-basierte Authentifizierung</li>
                <li>Token-Expiration nach 24 Stunden</li>
                <li>Refresh-Token-Mechanismus</li>
                <li>Passwort-Hashing mit bcrypt</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Autorisierung</h3>
              <ul className="list-disc pl-5">
                <li>Rollenbasierte Zugriffskontrolle (RBAC)</li>
                <li>Admin- und Benutzerrollen</li>
                <li>Middleware für Route-Schutz</li>
                <li>API-Rate-Limiting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">5. Deployment</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Frontend</h3>
              <ul className="list-disc pl-5">
                <li>Vercel oder Netlify</li>
                <li>Automatische CI/CD</li>
                <li>CDN für statische Assets</li>
                <li>SSL/TLS-Verschlüsselung</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Backend</h3>
              <ul className="list-disc pl-5">
                <li>Heroku oder DigitalOcean</li>
                <li>Node.js-Umgebung</li>
                <li>PM2 für Prozess-Management</li>
                <li>Nginx als Reverse Proxy</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Datenbank</h3>
              <ul className="list-disc pl-5">
                <li>MongoDB Atlas</li>
                <li>Automatische Backups</li>
                <li>Replikation für Hochverfügbarkeit</li>
                <li>Monitoring und Alerting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 