import { useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import Brand from './components/Brand';
import SearchInput from './components/SearchInput';
import Sidebar from './components/Sidebar';
import Dialog from './components/ui/Dialog';
import {
  AdminPage,
  CatalogPage,
  CategoriesPage,
  DashboardPage,
  LandingPage,
  ReaderPage,
  ResourceDetail,
  SearchPage,
  VideoPage,
} from './components/Pages';
import { useLibrary } from './context/LibraryContext';
import {
  accountNavigation,
  newArrivals,
  primaryNavigation,
  resources,
} from './data/library';


// Combine the curated library and new arrivals so route-based resource lookup works
// across both sets of catalog content.
const allResources = [...resources, ...newArrivals];

// Convert a resource title into a clean URL slug so the detail page can be linked
// and bookmarked consistently across the app.
const itemPath = (item) =>
  `/resource/${item.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}`;

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [authOpen, setAuthOpen] = useState(false);
  const { user, signOut } = useLibrary();

  // Reader pages use a full-screen layout without the app shell chrome, so we switch
  // between the normal navigation experience and the reading view based on the URL.
  const readerMode = location.pathname.startsWith('/reader');

  // Highlight the currently active navigation item for the sidebar based on the route.
  const activeItem = location.pathname.includes('courses')
    ? 'Courses'
    : location.pathname.includes('categories')
      ? 'Categories'
      : location.pathname.includes('dashboard')
        ? 'Dashboard'
        : location.pathname.includes('admin')
          ? 'Manage Resources'
          : location.pathname.includes('books')
            ? 'Books'
            : 'Home';

  // A small route map keeps navigation labels and target URLs in one place, making it
  // easier to expand the app without scattering route strings throughout components.
  const navigation = (label) => {
    const links = {
      Home: '/',
      Books: '/books',
      Courses: '/courses',
      Videos: '/video',
      Categories: '/categories',
      Dashboard: '/dashboard',
      'My Library': '/dashboard',
      'Manage Resources': '/admin',
    };
    navigate(links[label] || '/books');
  };

  // Resource selection and search submission keep the viewport in sync with the current
  // URL while preserving the user’s navigation flow through the catalog.
  const select = (item) => navigate(itemPath(item));
  const submitSearch = () => navigate(`/search?q=${encodeURIComponent(query)}`);

  return (
    <div className={readerMode ? 'reader-shell' : 'app-shell'}>
      {!readerMode && (
        <Sidebar
          primaryItems={[...primaryNavigation, ['▦', 'Categories']]}
          accountItems={[
            ...accountNavigation,
            ['⚙', 'Dashboard'],
            ['⌘', 'Manage Resources'],
          ]}
          activeItem={activeItem}
          onNavigate={navigation}
        />
      )}

      <main className={readerMode ? 'reader-main' : ''}>
        {!readerMode && (
          <header className="topbar">
            <button className="menu" aria-label="Open menu">
              ☰
            </button>
            <div className="mobile-brand">
              <Brand />
            </div>
            <SearchInput query={query} onQueryChange={setQuery} />
            <button className="top-search" onClick={submitSearch}>
              ⌕
            </button>
            <div className="top-actions">
              <button
                className="icon-btn"
                aria-label="Bookmarks"
                onClick={() => navigate('/dashboard')}
              >
                ♧
              </button>
              {user ? (
                <button className="login" onClick={signOut}>
                  Logout
                </button>
              ) : (
                <button className="login" onClick={() => setAuthOpen(true)}>
                  Login
                </button>
              )}
              <button
                className="signup"
                onClick={() => (user ? navigate('/dashboard') : setAuthOpen(true))}
              >
                {user ? user.name : 'Sign Up'}
              </button>
            </div>
          </header>
        )}

        <Routes>
          <Route
            path="/"
            element={<LandingPage onNavigate={(label) => navigation(label)} onSelect={select} />}
          />
          <Route
            path="/categories"
            element={<CategoriesPage onNavigate={(label) => navigation(label)} />}
          />
          <Route path="/books" element={<CatalogPage type="Books" onSelect={select} />} />
          <Route path="/courses" element={<CatalogPage type="Courses" onSelect={select} />} />
          <Route path="/search" element={<SearchRoute onSelect={select} />} />
          <Route
            path="/resource/:slug"
            element={
              <DetailRoute
                onRead={(item) => navigate(`/reader/${itemPath(item).split('/').pop()}`)}
              />
            }
          />
          <Route path="/reader/:slug" element={<ReaderRoute onBack={() => navigate('/books')} />} />
          <Route path="/video" element={<VideoPage onBack={() => navigate('/courses')} />} />
          <Route
            path="/dashboard"
            element={<DashboardPage onNavigate={(label) => navigation(label)} />}
          />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {!readerMode && location.pathname === '/' && (
          <footer>
            <Brand />
            <p>Empowering minds. Building the future.</p>
            <div>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
            </div>
          </footer>
        )}
      </main>

      {authOpen && <AuthDialog onClose={() => setAuthOpen(false)} />}
    </div>
  );
}

// Resolve a slug back to its matching resource entry so the detail and reader views can
// load the correct catalog item even when URLs are generated from the human-readable title.
function findResource(slug) {
  return allResources.find((item) => itemPath(item).endsWith(slug)) || resources[0];
}

function DetailRoute({ onRead }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const item = findResource(slug);

  return (
    <ResourceDetail
      resource={item}
      onRead={() => onRead(item)}
      onBack={() => navigate('/books')}
    />
  );
}

function ReaderRoute({ onBack }) {
  const { slug } = useParams();

  return <ReaderPage resource={findResource(slug)} onBack={onBack} />;
}

function SearchRoute({ onSelect }) {
  const search = new URLSearchParams(useLocation().search).get('q') || '';

  return <SearchPage initialQuery={search} onSelect={onSelect} />;
}

function AuthDialog({ onClose }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [notice, setNotice] = useState('');
  const { signIn } = useLibrary();
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    signIn(email);
    setNotice(mode === 'login' ? 'Welcome back.' : 'Your account is ready.');
    setTimeout(() => {
      onClose();
      navigate('/dashboard');
    }, 350);
  }

  return (
    <Dialog title={mode === 'login' ? 'Login' : 'Create account'} onClose={onClose}>
      <section className="auth-modal">
        <aside>
          <Brand />
          <h2>Empowering minds.</h2>
          <p>Building the future.</p>
        </aside>

        <form onSubmit={submit}>
          <h1>{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h1>
          <p>
            {mode === 'login' ? 'Login to continue your account' : 'Join thousands of learners today'}
          </p>

          {mode === 'signup' && <input required placeholder="Full name" />}

          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
          />
          <input required type="password" minLength="6" placeholder="Password" />

          <label className="terms">
            <input type="checkbox" required={mode === 'signup'} /> Remember me
          </label>

          <button className="signup">{mode === 'login' ? 'Login' : 'Sign Up'}</button>

          {notice && <small className="form-notice">{notice}</small>}

          <p className="mode-toggle">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </form>
      </section>
    </Dialog>
  );
}

export default function App() {
  return <AppShell />;
}
