export default function Preconnect() {
  const list = (process.env.NEXT_PUBLIC_PRECONNECT || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (list.length === 0) return null;
  return (
    <>
      {list.map((href) => (
        <link key={href} rel="preconnect" href={href} crossOrigin="" />
      ))}
      {list.map((href) => (
        <link key={href + 'dns'} rel="dns-prefetch" href={href} />
      ))}
    </>
  );
}
