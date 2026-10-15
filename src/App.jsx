import { useState } from 'react';
import Brand from './components/Brand';
import SearchInput from './components/SearchInput';
import Sidebar from './components/Sidebar';
import { AdminPage, CatalogPage, CategoriesPage, DashboardPage, LandingPage, ReaderPage, ResourceDetail, SearchPage, VideoPage } from './components/Pages';
import { accountNavigation, primaryNavigation, resources } from './data/library';

const routeMap = { Books: 'catalog', Courses: 'courses', Categories: 'categories', Dashboard: 'dashboard', 'Search Results': 'search', 'Manage Resources': 'admin', Videos: 'video', 'My Library': 'dashboard' };

export default function App() {
  const [route, setRoute] = useState('home');
  const [activeItem, setActiveItem] = useState('Home');
  const [selectedResource, setSelectedResource] = useState(null);
  const [search, setSearch] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  function navigate(label) { setActiveItem(label); setRoute(routeMap[label] || (label === 'Home' ? 'home' : 'catalog')); }
  function select(resource) { setSelectedResource(resource); setRoute('detail'); }
  function backToLibrary() { setSelectedResource(null); setRoute('catalog'); setActiveItem('Books'); }
  function renderPage() {
    if (route === 'detail') return <ResourceDetail resource={selectedResource || resources[0]} onRead={() => setRoute('reader')} onBack={backToLibrary} />;
    if (route === 'reader') return <ReaderPage resource={selectedResource || resources[0]} onBack={backToLibrary} />;
    if (route === 'video') return <VideoPage onBack={() => navigate('Courses')} />;
    if (route === 'categories') return <CategoriesPage onNavigate={navigate} />;
    if (route === 'catalog') return <CatalogPage type="Books" onSelect={select} />;
    if (route === 'courses') return <CatalogPage type="Courses" onSelect={select} />;
    if (route === 'search') return <SearchPage initialQuery={search} onSelect={select} />;
    if (route === 'dashboard') return <DashboardPage onNavigate={navigate} />;
    if (route === 'admin') return <AdminPage />;
    return <LandingPage onNavigate={navigate} onSelect={select} />;
  }
  return <div className={route === 'reader' ? 'reader-shell' : 'app-shell'}>
    {route !== 'reader' && <Sidebar primaryItems={[...primaryNavigation, ['▦', 'Categories']]} accountItems={[...accountNavigation, ['⚙', 'Dashboard'], ['⌘', 'Manage Resources']]} activeItem={activeItem} onNavigate={navigate} />}
    <main className={route === 'reader' ? 'reader-main' : ''}>
      {route !== 'reader' && <header className="topbar"><button className="menu" aria-label="Open menu">☰</button><div className="mobile-brand"><Brand /></div><SearchInput query={search} onQueryChange={setSearch} /><button className="top-search" onClick={() => navigate('Search Results')}>⌕</button><div className="top-actions"><button className="icon-btn" aria-label="Bookmarks">♧</button><button className="icon-btn" aria-label="Notifications">♧</button><button className="login" onClick={() => setAuthOpen(true)}>Login</button><button className="signup" onClick={() => setAuthOpen(true)}>Sign Up</button></div></header>}
      {renderPage()}
      {route === 'home' && <footer><Brand /><p>Empowering minds. Building the future.</p><div><a href="#about">About</a><a href="#contact">Contact</a><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div></footer>}
    </main>
    {authOpen && <AuthModal onClose={() => setAuthOpen(false)} onComplete={() => { setAuthOpen(false); navigate('Dashboard'); }} />}
  </div>;
}

function AuthModal({ onClose, onComplete }) {
  const [mode, setMode] = useState('login');
  const [notice, setNotice] = useState('');
  function submit(event) { event.preventDefault(); setNotice(mode === 'login' ? 'Welcome back.' : 'Account created.'); setTimeout(onComplete, 450); }
  return <div className="modal-backdrop" onClick={onClose}><section className="auth-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}>×</button><aside><Brand /><h2>Empowering minds.</h2><p>Building the future.</p></aside><form onSubmit={submit}><h1>{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h1><p>{mode === 'login' ? 'Login to continue your account' : 'Join thousands of learners today'}</p>{mode === 'signup' && <input required placeholder="Full name" />}<input required type="email" placeholder="Email address" /><input required type="password" placeholder="Password" /><label className="terms"><input type="checkbox" required={mode === 'signup'} /> Remember me</label><button className="signup">{mode === 'login' ? 'Login' : 'Sign Up'}</button>{notice && <small className="form-notice">{notice}</small>}<p className="mode-toggle">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'} <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>{mode === 'login' ? 'Sign Up' : 'Login'}</button></p></form></section></div>;
}
