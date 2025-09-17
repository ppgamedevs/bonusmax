export function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm">
      {children}
    </div>
  );
}

export function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-blue-300 bg-blue-50 p-3 text-sm">
      {children}
    </div>
  );
}
