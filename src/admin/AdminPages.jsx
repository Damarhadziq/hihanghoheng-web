import { useEffect, useState } from "react";
import { Award, FileImage, FileText, FolderKanban, Save, Users } from "lucide-react";
import { useAdminList, useSaveAchievementDocumentation, useUpdateSiteSetting, useUploadProposal } from "../hooks/useApiQueries";
import AdminResourcePage from "./AdminResourcePage";
import { Button, Drawer, Field, FileDropzone, IconButton, Input, Repeater, Section, Select, StatusBadge, Textarea, Toast, Toggle } from "./AdminUI";

const nullable = (value) => value?.trim() || null;
const listFromText = (value) => value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
const textFromList = (items = []) => items.join("\n");
const slugify = (value) => value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const emptyProject = () => ({
  slug: "", name: "", year: new Date().getFullYear(), description: "", externalUrl: "", coverImageUrl: "", landscapeImageUrl: "",
  type: "UI/UX Competition", organizer: "", competition: "", problem: "", solution: "", status: "draft", featured: false, sortOrder: 0,
  tagsText: "", timeline: [], mockups: [], contributors: [],
});

const projectToForm = (item) => ({
  ...emptyProject(), ...item, tagsText: (item.tags || []).join(", "),
  timeline: item.timeline || [], mockups: item.mockups || [],
  contributors: (item.contributors || []).map((person) => ({ teamMemberId: person.id, role: person.contributionRole || person.role })),
});

const projectToPayload = (form) => ({
  slug: form.slug, name: form.name, year: Number(form.year), description: form.description,
  externalUrl: nullable(form.externalUrl), coverImageUrl: form.coverImageUrl, landscapeImageUrl: nullable(form.landscapeImageUrl),
  type: form.type, organizer: form.organizer, competition: form.competition, problem: form.problem, solution: form.solution,
  status: form.status, featured: Boolean(form.featured), sortOrder: Number(form.sortOrder), tags: listFromText(form.tagsText),
  timeline: form.timeline.map(({ phase, duration, title, detail }) => ({ phase, duration, title, detail })),
  mockups: form.mockups.map(({ title, imageUrl, altText }) => ({ title, imageUrl, altText })),
  contributors: form.contributors.filter((item) => item.teamMemberId).map(({ teamMemberId, role }) => ({ teamMemberId, role })),
});

