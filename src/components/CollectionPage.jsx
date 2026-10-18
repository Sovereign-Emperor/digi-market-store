import { useMemo, useState } from 'react';
import LibraryCard from './LibraryCard';
import EmptyState from './ui/EmptyState';
import Section from './Section';
import { newArrivals, resources } from '../data/library';
import { useLibrary } from '../context/LibraryContext';

const allResources = [...resources, ...newArrivals];

// Reusable collection surface for resource types and a user's saved/downloaded/history lists.
// TODO(backend): Accept server pagination metadata and load more items when a collection grows.
export default function CollectionPage({ title, description, kinds = [], stateKey, onSelect }) {
  const [access, setAccess] = useState('All');
  const state = useLibrary();
  const selectedIds = stateKey ? state[stateKey] || [] : null;
  const items = useMemo(() => allResources.filter((resource) => {
    const typeMatches = !kinds.length || kinds.includes(resource.type);
    const stateMatches = !selectedIds || selectedIds.includes(resource.title);
    const accessMatches = access === 'All' || resource.access === access;
    return typeMatches && stateMatches && accessMatches;
  }), [access, kinds, selectedIds]);

  return <section className="page"><div className="breadcrumb">Library › {title}</div><h1>{title}</h1><p className="page-intro">{description}</p><div className="filters"><div>{['All', 'Free', 'Premium'].map((label) => <button className={access === label ? 'selected' : ''} onClick={() => setAccess(label)} key={label}>{label}</button>)}</div><button onClick={() => setAccess('All')}>Reset filters</button></div>{items.length ? <div className="catalog-grid">{items.map((resource) => <LibraryCard key={resource.title} resource={resource} onSelect={onSelect} />)}</div> : <EmptyState title={`No ${title.toLowerCase()} yet`} detail={stateKey ? 'Items you save, download, or open will appear here.' : 'Try another access filter or check back as the catalog grows.'} action={<button className="signup" onClick={() => setAccess('All')}>Show all</button>} />}</section>;
}

export function CommunityPage() {
  const [posts, setPosts] = useState([{ name: 'Daniel Lewis', body: 'What project are you building with Python this week?' }, { name: 'Sarah Johnson', body: 'I just finished the React guide—highly recommended.' }]);
  const [draft, setDraft] = useState('');
  function publish(event) { event.preventDefault(); if (!draft.trim()) return; setPosts((items) => [{ name: 'You', body: draft.trim() }, ...items]); setDraft(''); }
  return <section className="page"><div className="breadcrumb">Library › Community</div><h1>Community</h1><p className="page-intro">Share progress, ask questions, and discover what other learners are creating.</p><form className="community-form" onSubmit={publish}><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Start a discussion…" maxLength="280" /><button className="signup">Publish post</button></form><Section title="Recent discussions">{<div className="discussion-list">{posts.map((post, index) => <article key={`${post.name}-${index}`}><b>{post.name}</b><p>{post.body}</p><small>♥ Like · Reply</small></article>)}</div>}</Section></section>;
}

export function SettingsPage() {
  const { preferences, updatePreferences } = useLibrary();
  const [saved, setSaved] = useState(false);
  function save(event) { event.preventDefault(); setSaved(true); }
  return <section className="page settings-page"><div className="breadcrumb">Account › Settings</div><h1>Settings</h1><form className="settings-form" onSubmit={save}><h2>Notifications</h2><label><span>Learning updates</span><input type="checkbox" checked={preferences.emailUpdates} onChange={(event) => updatePreferences({ emailUpdates: event.target.checked })} /></label><h2>Appearance</h2><label><span>Theme</span><select value={preferences.theme} onChange={(event) => updatePreferences({ theme: event.target.value })}><option value="dark">Dark</option><option value="system">System</option></select></label><button className="signup">Save settings</button>{saved && <small className="form-notice">Settings saved on this device.</small>}</form></section>;
}
