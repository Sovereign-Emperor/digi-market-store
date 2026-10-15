import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '../assets/style.css';
import './app.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