function ProjectForm({ value, onChange }) {
  const { data: members = [] } = useAdminList("teamMembers");
  const set = (key, next) => onChange({ ...value, [key]: next });
  const setName = (name) => onChange({ ...value, name, slug: value.slug || slugify(name) });
  return (
    <>
      <Section title="Identitas proyek" description="Informasi utama yang tampil pada daftar dan halaman detail.">
        <div className="admin-form-grid admin-form-grid-2">
          <Field label="Nama proyek"><Input required value={value.name} onChange={(event) => setName(event.target.value)} /></Field>
          <Field label="Slug" hint="Huruf kecil, angka, dan tanda hubung."><Input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={value.slug} onChange={(event) => set("slug", slugify(event.target.value))} /></Field>
          <Field label="Tahun"><Input required type="number" min="2000" max="2100" value={value.year} onChange={(event) => set("year", event.target.value)} /></Field>
          <Field label="Urutan"><Input required type="number" value={value.sortOrder} onChange={(event) => set("sortOrder", event.target.value)} /></Field>
          <Field label="Status"><Select value={value.status} onChange={(event) => set("status", event.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></Select></Field>
          <div className="admin-field admin-field-toggle"><span className="admin-field-label">Sorotan</span><Toggle checked={value.featured} onChange={(next) => set("featured", next)} label="Tampilkan sebagai featured project" /></div>
        </div>
        <Field label="Deskripsi singkat"><Textarea required rows="3" value={value.description} onChange={(event) => set("description", event.target.value)} /></Field>
        <Field label="Tags" hint="Pisahkan dengan koma."><Input value={value.tagsText} onChange={(event) => set("tagsText", event.target.value)} placeholder="UI/UX Competition, Mobile App" /></Field>
      </Section>
      <Section title="Konteks kompetisi">
        <div className="admin-form-grid admin-form-grid-2">
          <Field label="Tipe"><Input required value={value.type} onChange={(event) => set("type", event.target.value)} /></Field>
          <Field label="Organizer"><Input required value={value.organizer} onChange={(event) => set("organizer", event.target.value)} /></Field>
        </div>
        <Field label="Nama kompetisi"><Input required value={value.competition} onChange={(event) => set("competition", event.target.value)} /></Field>
        <Field label="Problem"><Textarea required rows="5" value={value.problem} onChange={(event) => set("problem", event.target.value)} /></Field>
        <Field label="Solution"><Textarea required rows="5" value={value.solution} onChange={(event) => set("solution", event.target.value)} /></Field>
      </Section>
      <Section title="Media dan tautan">
        <Field label="Cover image URL"><Input required value={value.coverImageUrl} onChange={(event) => set("coverImageUrl", event.target.value)} /></Field>
        <Field label="Landscape image URL"><Input value={value.landscapeImageUrl} onChange={(event) => set("landscapeImageUrl", event.target.value)} /></Field>
        <Field label="External URL"><Input value={value.externalUrl} onChange={(event) => set("externalUrl", event.target.value)} /></Field>
      </Section>
      <Section title="Timeline">
        <Repeater title="Tahap" addLabel="Tambah tahap" items={value.timeline} onChange={(next) => set("timeline", next)} createItem={() => ({ phase: "", duration: "", title: "", detail: "" })} renderItem={(item, update) => <div className="admin-form-grid admin-form-grid-2"><Field label="Phase"><Input required value={item.phase} onChange={(event) => update({ ...item, phase: event.target.value })} /></Field><Field label="Durasi"><Input required value={item.duration} onChange={(event) => update({ ...item, duration: event.target.value })} /></Field><Field label="Judul" className="admin-grid-full"><Input required value={item.title} onChange={(event) => update({ ...item, title: event.target.value })} /></Field><Field label="Detail" className="admin-grid-full"><Textarea required rows="3" value={item.detail} onChange={(event) => update({ ...item, detail: event.target.value })} /></Field></div>} />
      </Section>
      <Section title="Mockups">
        <Repeater title="Mockup" addLabel="Tambah mockup" items={value.mockups} onChange={(next) => set("mockups", next)} createItem={() => ({ title: "", imageUrl: "", altText: "" })} renderItem={(item, update) => <div className="admin-form-grid admin-form-grid-2"><Field label="Judul"><Input required value={item.title} onChange={(event) => update({ ...item, title: event.target.value })} /></Field><Field label="Alt text"><Input required value={item.altText} onChange={(event) => update({ ...item, altText: event.target.value })} /></Field><Field label="Image URL" className="admin-grid-full"><Input required value={item.imageUrl} onChange={(event) => update({ ...item, imageUrl: event.target.value })} /></Field></div>} />
      </Section>
      <Section title="Kontributor">
        <Repeater title="Kontributor" addLabel="Tambah anggota" items={value.contributors} onChange={(next) => set("contributors", next)} createItem={() => ({ teamMemberId: "", role: "" })} renderItem={(item, update) => <div className="admin-form-grid admin-form-grid-2"><Field label="Anggota"><Select required value={item.teamMemberId} onChange={(event) => update({ ...item, teamMemberId: event.target.value })}><option value="">Pilih anggota</option>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</Select></Field><Field label="Peran proyek"><Input required value={item.role} onChange={(event) => update({ ...item, role: event.target.value })} /></Field></div>} />
      </Section>
    </>
  );
}

export function ProjectsPage({ canDelete }) {
  return <AdminResourcePage resource="projects" title="Projects" singular="Project" description="Kelola arsip kompetisi, narasi studi kasus, media, dan kontributor." canDelete={canDelete} emptyValue={emptyProject} toForm={projectToForm} toPayload={projectToPayload} Form={ProjectForm} getSearchText={(item) => `${item.name} ${item.competition} ${item.organizer} ${item.status}`} columns={[
    { key: "project", label: "Project", render: (item) => <div className="admin-primary-cell">{item.coverImageUrl && <img src={item.coverImageUrl} alt="" />}<div><strong>{item.name}</strong><span>{item.slug}</span></div></div> },
    { key: "competition", label: "Competition", render: (item) => <div className="admin-stacked-cell"><strong>{item.competition}</strong><span>{item.organizer}</span></div> },
    { key: "year", label: "Tahun", render: (item) => item.year },
    { key: "status", label: "Status", render: (item) => <StatusBadge value={item.status} /> },
  ]} />;
}

const emptyAchievement = () => ({
  id: "", occurredAt: new Date().toISOString().slice(0, 10), dateLabel: "", competitionName: "", organizer: "", scale: "National", placement: "", projectName: "", note: "", story: "", status: "draft", sortOrder: 0, contributors: [],
});

const emptyDocumentation = () => ({
  category: "", prototypeUrl: "", proposalUrl: "", summary: "", background: "", solution: "", positioning: "",
  objectives: "", users: "", innovations: "", features: "", limitations: "", userFlow: "",
});

const achievementToForm = (item) => ({
  ...emptyAchievement(), ...item, occurredAt: new Date(item.occurredAt).toISOString().slice(0, 10),
  contributors: (item.contributors || []).map((person) => ({ teamMemberId: person.id, role: person.contributionRole || person.role })),
});

const documentationToForm = (doc) => doc ? ({
  ...emptyDocumentation(), ...doc,
  objectives: textFromList(doc.sections?.objectives), users: textFromList(doc.sections?.users),
  innovations: textFromList(doc.sections?.innovations), features: textFromList(doc.sections?.features),
  limitations: textFromList(doc.sections?.limitations), userFlow: textFromList(doc.sections?.userFlow),
}) : emptyDocumentation();

const achievementToPayload = (form) => ({
  id: form.id, occurredAt: new Date(form.occurredAt).toISOString(), dateLabel: form.dateLabel, competitionName: form.competitionName,
  organizer: form.organizer, scale: form.scale, placement: form.placement, projectName: form.projectName, note: form.note, story: form.story,
  status: form.status, sortOrder: Number(form.sortOrder), contributors: form.contributors.filter((item) => item.teamMemberId).map(({ teamMemberId, role }) => ({ teamMemberId, role })),
});

const documentationPayload = (doc) => ({
  category: doc.category, prototypeUrl: nullable(doc.prototypeUrl), proposalUrl: nullable(doc.proposalUrl), summary: doc.summary,
  background: doc.background, solution: doc.solution, positioning: doc.positioning,
  sections: { objectives: listFromText(doc.objectives), users: listFromText(doc.users), innovations: listFromText(doc.innovations), features: listFromText(doc.features), limitations: listFromText(doc.limitations), userFlow: listFromText(doc.userFlow) },
});

function AchievementForm({ value, onChange, mode }) {
  const { data: members = [] } = useAdminList("teamMembers");
  const set = (key, next) => onChange({ ...value, [key]: next });
  return <>
    <Section title="Hasil kompetisi" description="Data ringkas yang tampil pada daftar achievement publik.">
      <div className="admin-form-grid admin-form-grid-2">
        <Field label="ID / slug"><Input required disabled={mode === "edit"} value={value.id} onChange={(event) => set("id", slugify(event.target.value))} /></Field>
        <Field label="Tanggal"><Input required type="date" value={value.occurredAt} onChange={(event) => set("occurredAt", event.target.value)} /></Field>
        <Field label="Label tanggal"><Input required placeholder="May 2025" value={value.dateLabel} onChange={(event) => set("dateLabel", event.target.value)} /></Field>
        <Field label="Urutan"><Input required type="number" value={value.sortOrder} onChange={(event) => set("sortOrder", event.target.value)} /></Field>
        <Field label="Status"><Select value={value.status} onChange={(event) => set("status", event.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></Select></Field>
        <Field label="Skala"><Select value={value.scale} onChange={(event) => set("scale", event.target.value)}><option value="International">International</option><option value="National">National</option><option value="Regional">Regional</option><option value="University">University</option></Select></Field>
      </div>
      <Field label="Nama kompetisi"><Input required value={value.competitionName} onChange={(event) => set("competitionName", event.target.value)} /></Field>
      <div className="admin-form-grid admin-form-grid-2"><Field label="Organizer"><Input required value={value.organizer} onChange={(event) => set("organizer", event.target.value)} /></Field><Field label="Placement"><Input required value={value.placement} onChange={(event) => set("placement", event.target.value)} /></Field></div>
      <Field label="Nama proyek"><Input required value={value.projectName} onChange={(event) => set("projectName", event.target.value)} /></Field>
      <Field label="Catatan singkat"><Textarea required rows="3" value={value.note} onChange={(event) => set("note", event.target.value)} /></Field>
      <Field label="Cerita pencapaian"><Textarea required rows="5" value={value.story} onChange={(event) => set("story", event.target.value)} /></Field>
    </Section>
    <Section title="Kontributor" description="Anggota dan peran yang terlibat pada kompetisi.">
      <Repeater title="Kontributor" addLabel="Tambah anggota" items={value.contributors} onChange={(next) => set("contributors", next)} createItem={() => ({ teamMemberId: "", role: "" })} renderItem={(item, update) => <div className="admin-form-grid admin-form-grid-2"><Field label="Anggota"><Select value={item.teamMemberId} onChange={(event) => update({ ...item, teamMemberId: event.target.value })}><option value="">Pilih anggota</option>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</Select></Field><Field label="Peran"><Input required value={item.role} onChange={(event) => update({ ...item, role: event.target.value })} /></Field></div>} />
    </Section>
  </>;
}

function DocumentationForm({ value, onChange, onUpload, onUploadError, uploading, uploadError }) {
  const [section, setSection] = useState("overview");
  const set = (key, next) => onChange({ ...value, [key]: next });
  const tabs = [["overview", "Umum"], ["brief", "Brief"], ["structure", "Struktur"]];

  return <>
    <div className="admin-form-tabs" role="tablist" aria-label="Bagian dokumentasi">
      {tabs.map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={section === key} className={section === key ? "is-active" : ""} onClick={() => setSection(key)}>{label}</button>)}
    </div>
    {section === "overview" && <Section title="Dokumen utama" description="Proposal PDF dan tautan prototype yang ditampilkan pada halaman dokumentasi.">
      <div className="admin-form-grid admin-form-grid-2">
        <Field label="Kategori"><Input required value={value.category} onChange={(event) => set("category", event.target.value)} /></Field>
        <Field label="Prototype URL"><Input type="url" value={value.prototypeUrl} onChange={(event) => set("prototypeUrl", event.target.value)} /></Field>
      </div>
      <Field label="Proposal PDF" hint="File disimpan pada Supabase Storage.">
        <FileDropzone value={value.proposalUrl} onUpload={onUpload} onError={onUploadError} uploading={uploading} error={uploadError} />
      </Field>
    </Section>}
    {section === "brief" && <Section title="Competition brief" description="Narasi lengkap yang menjelaskan konteks dan arah solusi.">
      <Field label="Summary"><Textarea required rows="3" value={value.summary} onChange={(event) => set("summary", event.target.value)} /></Field>
      <Field label="Background"><Textarea required rows="5" value={value.background} onChange={(event) => set("background", event.target.value)} /></Field>
      <Field label="Solution"><Textarea required rows="5" value={value.solution} onChange={(event) => set("solution", event.target.value)} /></Field>
      <Field label="Positioning"><Textarea required rows="3" value={value.positioning} onChange={(event) => set("positioning", event.target.value)} /></Field>
    </Section>}
    {section === "structure" && <Section title="Struktur brief" description="Gunakan satu baris untuk setiap poin agar mudah dipindai di website.">
      {["objectives", "users", "innovations", "features", "limitations", "userFlow"].map((key) => <Field key={key} label={key === "userFlow" ? "User flow" : key[0].toUpperCase() + key.slice(1)} hint="Satu item per baris."><Textarea required rows="4" value={value[key]} onChange={(event) => set(key, event.target.value)} /></Field>)}
    </Section>}
  </>;
}

export function AchievementsPage({ canDelete }) {
  const saveDocumentation = useSaveAchievementDocumentation();
  const uploadProposal = useUploadProposal();
  const [documentationItem, setDocumentationItem] = useState(null);
  const [documentation, setDocumentation] = useState(emptyDocumentation);
  const [uploadError, setUploadError] = useState("");
  const [toast, setToast] = useState(null);

  const openDocumentation = (item) => {
    setDocumentationItem(item);
    setDocumentation(documentationToForm(item.documentation));
    setUploadError("");
  };
  const closeDocumentation = () => {
    if (!saveDocumentation.isPending && !uploadProposal.isPending) setDocumentationItem(null);
  };
  const upload = async (file) => {
    setUploadError("");
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("Ukuran PDF maksimal 4 MB.");
      return;
    }
    try {
      const result = await uploadProposal.mutateAsync(file);
      setDocumentation((current) => ({ ...current, proposalUrl: result.url }));
    } catch (error) {
      setUploadError(error.message || "Proposal gagal diunggah.");
    }
  };
  const save = async (event) => {
    event.preventDefault();
    try {
      await saveDocumentation.mutateAsync({ id: documentationItem.id, input: documentationPayload(documentation) });
      setDocumentationItem(null);
      setToast({ id: Date.now(), message: "Dokumentasi achievement berhasil disimpan.", type: "success" });
    } catch (error) {
      setToast({ id: Date.now(), message: error.message || "Dokumentasi gagal disimpan.", type: "error" });
    }
  };

  return <>
    <AdminResourcePage
      resource="achievements" title="Achievements" singular="Achievement"
      description="Kelola hasil kompetisi dan dokumentasinya secara terpisah."
      canDelete={canDelete} emptyValue={emptyAchievement} toForm={achievementToForm}
      toPayload={achievementToPayload} Form={AchievementForm}
      renderActions={(item) => <IconButton icon={FileText} label="Kelola dokumentasi" onClick={() => openDocumentation(item)} />}
      getSearchText={(item) => `${item.competitionName} ${item.projectName} ${item.placement} ${item.status}`}
      columns={[
        { key: "competition", label: "Competition", render: (item) => <div className="admin-stacked-cell"><strong>{item.competitionName}</strong><span>{item.organizer}</span></div> },
        { key: "project", label: "Project", render: (item) => item.projectName },
        { key: "placement", label: "Result", render: (item) => <div className="admin-stacked-cell"><strong>{item.placement}</strong><span>{item.dateLabel}</span></div> },
        { key: "status", label: "Status", render: (item) => <StatusBadge value={item.status} /> },
      ]}
    />
    <Drawer open={Boolean(documentationItem)} eyebrow="Competition brief" title={documentationItem ? `Dokumentasi · ${documentationItem.projectName}` : "Dokumentasi"} width="wide" onClose={closeDocumentation} footer={<><Button type="button" variant="secondary" onClick={closeDocumentation}>Batal</Button><Button type="submit" form="achievement-documentation-form" disabled={saveDocumentation.isPending || uploadProposal.isPending}>{saveDocumentation.isPending ? "Menyimpan..." : "Simpan"}</Button></>}>
      <form id="achievement-documentation-form" className="admin-form" onSubmit={save}>
        <DocumentationForm value={documentation} onChange={setDocumentation} onUpload={upload} onUploadError={setUploadError} uploading={uploadProposal.isPending} uploadError={uploadError} />
      </form>
    </Drawer>
    {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
  </>;
}

const emptyMember = () => ({ slug: "", name: "", shortName: "", role: "", bio: "", linkedinUrl: "", instagramUrl: "", sortOrder: 0, isActive: true, images: [] });
const memberToForm = (item) => ({ ...emptyMember(), ...item, images: item.images || [] });
const memberToPayload = (form) => ({ slug: form.slug, name: form.name, shortName: form.shortName, role: form.role, bio: nullable(form.bio), linkedinUrl: nullable(form.linkedinUrl), instagramUrl: nullable(form.instagramUrl), sortOrder: Number(form.sortOrder), isActive: Boolean(form.isActive), images: form.images.map(({ url, altText }) => ({ url, altText })) });
function TeamForm({ value, onChange }) {
  const set = (key, next) => onChange({ ...value, [key]: next });
  const setName = (name) => onChange({ ...value, name, shortName: value.shortName || name.split(" ")[0], slug: value.slug || slugify(name) });
  return <><Section title="Profil anggota"><div className="admin-form-grid admin-form-grid-2"><Field label="Nama lengkap"><Input required value={value.name} onChange={(event) => setName(event.target.value)} /></Field><Field label="Nama pendek"><Input required value={value.shortName} onChange={(event) => set("shortName", event.target.value)} /></Field><Field label="Slug"><Input required value={value.slug} onChange={(event) => set("slug", slugify(event.target.value))} /></Field><Field label="Role"><Input required value={value.role} onChange={(event) => set("role", event.target.value)} /></Field><Field label="Urutan"><Input required type="number" value={value.sortOrder} onChange={(event) => set("sortOrder", event.target.value)} /></Field><div className="admin-field admin-field-toggle"><span className="admin-field-label">Status</span><Toggle checked={value.isActive} onChange={(next) => set("isActive", next)} label="Anggota aktif" /></div></div><Field label="Bio"><Textarea rows="4" value={value.bio || ""} onChange={(event) => set("bio", event.target.value)} /></Field></Section><Section title="Social links"><Field label="LinkedIn URL"><Input value={value.linkedinUrl || ""} onChange={(event) => set("linkedinUrl", event.target.value)} /></Field><Field label="Instagram URL"><Input value={value.instagramUrl || ""} onChange={(event) => set("instagramUrl", event.target.value)} /></Field></Section><Section title="Foto anggota"><Repeater title="Foto" addLabel="Tambah foto" items={value.images} onChange={(next) => set("images", next)} createItem={() => ({ url: "", altText: "" })} renderItem={(item, update) => <div className="admin-form-grid admin-form-grid-2"><Field label="Image URL"><Input required value={item.url} onChange={(event) => update({ ...item, url: event.target.value })} /></Field><Field label="Alt text"><Input required value={item.altText} onChange={(event) => update({ ...item, altText: event.target.value })} /></Field></div>} /></Section></>;
}
export function TeamPage({ canDelete }) {
  return <AdminResourcePage resource="teamMembers" title="Team" singular="Anggota" description="Kelola profil, peran, foto, dan tautan sosial anggota tim." canDelete={canDelete} emptyValue={emptyMember} toForm={memberToForm} toPayload={memberToPayload} Form={TeamForm} getSearchText={(item) => `${item.name} ${item.role} ${item.slug}`} columns={[
    { key: "member", label: "Anggota", render: (item) => <div className="admin-primary-cell">{item.images?.[0]?.url && <img src={item.images[0].url} alt="" />}<div><strong>{item.name}</strong><span>{item.shortName}</span></div></div> },
    { key: "role", label: "Role", render: (item) => item.role }, { key: "order", label: "Urutan", render: (item) => item.sortOrder },
    { key: "status", label: "Status", render: (item) => <StatusBadge value={item.isActive ? "active" : "inactive"} /> },
  ]} />;
}

const emptyProcess = () => ({ label: "", title: "", description: "", sortOrder: 0, isActive: true });
const processPayload = (form) => ({ ...form, sortOrder: Number(form.sortOrder), isActive: Boolean(form.isActive) });
function ProcessForm({ value, onChange }) { const set = (key, next) => onChange({ ...value, [key]: next }); return <Section title="Tahap proses"><div className="admin-form-grid admin-form-grid-2"><Field label="Label"><Input required value={value.label} onChange={(event) => set("label", event.target.value)} placeholder="01" /></Field><Field label="Urutan"><Input required type="number" value={value.sortOrder} onChange={(event) => set("sortOrder", event.target.value)} /></Field></div><Field label="Judul"><Input required value={value.title} onChange={(event) => set("title", event.target.value)} /></Field><Field label="Deskripsi"><Textarea required rows="6" value={value.description} onChange={(event) => set("description", event.target.value)} /></Field><Toggle checked={value.isActive} onChange={(next) => set("isActive", next)} label="Tampilkan pada website" /></Section>; }
export function ProcessPage({ canDelete }) { return <AdminResourcePage resource="process" title="Process" singular="Tahap" description="Atur urutan dan narasi proses kerja yang tampil pada beranda." canDelete={canDelete} emptyValue={emptyProcess} toPayload={processPayload} Form={ProcessForm} getSearchText={(item) => `${item.label} ${item.title}`} columns={[{ key: "label", label: "Label", render: (item) => <strong className="admin-mono-value">{item.label}</strong> }, { key: "title", label: "Tahap", render: (item) => <div className="admin-stacked-cell"><strong>{item.title}</strong><span>{item.description.slice(0, 76)}...</span></div> }, { key: "order", label: "Urutan", render: (item) => item.sortOrder }, { key: "status", label: "Status", render: (item) => <StatusBadge value={item.isActive ? "active" : "inactive"} /> }]} />; }

const emptyMedia = () => ({ kind: "image", url: "", altText: "", title: "", mimeType: "", width: "", height: "", galleryVisible: false, sortOrder: 0, metadataText: "{}" });
const mediaToForm = (item) => ({ ...emptyMedia(), ...item, metadataText: JSON.stringify(item.metadata || {}, null, 2) });
const mediaPayload = (form) => { let metadata; try { metadata = JSON.parse(form.metadataText || "{}"); } catch { throw new Error("Metadata harus berupa JSON yang valid."); } return { kind: form.kind, url: form.url, altText: nullable(form.altText), title: nullable(form.title), mimeType: nullable(form.mimeType), width: form.width ? Number(form.width) : null, height: form.height ? Number(form.height) : null, galleryVisible: Boolean(form.galleryVisible), sortOrder: Number(form.sortOrder), metadata }; };
function MediaForm({ value, onChange }) { const set = (key, next) => onChange({ ...value, [key]: next }); return <><Section title="Asset"><div className="admin-form-grid admin-form-grid-2"><Field label="Jenis"><Select value={value.kind} onChange={(event) => set("kind", event.target.value)}><option value="image">Image</option><option value="document">Document</option><option value="video">Video</option></Select></Field><Field label="Urutan"><Input required type="number" value={value.sortOrder} onChange={(event) => set("sortOrder", event.target.value)} /></Field></div><Field label="URL"><Input required value={value.url} onChange={(event) => set("url", event.target.value)} /></Field><div className="admin-form-grid admin-form-grid-2"><Field label="Judul"><Input value={value.title || ""} onChange={(event) => set("title", event.target.value)} /></Field><Field label="MIME type"><Input value={value.mimeType || ""} onChange={(event) => set("mimeType", event.target.value)} /></Field></div><Field label="Alt text"><Input value={value.altText || ""} onChange={(event) => set("altText", event.target.value)} /></Field><div className="admin-form-grid admin-form-grid-2"><Field label="Width"><Input type="number" min="1" value={value.width || ""} onChange={(event) => set("width", event.target.value)} /></Field><Field label="Height"><Input type="number" min="1" value={value.height || ""} onChange={(event) => set("height", event.target.value)} /></Field></div><Toggle checked={value.galleryVisible} onChange={(next) => set("galleryVisible", next)} label="Tampilkan di gallery" /></Section><Section title="Metadata"><Field label="JSON metadata"><Textarea className="admin-code-input" rows="8" value={value.metadataText} onChange={(event) => set("metadataText", event.target.value)} spellCheck="false" /></Field></Section></>; }
export function MediaPage({ canDelete }) { return <AdminResourcePage resource="media" title="Media" singular="Media" description="Kelola URL asset, metadata, dan visibilitas gallery." canDelete={canDelete} emptyValue={emptyMedia} toForm={mediaToForm} toPayload={mediaPayload} Form={MediaForm} getSearchText={(item) => `${item.title} ${item.url} ${item.kind}`} columns={[{ key: "asset", label: "Asset", render: (item) => <div className="admin-primary-cell">{item.kind === "image" && <img src={item.url} alt="" />}<div><strong>{item.title || item.altText || "Untitled asset"}</strong><span>{item.url}</span></div></div> }, { key: "kind", label: "Jenis", render: (item) => <StatusBadge value={item.kind} /> }, { key: "gallery", label: "Gallery", render: (item) => item.galleryVisible ? "Visible" : "Hidden" }, { key: "order", label: "Urutan", render: (item) => item.sortOrder }]} />; }

const overviewResources = [
  { key: "projects", label: "Projects", icon: FolderKanban, href: "#admin/projects" },
  { key: "achievements", label: "Achievements", icon: Award, href: "#admin/achievements" },
  { key: "teamMembers", label: "Team members", icon: Users, href: "#admin/team" },
  { key: "media", label: "Media assets", icon: FileImage, href: "#admin/media" },
];

export function OverviewPage({ user }) {
  const projects = useAdminList("projects"); const achievements = useAdminList("achievements"); const teamMembers = useAdminList("teamMembers"); const media = useAdminList("media");
  const data = { projects: projects.data || [], achievements: achievements.data || [], teamMembers: teamMembers.data || [], media: media.data || [] };
  const latest = [...data.projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);
  return <div className="admin-page"><header className="admin-page-head admin-overview-head"><div><span className="admin-eyebrow">Dashboard overview</span><h1>Selamat datang, {user.name?.split(" ")[0]}.</h1><p>Pantau konten publik dan lanjutkan pekerjaan yang masih berupa draft.</p></div></header><div className="admin-stat-grid">{overviewResources.map(({ key, label, icon: Icon, href }) => <a href={href} className="admin-stat" key={key}><div><span>{label}</span><strong>{data[key].length}</strong></div><Icon size={22} strokeWidth={1.6} /><small>Buka pengelolaan</small></a>)}</div><div className="admin-overview-grid"><section className="admin-overview-panel"><header><div><span className="admin-eyebrow">Recent activity</span><h2>Project terbaru</h2></div><a href="#admin/projects">Lihat semua</a></header><div className="admin-activity-list">{latest.map((item) => <a href="#admin/projects" key={item.id}><div><strong>{item.name}</strong><span>Diperbarui {new Date(item.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span></div><StatusBadge value={item.status} /></a>)}</div></section><section className="admin-overview-panel admin-publish-panel"><span className="admin-eyebrow">Publishing health</span><h2>Status konten</h2>{[["Published", data.projects.filter((item) => item.status === "published").length], ["Draft", data.projects.filter((item) => item.status === "draft").length], ["Archived", data.projects.filter((item) => item.status === "archived").length]].map(([label, count]) => <div className="admin-health-row" key={label}><span>{label}</span><strong>{count}</strong></div>)}</section></div></div>;
}

const settingDefinitions = {
  identity: { label: "Identity", fields: [["name", "Nama brand"], ["description", "Deskripsi", "textarea"]] },
  about: { label: "About", fields: [["vision", "Vision", "textarea"], ["mission", "Mission", "textarea"]] },
  mentor: { label: "Mentor", fields: [["name", "Nama"], ["role", "Role"], ["imageUrl", "Image URL"], ["imageAlt", "Image alt"], ["description", "Deskripsi", "textarea"]] },
  footer: { label: "Footer", fields: [["email", "Email"], ["instagramUrl", "Instagram URL"], ["organization", "Organisasi"]] },
};

export function SettingsPage() {
  const query = useAdminList("settings"); const update = useUpdateSiteSetting(); const [section, setSection] = useState("identity"); const [form, setForm] = useState({}); const [notice, setNotice] = useState("");
  useEffect(() => { if (query.data) setForm(query.data); }, [query.data]);
  const definition = settingDefinitions[section]; const value = form[section] || {};
  const set = (key, next) => setForm({ ...form, [section]: { ...value, [key]: next } });
  const save = async (event) => { event.preventDefault(); setNotice(""); try { await update.mutateAsync({ key: section, value }); setNotice(`${definition.label} berhasil diperbarui.`); } catch (error) { setNotice(error.message || "Gagal menyimpan settings."); } };
  return <div className="admin-page"><header className="admin-page-head"><div><span className="admin-eyebrow">Site configuration</span><h1>Settings</h1><p>Kelola konten global yang digunakan lintas halaman website.</p></div></header><div className="admin-settings-layout"><nav className="admin-settings-nav" aria-label="Bagian settings">{Object.entries(settingDefinitions).map(([key, item]) => <button key={key} className={section === key ? "is-active" : ""} onClick={() => setSection(key)}>{item.label}</button>)}</nav><form className="admin-settings-form" onSubmit={save}><header><div><span className="admin-eyebrow">Website settings</span><h2>{definition.label}</h2></div><Button type="submit" icon={Save} disabled={update.isPending}>{update.isPending ? "Menyimpan..." : "Simpan"}</Button></header>{notice && <Toast message={notice} type={notice.startsWith("Gagal") ? "error" : "success"} onDismiss={() => setNotice("")} />}<div className="admin-settings-fields">{definition.fields.map(([key, label, type]) => <Field key={key} label={label}>{type === "textarea" ? <Textarea rows="6" value={value[key] || ""} onChange={(event) => set(key, event.target.value)} /> : <Input value={value[key] || ""} onChange={(event) => set(key, event.target.value)} />}</Field>)}</div>{section === "about" && <div className="admin-settings-fields admin-settings-stats"><Repeater title="Statistik" addLabel="Tambah statistik" items={value.stats || []} onChange={(next) => set("stats", next)} createItem={() => ({ value: "", label: "" })} renderItem={(item, update) => <div className="admin-form-grid admin-form-grid-2"><Field label="Nilai"><Input required value={item.value} onChange={(event) => update({ ...item, value: event.target.value })} /></Field><Field label="Label"><Input required value={item.label} onChange={(event) => update({ ...item, label: event.target.value })} /></Field></div>} /></div>}</form></div></div>;
}

