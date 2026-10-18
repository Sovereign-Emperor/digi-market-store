import { useEffect, useRef } from 'react';

// This dialog shell adds modal behavior: focus goes to the close button when opened, Escape
// closes it, and the backdrop click closes the modal while the inner panel stops propagation.
export default function Dialog({ title, onClose, children }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus(); const escape = (event) => event.key === 'Escape' && onClose(); window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape); }, [onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="dialog" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}><button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close dialog">×</button>{children}</section></div>;
}
