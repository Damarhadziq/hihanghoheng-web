import { lazy, Suspense, useEffect, useState } from "react";
import App from "./App";
const AdminApp = lazy(() => import("./admin/AdminApp"));

const isAdminLocation = () => (
  window.location.pathname === "/admin"
  || window.location.pathname.startsWith("/admin/")
  || window.location.hash === "#admin"
  || window.location.hash.startsWith("#admin/")
);

export default function Root() {
  const [admin, setAdmin] = useState(isAdminLocation);
  useEffect(() => {
    const handleLocationChange = () => setAdmin(isAdminLocation());
    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);
  return admin ? <Suspense fallback={<div className="admin-session-loading" />}><AdminApp /></Suspense> : <App />;
}
