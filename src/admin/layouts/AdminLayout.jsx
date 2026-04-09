import '../styles/admin.css';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';

export default function AdminLayout({ title, subtitle, children }) {
  return (
    <div className="admin-app">
      <div className="admin-shell">
        <AdminSidebar />

        <main className="admin-main">
          <AdminTopbar title={title} subtitle={subtitle} />
          <div className="admin-content">{children}</div>
        </main>
      </div>
    </div>
  );
}