// main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Create root and render App
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);