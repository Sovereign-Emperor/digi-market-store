// A reusable empty state for pages with no matches. It helps explain the situation and gives the
// user a clear action, such as resetting filters or returning to the main catalog.
export default function EmptyState({ title, detail, action }) { return <div className="empty-state"><span>⌕</span><h2>{title}</h2><p>{detail}</p>{action}</div>; }
