export function Header({ children }: { children?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-lg">
      <div>
        <h1 className="text-heading-h1">เลขใกล้เคียง</h1>
        <p className="text-caption text-muted">ใช้ + − × ÷ ให้ได้ใกล้เป้าที่สุด</p>
      </div>
      {children}
    </header>
  );
}
