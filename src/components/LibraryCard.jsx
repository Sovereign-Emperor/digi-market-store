// This card renders one resource tile in the catalog. It keeps the click handler simple so
// selecting a book or course navigates to the detail view without extra state management.
export default function LibraryCard({ resource, onSelect }) {
  return (
    <button
      className="resource-card"
      onClick={() => onSelect(resource)}
      aria-label={`Open ${resource.title}`}
    >
      <div className={`cover ${resource.art}`}>
        <span className="cover-type">{resource.type}</span>
        <div className="cover-art">{resource.symbol}</div>
        <strong>{resource.title}</strong>
        <small>{resource.subtitle}</small>
      </div>

      {/* The footer row shows the rating and access level so users can quickly tell whether a
      resource is free or premium before opening it. */}
      <div className="resource-info">
        <div>
          <span className="star">★</span> {resource.rating}
        </div>
        <span className={resource.access === 'Premium' ? 'premium' : 'free'}>
          {resource.access}
        </span>
      </div>
    </button>
  );
}
