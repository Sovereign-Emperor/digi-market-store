import Brand from './Brand';

function NavigationList({ items, activeItem, onNavigate }) {
  return <nav>{items.map(([icon, label]) => <button key={label} className={activeItem === label ? 'active' : ''} onClick={() => onNavigate(label)}><i>{icon}</i>{label}</button>)}</nav>;
}

export default function Sidebar({ primaryItems, accountItems, activeItem, onNavigate }) {
  return <aside className="sidebar"><Brand /><NavigationList items={primaryItems} activeItem={activeItem} onNavigate={onNavigate} /><div className="nav-divider" /><div className="account-nav"><NavigationList items={accountItems} activeItem={activeItem} onNavigate={onNavigate} /></div></aside>;
}
