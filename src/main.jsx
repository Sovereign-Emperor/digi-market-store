import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LibraryProvider } from './context/LibraryContext';
import '../assets/style.css';
import './app.css';
import './responsive.css';

// Application bootstrap: mount the React app into the root element and wrap it with
// the router and shared library context so all pages can share state and navigation.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LibraryProvider>
        <App />
      </LibraryProvider>
    </BrowserRouter>
  </StrictMode>,
);
