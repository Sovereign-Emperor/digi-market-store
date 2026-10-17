import Brand from './Brand';

function NavigationList({ items, activeItem, onNavigate }) {
  return (
    <nav>
      {items.map(([icon, label]) => (
        <button
          key={label}
          className={activeItem === label ? 'active' : ''}
          onClick={() => onNavigate(label)}
        >
          <i>{icon}</i>
          {label}
        </button>
      ))}
    </nav>
  );
}

export default function Sidebar({
  primaryItems,
  accountItems,
  activeItem,
  onNavigate,
  isOpen,
  onClose,
}) {
  const navigate = (label) => {
    onNavigate(label);
    onClose?.();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
      <div className="sidebar-head">
        <Brand />
        <button className="sidebar-close" onClick={onClose} aria-label="Close navigation">
          ×
        </button>
      </div>

      <div className="sidebar-scroll">
        <NavigationList items={primaryItems} activeItem={activeItem} onNavigate={navigate} />
        <div className="nav-divider" />
        <div className="account-nav">
          <NavigationList items={accountItems} activeItem={activeItem} onNavigate={navigate} />
        </div>
      </div>
    </aside>
  );
}
