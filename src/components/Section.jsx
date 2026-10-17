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
