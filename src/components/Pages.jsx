import { useMemo, useState } from 'react';
import LibraryCard from './LibraryCard';
import Section from './Section';
import { categories, newArrivals, resources } from '../data/library';
import { useLibrary } from '../context/LibraryContext';
import EmptyState from './ui/EmptyState';
import ProgressBar from './ui/ProgressBar';

export function LandingPage({ onNavigate, onSelect }) {
  const [query, setQuery] = useState('');
  const matches = useMemo(
    () => resources.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <h1>
            Your Ultimate
            <br />
            <em>Digital Library</em>
          </h1>
          <p>
            Books, Courses, Tutorials, Source Code, PDFs,
            <br />
            Templates &amp; more. All in One Place.
          </p>
          <div className="hero-search">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for books, courses, tutorials, code..."
            />
            <button onClick={() => onNavigate('Search Results')}>Search</button>
          </div>
          <div className="popular">
            Popular: <span>Python</span>
            <span>JavaScript</span>
            <span>Web Development</span>
            <span>Machine Learning</span>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="spark s1">✦</div>
          <div className="spark s2">✧</div>
          <div className="royal-crown">♛</div>
          <div className="book book-a" />
          <div className="book book-b" />
          <div className="book book-c" />
        </div>

        <div className="stats">
          {[
            ['10K+', 'Resources'],
            ['50+', 'Categories'],
            ['5K+', 'Users'],
            ['100K+', 'Downloads'],
          ].map(([value, label]) => (
            <div key={label}>
              <b>{value}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <Section title="Top Categories" onAction={() => onNavigate('Categories')}>
        <div className="category-grid">
          {categories.map((item) => (
            <button className="category" key={item.name} onClick={() => onNavigate('Categories')}>
              <span className={`cat-icon ${item.color}`}>{item.icon}</span>
              <b>{item.name}</b>
              <small>{item.count} Resources</small>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Trending Resources" onAction={() => onNavigate('Books')}>
        <div className="resource-grid">
          {(query ? matches : resources).map((resource) => (
            <LibraryCard resource={resource} key={resource.title} onSelect={onSelect} />
          ))}
        </div>
      </Section>

      <Section title="New Arrivals" onAction={() => onNavigate('Books')}>
        <div className="resource-grid">
          {newArrivals.map((resource) => (
            <LibraryCard resource={resource} key={resource.title} onSelect={onSelect} />
          ))}
        </div>
      </Section>
    </>
  );
}

export function CategoriesPage({ onNavigate }) {
  return (
    <Page title="All Categories" crumb="Home › Categories">
      <div className="categories-large">
        {categories
          .concat([
            { icon: '▣', name: 'Mobile Development', count: '670', color: 'violet' },
            { icon: '◌', name: 'Cyber Security', count: '950', color: 'teal' },
            { icon: '▧', name: 'Finance', count: '610', color: 'gold' },
            { icon: '◈', name: 'Others', count: '1,420', color: 'blue' },
          ])
          .map((item) => (
            <button
              key={item.name}
              className="category category-wide"
              onClick={() => onNavigate('Books')}
            >
              <span className={`cat-icon ${item.color}`}>{item.icon}</span>
              <b>{item.name}</b>
              <small>{item.count} Resources</small>
            </button>
          ))}
      </div>
    </Page>
  );
}

export function CatalogPage({ type, onSelect }) {
  const list =
    type === 'Courses'
      ? [...resources.slice(1), ...newArrivals.slice(1, 4)]
      : [...resources, ...newArrivals];
  const [filter, setFilter] = useState('All');
  const filtered = list.filter(
    (item) => filter === 'All' || item.access === filter || item.type === filter,
  );

  return (
    <Page title={type} crumb={`Home › ${type}`}>
      <div className="filters">
        <div>
          {['All', 'Free', 'Premium', 'PDF', 'Course'].map((name) => (
            <button
              className={filter === name ? 'selected' : ''}
              key={name}
              onClick={() => setFilter(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <button onClick={() => setFilter('All')}>Reset filters</button>
      </div>

      <div className="catalog-grid">
        {filtered.length ? (
          filtered.map((resource) => (
            <LibraryCard resource={resource} key={resource.title} onSelect={onSelect} />
          ))
        ) : (
          <EmptyState
            title="No resources in this filter"
            detail="Try choosing another access level or resource type."
            action={
              <button className="signup" onClick={() => setFilter('All')}>
                Show all
              </button>
            }
          />
        )}
      </div>
    </Page>
  );
}

export function ResourceDetail({ resource, onRead, onBack }) {
  const { library, downloads, toggleSaved, download } = useLibrary();
  const id = resource.title;
  const saved = library.includes(id);
  const downloaded = downloads.includes(id);

  return (
    <Page title="Resource Detail" crumb="Home › Books › Programming">
      <button className="back-button" onClick={onBack}>
        ← Back to library
      </button>

      <div className="detail-layout">
        <div className={`detail-cover ${resource.art}`}>
          <span>{resource.type}</span>
          <b>{resource.title}</b>
          <i>{resource.symbol}</i>
        </div>

        <div className="detail-copy">
          <h1>
            {resource.title}
            <br />
            {resource.subtitle}
          </h1>
          <p className="rating">
            ★★★★★ <span>{resource.rating}</span>
          </p>
          <p>By Eric Matthes · Published 2019</p>
          <p className="description">
            A hands-on, project-based introduction to programming with Python. Learn practical
            concepts and build confidence with accessible explanations.
          </p>

          <div className="tags">
            <span>Programming</span>
            <span>Python</span>
            <span>Beginner</span>
          </div>

          <div className="detail-actions">
            <button className="signup" onClick={onRead}>
              Read Online
            </button>
            <button onClick={() => download(id)}>
              {downloaded ? '✓ Downloaded' : '⇩ Download (25.4 MB)'}
            </button>
            <button onClick={() => toggleSaved(id)}>
              {saved ? '✓ In Library' : '▱ Add to Library'}
            </button>
          </div>
        </div>

        <aside className="also-like">
          <b>You may also like</b>
          {resources.slice(1, 4).map((item) => (
            <button key={item.title}>
              {item.title}
              <small>★ {item.rating}</small>
            </button>
          ))}
        </aside>
      </div>

      <div className="content-panel">
        <h2>About this resource</h2>
        <p>
          Python Crash Course is a practical guide designed to take you from the fundamentals to
          real-world projects. Work through clean examples, challenges and small applications at
          your own pace.
        </p>
        <h2>What you'll learn</h2>
        <ul>
          <li>Write clean and efficient Python code</li>
          <li>Build games and data visualizations</li>
          <li>Work with APIs and web services</li>
        </ul>
      </div>
    </Page>
  );
}

export function ReaderPage({ resource, onBack }) {
  const { progress, saveProgress, toggleBookmark, bookmarks } = useLibrary();
  const [page, setPage] = useState(progress[resource.title] || 54);

  const updatePage = (next) => {
    const value = Math.max(1, Math.min(544, next));
    setPage(value);
    saveProgress(resource.title, value);
  };

  return (
    <div className="reader">
      <header>
        <button onClick={onBack}>← Library</button>
        <b>{resource.title}</b>
        <div>
          <button onClick={() => updatePage(page - 1)}>−</button>
          <span>{page} / 544</span>
          <button onClick={() => updatePage(page + 1)}>+</button>
          <button onClick={() => toggleBookmark(resource.title)}>
            {bookmarks.includes(resource.title) ? '★ Saved' : '☆ Bookmark'}
          </button>
        </div>
      </header>

      <div className="reader-body">
        <aside>
          <b>Table of Contents</b>
          {[
            'Getting Started',
            'Variables and Simple Data Types',
            'Lists',
            'If Statements',
            'Dictionaries',
            'Functions',
            'Classes',
            'Files and Exceptions',
            'Testing Your Code',
            'Projects',
          ].map((chapter, index) => (
            <button
              key={chapter}
              className={index === 0 ? 'active' : ''}
              onClick={() => updatePage(index * 50 + 1)}
            >
              {index + 1}. {chapter}
            </button>
          ))}
        </aside>

        <article>
          <span>CHAPTER 1</span>
          <h1>GETTING STARTED</h1>
          <p>
            Python is a powerful programming language that's easy to learn. In this chapter,
            you'll write your first program and learn how to run it.
          </p>
          <div className="rocket">♜</div>
          <p>
            Python's concise syntax lets you focus on the ideas behind your code. With a few basic
            tools, you can create programs that solve real problems.
          </p>
        </article>
      </div>
    </div>
  );
}

export function VideoPage({ onBack }) {
  const { progress, saveProgress } = useLibrary();
  const [playing, setPlaying] = useState(false);
  const [lesson, setLesson] = useState(0);
  const lessons = [
    'Introduction',
    'Python Setup',
    'Variables and Types',
    'Operators',
    'Control Flow',
    'Functions',
    'Lists and Tuples',
    'Dictionaries',
  ];
  const progressValue = progress['python-video'] || 18;

  const play = () => {
    setPlaying((value) => !value);
    saveProgress('python-video', Math.min(100, progressValue + 5));
  };

  return (
    <div className="video-page">
      <header className="video-header">
        <button onClick={onBack}>← Back</button>
        <div>
          <span>Video Lesson</span>
          <b>{lessons[lesson]}</b>
        </div>
        <button onClick={play}>{playing ? 'Pause' : 'Play'}</button>
      </header>

      <div className="video-layout">
        <aside className="video-sidebar">
          {lessons.map((item, index) => (
            <button
              key={item}
              className={index === lesson ? 'active' : ''}
              onClick={() => setLesson(index)}
            >
              {index + 1}. {item}
            </button>
          ))}
        </aside>

        <div className="video-player">
          <div className="video-screen">{playing ? '▶' : '◼'}</div>
          <ProgressBar value={progressValue} />
          <div className="video-controls">
            <button onClick={() => setLesson((value) => (value > 0 ? value - 1 : value))}>
              Previous
            </button>
            <button onClick={() => setLesson((value) => (value < lessons.length - 1 ? value + 1 : value))}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchPage({ initialQuery, onSelect }) {
  const [query, setQuery] = useState(initialQuery || 'python');
  const [kind, setKind] = useState('All');
  const shown = resources
    .concat(newArrivals)
    .filter(
      (item) =>
        (kind === 'All' || item.type === kind) &&
        item.title.toLowerCase().includes(query.toLowerCase()),
    );

  return (
    <Page title="Search Results" crumb="Home › Search">
      <input
        className="search-page-input"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search resources"
      />

      <div className="search-tabs">
        {['All', 'PDF', 'Course', 'ZIP'].map((item) => (
          <button
            className={kind === item ? 'selected' : ''}
            onClick={() => setKind(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="search-results">
        {shown.length ? (
          shown.map((resource) => (
            <button key={resource.title} onClick={() => onSelect(resource)}>
              <b>{resource.title}</b>
              <span>
                {resource.type} · {resource.subtitle}
              </span>
              <i>★ {resource.rating}</i>
            </button>
          ))
        ) : (
          <EmptyState
            title="No matching resources"
            detail="Try a different keyword or clear the selected resource type."
            action={
              <button
                className="signup"
                onClick={() => {
                  setQuery('');
                  setKind('All');
                }}
              >
                Clear filters
              </button>
            }
          />
        )}
      </div>
    </Page>
  );
}

export function DashboardPage({ onNavigate }) {
  return (
    <Page title="Welcome back, Enock Atikpo 👋" crumb="Dashboard">
      <div className="dashboard-grid">
        <section className="continue">
          <h2>Continue Learning</h2>
          <div className="resource-grid">
            {resources.slice(1, 5).map((item) => (
              <button className="dash-book" key={item.title} onClick={() => onNavigate('Courses')}>
                <span className={item.art}>{item.symbol}</span>
                <b>{item.title}</b>
                <small>Course · 67%</small>
              </button>
            ))}
          </div>
        </section>

        <section className="stats-card">
          <h2>Your Stats</h2>
          {[
            ['Resources', '127'],
            ['Downloads', '342'],
            ['Bookmarks', '89'],
            ['Hours Learning', '78'],
          ].map(([name, value]) => (
            <p key={name}>
              <span>{name}</span>
              <b>{value}</b>
            </p>
          ))}
        </section>

        <section className="activity">
          <h2>Recent Activity</h2>
          {[
            'Downloaded React — The Complete Guide',
            'Read Python Crash Course',
            'Bookmarked JavaScript Algorithms',
          ].map((item) => (
            <p key={item}>
              ◈ {item}
              <small>2 days ago</small>
            </p>
          ))}
        </section>
      </div>
    </Page>
  );
}

export function AdminPage() {
  return (
    <Page title="Admin Dashboard" crumb="Admin Panel">
      <div className="admin-stats">
        {[
          ['Total Resources', '10,247'],
          ['Total Users', '5,342'],
          ['Total Downloads', '102.5K'],
          ['Total Earnings', 'GH₵ 12,560'],
        ].map(([name, value]) => (
          <div key={name}>
            <span>{name}</span>
            <b>{value}</b>
            <small>↗ 12.5%</small>
          </div>
        ))}
      </div>

      <div className="admin-grid">
        <section className="chart">
          <h2>Downloads Overview</h2>
          <div className="chart-line">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <span>1 May　　 8 May　　 15 May　　 22 May　　 29 May</span>
        </section>

        <section className="top-resources">
          <h2>Top Resources</h2>
          {resources.map((item, index) => (
            <p key={item.title}>
              {index + 1}. {item.title}
              <b>{12 - index * 1.4}K</b>
            </p>
          ))}
        </section>
      </div>
    </Page>
  );
}

function Page({ title, crumb, children }) {
  return (
    <section className="page">
      <div className="breadcrumb">{crumb}</div>
      <h1>{title}</h1>
      {children}
    </section>
  );
}
