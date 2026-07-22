import { Children, useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, CircleCheck, CircleX, FileText, Plus, Trash2, UploadCloud, X } from "lucide-react";

const animationMs = 180;

function usePresence(open) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), animationMs);
    return () => window.clearTimeout(timer);
  }, [open]);

  return { mounted, visible };
}

export function Button({ icon: Icon, variant = "primary", children, className = "", ...props }) {
  return (
    <button className={`admin-button admin-button-${variant} ${className}`} {...props}>
      {Icon && <Icon size={15} strokeWidth={1.8} aria-hidden="true" />}
      {children}
    </button>
  );
}

export function IconButton({ icon: Icon, label, variant = "ghost", className = "", ...props }) {
  return (
    <button className={`admin-icon-button admin-icon-button-${variant} ${className}`} aria-label={label} title={label} {...props}>
      <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
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

export function Select({ children, value = "", onChange, disabled, placeholder, name, required, ...props }) {
  const id = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const options = Children.toArray(children)
    .filter((child) => child?.type === "option")
    .map((child) => ({
      value: String(child.props.value ?? ""),
      label: child.props.children,
      disabled: Boolean(child.props.disabled),
    }));
  const selected = options.find((option) => option.value === String(value));

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const toggle = () => {
    if (disabled) return;
    const rect = rootRef.current?.getBoundingClientRect();
    setOpenUp(Boolean(rect && window.innerHeight - rect.bottom < 240 && rect.top > 240));
    setOpen((current) => !current);
  };

  const choose = (next) => {
    if (next.disabled) return;
    onChange?.({ target: { value: next.value, name } });
    setOpen(false);
  };

  const move = (direction) => {
    const available = options.filter((option) => !option.disabled);
    const current = available.findIndex((option) => option.value === String(value));
    const nextIndex = current < 0 ? 0 : (current + direction + available.length) % available.length;
    choose(available[nextIndex]);
  };

  return (
    <span ref={rootRef} className={`admin-select-wrap ${open ? "is-open" : ""} ${openUp ? "opens-up" : ""}`}>
      <button
        id={id}
        type="button"
        className="admin-input admin-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-required={required || undefined}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            move(event.key === "ArrowDown" ? 1 : -1);
          }
        }}
        {...props}
      >
        <span className={selected?.value ? "" : "is-placeholder"}>{selected?.label ?? placeholder ?? "Pilih opsi"}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <span className="admin-select-menu" role="listbox" aria-labelledby={id} aria-hidden={!open}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            tabIndex={open ? 0 : -1}
            role="option"
            aria-selected={option.value === String(value)}
            disabled={option.disabled}
            onClick={() => choose(option)}
          >
            <span>{option.label}</span>
            {option.value === String(value) && <Check size={14} strokeWidth={2.2} />}
          </button>
        ))}
      </span>
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

export function Drawer({ open, title, eyebrow, children, footer, onClose, width = "default" }) {
  const { mounted, visible } = usePresence(open);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const escape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", escape);
    };
  }, [onClose, open]);

  if (!mounted) return null;
  return (
    <div className={`admin-drawer-layer ${visible ? "is-visible" : "is-leaving"}`} role="presentation">
      <button className="admin-drawer-backdrop" aria-label="Tutup editor" onClick={onClose} />
      <aside className={`admin-drawer admin-drawer-${width}`} role="dialog" aria-modal="true" aria-labelledby="admin-drawer-title">
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
  const { mounted, visible } = usePresence(open);
  if (!mounted) return null;
  return (
    <div className={`admin-modal-layer ${visible ? "is-visible" : "is-leaving"}`} role="presentation">
      <div className="admin-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description">
        <div className="admin-modal-icon"><Trash2 size={21} /></div>
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

export function Toast({ message, type = "success", onDismiss, duration = 3200 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    const hideTimer = window.setTimeout(() => setVisible(false), duration);
    const removeTimer = window.setTimeout(onDismiss, duration + animationMs);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, [duration, message, onDismiss]);

  const Icon = type === "error" ? CircleX : CircleCheck;
  return (
    <div className={`admin-toast admin-toast-${type} ${visible ? "is-visible" : ""}`} role={type === "error" ? "alert" : "status"}>
      <Icon size={17} strokeWidth={1.9} />
      <span>{message}</span>
      <IconButton icon={X} label="Tutup notifikasi" onClick={onDismiss} />
    </div>
  );
}

export function FileDropzone({ value, onUpload, onError, uploading = false, error = "" }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const accept = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) { onError?.("File harus berformat PDF."); return; }
    onUpload(file);
  };

  return (
    <div className="admin-file-field">
      <button
        type="button"
        className={`admin-file-dropzone ${dragging ? "is-dragging" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          accept(event.dataTransfer.files?.[0]);
        }}
        disabled={uploading}
      >
        <span className="admin-file-icon">{uploading ? <span className="admin-file-spinner" /> : <UploadCloud size={20} />}</span>
        <span><strong>{uploading ? "Mengunggah proposal..." : "Tarik PDF ke sini atau pilih file"}</strong><small>PDF, maksimum 4 MB</small></span>
      </button>
      <input ref={inputRef} className="admin-visually-hidden" type="file" accept="application/pdf,.pdf" onChange={(event) => accept(event.target.files?.[0])} />
      {value && <a className="admin-uploaded-file" href={value} target="_blank" rel="noreferrer"><FileText size={16} /><span><strong>Proposal tersimpan</strong><small>{value.split("/").pop()}</small></span></a>}
      {error && <span className="admin-field-error">{error}</span>}
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
