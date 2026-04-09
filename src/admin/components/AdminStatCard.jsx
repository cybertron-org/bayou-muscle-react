export default function AdminStatCard({ label, value, note }) {
  return (
    <article className="admin-stat-card">
      <div className="admin-stat-label">{label}</div>
      <div className="admin-stat-value">{value}</div>
      <div className="admin-stat-note">{note}</div>
    </article>
  );
}