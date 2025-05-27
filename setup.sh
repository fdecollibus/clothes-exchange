#!/bin/bash

# Frontend setup
echo "Setting up frontend..."
cd frontend
npm install
npm install -D @types/react @types/react-dom @types/node
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Backend setup
echo "Setting up backend..."
cd ../backend
npm install
npm install -D typescript @types/node @types/express @types/jsonwebtoken @types/bcryptjs

# Create necessary directories if they don't exist
mkdir -p src/models src/routes src/middleware

echo "Setup complete!" 