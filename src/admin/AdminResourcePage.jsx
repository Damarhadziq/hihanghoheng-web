import { useMemo, useState } from "react";
import { FilePlus2, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useAdminList, useAdminResourceMutations } from "../hooks/useApiQueries";
import { Button, ConfirmDialog, Drawer, EmptyState, IconButton, Input, LoadingRows } from "./AdminUI";

export default function AdminResourcePage({
  resource, title, description, singular, columns, emptyValue, toForm = (item) => item,
  toPayload = (form) => form, Form, canDelete = false, getSearchText = (item) => JSON.stringify(item), afterSave,
}) {
  const query = useAdminList(resource);
  const mutations = useAdminResourceMutations(resource);
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState(emptyValue());
  const [deleteItem, setDeleteItem] = useState(null);
  const [notice, setNotice] = useState("");

  const items = useMemo(() => Array.isArray(query.data) ? query.data : [], [query.data]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? items.filter((item) => getSearchText(item).toLowerCase().includes(term)) : items;
  }, [getSearchText, items, search]);

  const openCreate = () => { setEditor({ mode: "create" }); setForm(emptyValue()); setNotice(""); };
  const openEdit = (item) => { setEditor({ mode: "edit", item }); setForm(toForm(item)); setNotice(""); };
  const closeEditor = () => { if (!mutations.create.isPending && !mutations.update.isPending) setEditor(null); };
  const saving = mutations.create.isPending || mutations.update.isPending;

  const save = async (event) => {
    event.preventDefault();
    setNotice("");
    try {
      const payload = toPayload(form);
      const saved = editor.mode === "create"
        ? await mutations.create.mutateAsync(payload)
        : await mutations.update.mutateAsync({ id: editor.item.id, input: payload });
      await afterSave?.(saved, form);
      setEditor(null);
      setNotice(`${singular} berhasil ${editor.mode === "create" ? "ditambahkan" : "diperbarui"}.`);
    } catch (error) {
      setNotice(error.message || `Gagal menyimpan ${singular.toLowerCase()}.`);
    }
  };

  const remove = async () => {
    try {
      await mutations.remove.mutateAsync(deleteItem.id);
      setDeleteItem(null);
      setNotice(`${singular} berhasil dihapus.`);
    } catch (error) {
      setNotice(error.message || `Gagal menghapus ${singular.toLowerCase()}.`);
      setDeleteItem(null);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div><span className="admin-eyebrow">Content management</span><h1>{title}</h1><p>{description}</p></div>
        <Button icon={Plus} onClick={openCreate}>Tambah {singular}</Button>
      </header>

      <div className="admin-toolbar">
        <label className="admin-search"><Search size={17} /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Cari ${title.toLowerCase()}...`} /></label>
        <div className="admin-toolbar-meta"><span>{filtered.length} dari {items.length}</span><IconButton icon={RefreshCw} label="Muat ulang" onClick={() => query.refetch()} /></div>
      </div>
      {(notice || query.error) && <div className="admin-notice" role="status">{notice || query.error?.message}</div>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}<th className="admin-table-actions-head">Aksi</th></tr></thead>
          <tbody>
            {query.isPending ? <LoadingRows columns={columns.length + 1} /> : filtered.map((item) => (
              <tr key={item.id}>
                {columns.map((column) => <td key={column.key} data-label={column.label}>{column.render(item)}</td>)}
                <td className="admin-table-actions">
                  <IconButton icon={Pencil} label={`Edit ${singular}`} onClick={() => openEdit(item)} />
                  {canDelete && <IconButton icon={Trash2} variant="danger" label={`Hapus ${singular}`} onClick={() => setDeleteItem(item)} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!query.isPending && filtered.length === 0 && <EmptyState icon={FilePlus2} title={search ? "Tidak ada hasil" : `${title} masih kosong`} description={search ? "Coba gunakan kata kunci lain." : `Tambahkan ${singular.toLowerCase()} pertama untuk mulai mengelola konten.`} action={!search && <Button icon={Plus} onClick={openCreate}>Tambah {singular}</Button>} />}
      </div>

      <Drawer open={Boolean(editor)} eyebrow={editor?.mode === "create" ? "Konten baru" : "Edit konten"} title={editor?.mode === "create" ? `Tambah ${singular}` : `Edit ${singular}`} onClose={closeEditor} footer={<><Button type="button" variant="secondary" onClick={closeEditor}>Batal</Button><Button type="submit" form={`${resource}-form`} disabled={saving}>{saving ? "Menyimpan..." : "Simpan perubahan"}</Button></>}>
        <form id={`${resource}-form`} className="admin-form" onSubmit={save}><Form value={form} onChange={setForm} mode={editor?.mode} /></form>
      </Drawer>
      <ConfirmDialog open={Boolean(deleteItem)} title={`Hapus ${singular}?`} description={`“${deleteItem?.name || deleteItem?.title || deleteItem?.label || deleteItem?.id}” akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`} pending={mutations.remove.isPending} onCancel={() => setDeleteItem(null)} onConfirm={remove} />
    </div>
  );
}
