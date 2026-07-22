import { Check, ChevronDown, Plus, Trash2, X } from "lucide-react";

export function Button({ icon: Icon, variant = "primary", children, className = "", ...props }) {
  return (
    <button className={`admin-button admin-button-${variant} ${className}`} {...props}>
      {Icon && <Icon size={16} strokeWidth={1.8} aria-hidden="true" />}
      {children}
    </button>
  );
}

export function IconButton({ icon: Icon, label, variant = "ghost", className = "", ...props }) {
  return (
    <button className={`admin-icon-button admin-icon-button-${variant} ${className}`} aria-label={label} title={label} {...props}>
      <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}

export function Field({ label, hint, error, children, className = "" }) {
  return (
    <label className={`admin-field ${className}`}>
      <span className="admin-field-label">{label}</span>
      {children}
      {hint && <span className="admin-field-hint">{hint}</span>}
      {error && <span className="admin-field-error">{error}</span>}
    </label>
  );
}

export function Input(props) {
  return <input className="admin-input" {...props} />;
}

export function Textarea(props) {
  return <textarea className="admin-input admin-textarea" {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <span className="admin-select-wrap">
      <select className="admin-input admin-select" {...props}>{children}</select>
      <ChevronDown size={15} aria-hidden="true" />
    </span>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="admin-toggle-row">
      <button type="button" role="switch" aria-checked={checked} className={`admin-toggle ${checked ? "is-on" : ""}`} onClick={() => onChange(!checked)}>
        <span>{checked && <Check size={12} strokeWidth={2.4} />}</span>
      </button>
      <span>{label}</span>
    </label>
  );
}

export function Section({ title, description, children }) {
  return (
    <section className="admin-form-section">
      <div className="admin-form-section-head">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      <div className="admin-form-section-body">{children}</div>
    </section>
  );
}

export function Repeater({ title, addLabel, items, onChange, createItem, renderItem }) {
  const update = (index, next) => onChange(items.map((item, itemIndex) => itemIndex === index ? next : item));
  const remove = (index) => onChange(items.filter((_, itemIndex) => itemIndex !== index));
  return (
    <div className="admin-repeater">
      <div className="admin-repeater-head">
        <div><strong>{title}</strong><span>{items.length} item</span></div>
        <Button type="button" variant="secondary" icon={Plus} onClick={() => onChange([...items, createItem()])}>{addLabel}</Button>
      </div>
      {items.length === 0 ? <p className="admin-repeater-empty">Belum ada item.</p> : (
        <div className="admin-repeater-list">
          {items.map((item, index) => (
            <div className="admin-repeater-item" key={item.id || `${title}-${index}`}>
              <span className="admin-repeater-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="admin-repeater-fields">{renderItem(item, (next) => update(index, next), index)}</div>
              <IconButton type="button" variant="danger" icon={Trash2} label={`Hapus ${title} ${index + 1}`} onClick={() => remove(index)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Drawer({ open, title, eyebrow, children, footer, onClose }) {
  if (!open) return null;
  return (
    <div className="admin-drawer-layer" role="presentation">
      <button className="admin-drawer-backdrop" aria-label="Tutup editor" onClick={onClose} />
      <aside className="admin-drawer" role="dialog" aria-modal="true" aria-labelledby="admin-drawer-title">
        <header className="admin-drawer-head">
          <div><span>{eyebrow}</span><h2 id="admin-drawer-title">{title}</h2></div>
          <IconButton icon={X} label="Tutup editor" onClick={onClose} />
        </header>
        <div className="admin-drawer-content">{children}</div>
        <footer className="admin-drawer-footer">{footer}</footer>
      </aside>
    </div>
  );
}

export function ConfirmDialog({ open, title, description, pending, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="admin-modal-layer" role="presentation">
      <div className="admin-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description">
        <div className="admin-modal-icon"><Trash2 size={22} /></div>
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-description">{description}</p>
        <div className="admin-modal-actions">
          <Button variant="secondary" onClick={onCancel} disabled={pending}>Batal</Button>
          <Button variant="danger" icon={Trash2} onClick={onConfirm} disabled={pending}>{pending ? "Menghapus..." : "Hapus"}</Button>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ value }) {
  return <span className={`admin-status admin-status-${String(value).toLowerCase()}`}>{value}</span>;
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="admin-empty-state">
      <Icon size={30} strokeWidth={1.4} aria-hidden="true" />
      <h3>{title}</h3><p>{description}</p>{action}
    </div>
  );
}

export function LoadingRows({ columns = 4 }) {
  return Array.from({ length: 5 }, (_, index) => (
    <tr key={index} className="admin-loading-row">
      {Array.from({ length: columns }, (_, cell) => <td key={cell}><span /></td>)}
    </tr>
  ));
}
