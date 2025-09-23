export function formatUpdatedRO(d: Date) {
  const dt = new Date(d);
  const now = new Date();
  const fmt = (x: Date) => x.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
  const sameDay = dt.toDateString() === now.toDateString();
  const yesterday = new Date(now.getTime() - 864e5).toDateString() === dt.toDateString();
  if (sameDay) return `azi la ${fmt(dt)}`;
  if (yesterday) return `ieri la ${fmt(dt)}`;
  return dt.toLocaleString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
