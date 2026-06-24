export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDiscount = (original: number, current: number): string => {
  const pct = Math.round(((original - current) / original) * 100);
  return `-${pct}%`;
};