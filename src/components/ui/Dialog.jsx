import { useEffect, useRef } from 'react';

export default function Dialog({ title, onClose, children }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus(); const escape = (event) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape); }, [onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="dialog" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}><button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close dialog">×</button>{children}</section></div>;
}
