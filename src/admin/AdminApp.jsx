import { useEffect, useState } from "react";
import { ArrowUpRight, Eye, EyeOff, LayoutDashboard, LogOut, Menu, PanelLeftClose, ShieldCheck, UserRoundPlus, X } from "lucide-react";
import { signIn, signOut, useSession } from "../services/authClient";
import { useAdminSetupStatus, useCreateFirstAdmin } from "../hooks/useApiQueries";
import { Button, IconButton } from "./AdminUI";
import { AchievementsPage, MediaPage, OverviewPage, ProcessPage, ProjectsPage, SettingsPage, TeamPage } from "./AdminPages";
import { adminPageMeta } from "./adminConfig";
import "./admin.css";

const navOrder = ["overview", "projects", "achievements", "team", "process", "media", "settings"];

const getRoute = () => {
  const route = window.location.hash.replace(/^#admin\/?/, "");
  return route === "login" ? "login" : adminPageMeta[route] ? route : "overview";
};

function AdminLogin() {
  const setupStatus = useAdminSetupStatus();
  const createAdmin = useCreateFirstAdmin();
  const requiresSetup = setupStatus.data?.requiresSetup === true;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setPending(true); setError("");
    try {
      if (requiresSetup) {
        if (password !== passwordConfirmation) throw new Error("Konfirmasi password belum sama.");
        await createAdmin.mutateAsync({ name, email, password });
      }
      const result = await signIn.email({ email, password, rememberMe: true });
      if (result.error) throw new Error(result.error.message || "Email atau password tidak sesuai.");
      window.location.hash = "#admin";
    } catch (signInError) {
      setError(signInError.message || "Tidak dapat masuk. Periksa koneksi API dan kredensial Anda.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-brand">
        <a href="#home" aria-label="Kembali ke website"><img src="/hihang-hoeng-logo.png" alt="Hihang Hoeng" /></a>
        <div><span className="admin-eyebrow">Content workspace</span><h1>Kelola cerita di balik setiap kompetisi.</h1><p>Satu ruang untuk memperbarui project, pencapaian, dokumentasi, dan orang-orang yang membentuk perjalanan Hihang Hoeng.</p></div>
        <span className="admin-login-mark">HH / CMS</span>
      </div>
      <div className="admin-login-form-wrap">
        <form className="admin-login-form" onSubmit={submit}>
          <header>
            <div className="admin-login-icon">{requiresSetup ? <UserRoundPlus size={22} strokeWidth={1.7} /> : <ShieldCheck size={22} strokeWidth={1.7} />}</div>
            <span className="admin-eyebrow">{requiresSetup ? "First-time setup" : "Restricted access"}</span>
            <h2>{requiresSetup ? "Buat admin pertama" : "Masuk ke dashboard"}</h2>
            <p>{requiresSetup ? "Tentukan akun utama untuk mengelola seluruh konten website." : "Gunakan akun editor atau administrator yang telah terdaftar."}</p>
          </header>
          {requiresSetup && <label className="admin-field"><span className="admin-field-label">Nama administrator</span><input className="admin-input" type="text" autoComplete="name" required minLength="2" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama lengkap" /></label>}
          <label className="admin-field"><span className="admin-field-label">Email</span><input className="admin-input" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" /></label>
          <label className="admin-field"><span className="admin-field-label">Password</span><span className="admin-password-field"><input className="admin-input" type={showPassword ? "text" : "password"} autoComplete={requiresSetup ? "new-password" : "current-password"} required minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={requiresSetup ? "Minimal 8 karakter" : "Masukkan password"} /><IconButton type="button" icon={showPassword ? EyeOff : Eye} label={showPassword ? "Sembunyikan password" : "Tampilkan password"} onClick={() => setShowPassword((value) => !value)} /></span></label>
          {requiresSetup && <label className="admin-field"><span className="admin-field-label">Konfirmasi password</span><input className="admin-input" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength="8" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} placeholder="Ulangi password" /></label>}
          {setupStatus.isError && <div className="admin-login-error admin-login-service-error" role="alert"><span>API atau database belum dapat dihubungi. Jalankan layanan backend terlebih dahulu.</span><Button type="button" variant="secondary" onClick={() => setupStatus.refetch()}>Coba lagi</Button></div>}
          {error && <div className="admin-login-error" role="alert">{error}</div>}
          <Button type="submit" disabled={pending || setupStatus.isPending || setupStatus.isError}>{pending ? (requiresSetup ? "Membuat akun..." : "Memverifikasi...") : setupStatus.isPending ? "Memeriksa sistem..." : requiresSetup ? "Buat akun dan masuk" : "Masuk ke dashboard"}</Button>
          <a className="admin-back-link" href="#home">Kembali ke website <ArrowUpRight size={15} /></a>
        </form>
      </div>
    </main>
  );
}
function AdminShell({ route, onRouteChange, session }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const user = session.user;
  const isAdmin = user.role === "admin";

  const navigate = (key) => { window.location.hash = key === "overview" ? "#admin" : `#admin/${key}`; setMobileOpen(false); onRouteChange(key); };
  const logout = async () => { await signOut(); window.location.hash = "#admin/login"; };

  let page;
  if (route === "projects") page = <ProjectsPage canDelete={isAdmin} />;
  else if (route === "achievements") page = <AchievementsPage canDelete={isAdmin} />;
  else if (route === "team") page = <TeamPage canDelete={isAdmin} />;
  else if (route === "process") page = <ProcessPage canDelete={isAdmin} />;
  else if (route === "media") page = <MediaPage canDelete={isAdmin} />;
  else if (route === "settings") page = isAdmin ? <SettingsPage /> : <OverviewPage user={user} />;
  else page = <OverviewPage user={user} />;

  return (
    <div className={`admin-app ${compact ? "is-compact" : ""}`}>
      <button className={`admin-mobile-scrim ${mobileOpen ? "is-visible" : ""}`} aria-label="Tutup navigasi" onClick={() => setMobileOpen(false)} />
      <aside className={`admin-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <header className="admin-sidebar-brand"><a href="#home"><img src="/hihang-hoeng-logo.png" alt="Hihang Hoeng" /><span>Content<br />Workspace</span></a><IconButton icon={X} label="Tutup menu" className="admin-mobile-close" onClick={() => setMobileOpen(false)} /></header>
        <nav className="admin-nav" aria-label="Dashboard navigation">
          <span className="admin-nav-label">Workspace</span>
          {navOrder.filter((key) => isAdmin || key !== "settings").map((key) => {
            const item = adminPageMeta[key]; const Icon = key === "overview" ? LayoutDashboard : item.icon;
            return <button key={key} className={route === key ? "is-active" : ""} onClick={() => navigate(key)} title={compact ? item.title : undefined}><Icon size={18} strokeWidth={1.7} /><span>{item.title}</span></button>;
          })}
        </nav>
        <footer className="admin-sidebar-footer">
          <a href="#home" title={compact ? "Lihat website" : undefined}><ArrowUpRight size={17} /><span>Lihat website</span></a>
          <button onClick={logout} title={compact ? "Keluar" : undefined}><LogOut size={17} /><span>Keluar</span></button>
        </footer>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-topbar-start"><IconButton icon={Menu} label="Buka menu" className="admin-mobile-menu" onClick={() => setMobileOpen(true)} /><IconButton icon={PanelLeftClose} label={compact ? "Perluas sidebar" : "Ringkas sidebar"} className="admin-desktop-collapse" onClick={() => setCompact((value) => !value)} /><div><span>Dashboard</span><strong>{adminPageMeta[route]?.title || "Overview"}</strong></div></div>
          <div className="admin-user"><span className="admin-user-avatar">{user.name?.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "HH"}</span><div><strong>{user.name}</strong><span>{user.role || "editor"}</span></div></div>
        </header>
        <main className="admin-main">{page}</main>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [route, setRoute] = useState(getRoute);
  const session = useSession();

  useEffect(() => {
    const syncRoute = () => setRoute(getRoute());
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    if (session.data && route === "login") window.location.hash = "#admin";
  }, [route, session.data]);

  if (session.isPending) return <div className="admin-session-loading"><img src="/hihang-hoeng-logo.png" alt="" /><span>Memuat workspace</span></div>;
  if (!session.data) return <AdminLogin />;
  return <AdminShell route={route} onRouteChange={setRoute} session={session.data} />;
}
