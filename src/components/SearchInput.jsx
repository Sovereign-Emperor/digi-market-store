// This input component is the shared search field used in the navigation bar and landing page.
// It controls the current query value and passes updates upward so the parent can decide what to search.
export default function SearchInput({ query, onQueryChange, className = '' }) {
  return (
    <label className={`search ${className}`}>
      <span>⌕</span>
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search for books, courses, tutorials, docs..."
      />
    </label>
  );
}
