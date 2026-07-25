export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0' }}>
      <div className="max-w-container mx-auto px-6 flex items-center justify-between flex-wrap gap-4">
        <div className="font-display text-sm font-bold" style={{ color: 'var(--text)' }}>
          Victor <span style={{ color: 'var(--accent)' }}>Augusto</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-3)' }}>
          © {year} Victor Augusto Dias Mendes do Valle · Belo Horizonte, MG
        </p>
      </div>
    </footer>
  );
}
