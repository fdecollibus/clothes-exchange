# Children's Clothes Exchange Platform

A full-stack application for managing a children's clothes exchange event, including seller management, item tracking, and checkout functionality.

## Project Structure

```
.
├── backend/           # Node.js/Express backend
├── admin-frontend/    # React admin dashboard
├── checkout-app/      # React checkout application
└── frontend/         # React seller portal
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/clothes-exchange.git
   cd clothes-exchange
   ```

2. Install dependencies for all applications:
   ```bash
   # Backend
   cd backend
   npm install

   # Admin Frontend
   cd ../admin-frontend
   npm install

   # Checkout App
   cd ../checkout-app
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in each application directory
   - Update the values according to your environment

4. Initialize the database:
   ```bash
   cd backend
   npm run setup-db
   ```

5. Start the development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Admin Frontend
   cd admin-frontend
   npm run dev

   # Terminal 3 - Checkout App
   cd checkout-app
   npm run dev

   # Terminal 4 - Frontend
   cd frontend
   npm run dev
   ```

## Running Tests

```bash
# Backend tests
cd backend
npm test

# Admin Frontend tests
cd admin-frontend
npm test

# Checkout App tests
cd checkout-app
npm test
```

## Default Credentials

- Admin:
  - Email: admin@example.com
  - Password: password123

- Seller:
  - Email: seller@example.com
  - Password: password123

## Features

- Seller Management
  - Registration and login
  - Item management
  - Sales tracking

- Admin Dashboard
  - Seller overview
  - Item management
  - PDF generation
  - Sales statistics

- Checkout System
  - Cart management
  - Receipt generation
  - PDF downloads

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 