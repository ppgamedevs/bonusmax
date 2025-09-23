export const fmtRON = (n: number) =>
  new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(n);

export const fmtDateRO = (d: Date | string) => new Date(d).toLocaleDateString('ro-RO');
