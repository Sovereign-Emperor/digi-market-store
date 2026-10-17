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
