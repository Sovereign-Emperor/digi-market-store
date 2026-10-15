import { useMemo, useState } from 'react';
import Brand from './components/Brand';
import LibraryCard from './components/LibraryCard';
import SearchInput from './components/SearchInput';
import Section from './components/Section';
import Sidebar from './components/Sidebar';
import { accountNavigation, categories, newArrivals, primaryNavigation, resources } from './data/library';

function App() {
  const [query, setQuery] = useState('');
  const [activeItem, setActiveItem] = useState('Home');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState('idle');
  const [selectedResource, setSelectedResource] = useState(null);

  const filteredResources = useMemo(() => resources.filter((resource) => Object.values(resource).join(' ').toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 6);

  function subscribe(event) { event.preventDefault(); setNewsletterStatus('subscribed'); }

  return <div className="app-shell">
    <Sidebar primaryItems={primaryNavigation} accountItems={accountNavigation} activeItem={activeItem} onNavigate={setActiveItem} />
    <main><header className="topbar"><button className="menu" aria-label="Open menu">☰</button><div className="mobile-brand"><Brand /></div><SearchInput query={query} onQueryChange={setQuery} /><div className="top-actions"><button className="icon-btn" aria-label="Bookmarks">♧</button><button className="icon-btn" aria-label="Notifications">♧</button><button className="login">Login</button><button className="signup">Sign Up</button></div></header>
      <section className="hero"><div className="hero-copy"><h1>Your Ultimate<br /><em>Digital Library</em></h1><p>Books, Courses, Tutorials, Source Code, PDFs,<br />Templates & more. All in One Place.</p><div className="hero-search"><SearchInput query={query} onQueryChange={setQuery} /><button>Search</button></div><div className="popular">Popular: <span>Python</span><span>JavaScript</span><span>Web Development</span><span>Machine Learning</span></div></div><div className="hero-art" aria-hidden="true"><div className="spark s1">✦</div><div className="spark s2">✧</div><div className="royal-crown">♛</div><div className="book book-a" /><div className="book book-b" /><div className="book book-c" /></div><div className="stats">{[['10K+', 'Resources'], ['50+', 'Categories'], ['5K+', 'Users'], ['100K+', 'Downloads']].map(([value, label]) => <div key={label}><b>{value}</b><span>{label}</span></div>)}</div></section>
      <Section title="Top Categories" actionLabel={showAllCategories ? 'Show Less' : 'View All'} onAction={() => setShowAllCategories((show) => !show)}><div className="category-grid">{visibleCategories.map((category) => <button className="category" key={category.name}><span className={`cat-icon ${category.color}`}>{category.icon}</span><b>{category.name}</b><small>{category.count} Resources</small></button>)}</div></Section>
      <Section title="Trending Resources" onAction={() => setQuery('')}><div className="resource-grid">{filteredResources.map((resource) => <LibraryCard resource={resource} key={resource.title} onSelect={setSelectedResource} />)}</div>{query && !filteredResources.length ? <p className="empty">No resources match “{query}”. Try Python, React, or Design.</p> : null}</Section>
      <Section title="New Arrivals" onAction={() => setSelectedResource(newArrivals[0])}><div className="resource-grid">{newArrivals.map((resource) => <LibraryCard resource={resource} key={resource.title} onSelect={setSelectedResource} />)}</div></Section>
      <section className="newsletter"><div><h2>Stay Updated</h2><p>Subscribe to get the latest resources, courses & updates</p></div><form onSubmit={subscribe}><input aria-label="Email address" type="email" required placeholder="Enter your email" /><button>{newsletterStatus === 'subscribed' ? 'Subscribed ✓' : 'Subscribe'}</button></form><span className="paper">✉</span></section>
      <footer><Brand /><p>Empowering minds. Building the future.</p><div><a href="#about">About</a><a href="#contact">Contact</a><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div></footer>
    </main>
    {selectedResource && <div className="modal-backdrop" onClick={() => setSelectedResource(null)}><article className="resource-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedResource(null)} aria-label="Close resource detail">×</button><span>{selectedResource.type}</span><h2>{selectedResource.title}</h2><p>{selectedResource.subtitle} · {selectedResource.rating}</p><button className="signup" onClick={() => setSelectedResource(null)}>Add to Library</button></article></div>}
  </div>;
}

export default App;
