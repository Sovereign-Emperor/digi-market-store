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
