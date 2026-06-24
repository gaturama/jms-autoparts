export interface StaticCategory {
  slug: string;
  name: string;
  icon: string;
  color: string;
}

export const STATIC_CATEGORIES: StaticCategory[] = [
  { slug: 'pneus',            name: 'Pneus',             icon: '⭕', color: '#E94560' },
  { slug: 'rodas',            name: 'Rodas & Aros',      icon: '🔵', color: '#3498DB' },
  { slug: 'suspensao',        name: 'Suspensão',          icon: '⚡', color: '#9B59B6' },
  { slug: 'amortecedores',    name: 'Amortecedores',      icon: '🔧', color: '#E67E22' },
  { slug: 'oleo-motor',       name: 'Óleo de Motor',      icon: '💧', color: '#1ABC9C' },
  { slug: 'intake',           name: 'Intake & Filtros',   icon: '💨', color: '#2ECC71' },
  { slug: 'farois-led',       name: 'Faróis LED',         icon: '💡', color: '#F1C40F' },
  { slug: 'ponteiras-escape', name: 'Ponteiras',          icon: '▲',  color: '#E74C3C' },
  { slug: 'escape-esportivo', name: 'Escape Esportivo',   icon: '🔴', color: '#C0392B' },
  { slug: 'aerofólio',        name: 'Aerofólio',          icon: '🔺', color: '#2980B9' },
  { slug: 'led-interno',      name: 'LED Interno',        icon: '⭐', color: '#8E44AD' },
  { slug: 'acessorios',       name: 'Acessórios',         icon: '🔩', color: '#7F8C8D' },
];