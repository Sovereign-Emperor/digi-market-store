// A reusable section wrapper for landing-page groups like categories and trending resources.
// It keeps a consistent heading layout and optional action button without repeating markup.
export default function Section({ title, actionLabel = 'View All', onAction, children }) {
  return (
    <section className="section">
      <div className="section-title">
        <h2>{title}</h2>
        {onAction && <button onClick={onAction}>{actionLabel}</button>}
      </div>
      {children}
    </section>
  );
}
