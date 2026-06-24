import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Category } from "../models/Category.model";
import { Product } from "../models/Product.model";
import { User } from "../models/User.model";
import { env } from "../config/env";

const categories = [
  {
    name: "Pneus",
    slug: "pneus",
    description: "Pneus para todos os tipos de veículo",
    icon: "circle",
    isActive: true,
  },
  {
    name: "Rodas & Aros",
    slug: "rodas",
    description: "Rodas esportivas e aros personalizados",
    icon: "disc",
    isActive: true,
  },
  {
    name: "Suspensão",
    slug: "suspensao",
    description: "Kits e peças de suspensão",
    icon: "zap",
    isActive: true,
  },
  {
    name: "Amortecedores",
    slug: "amortecedores",
    description: "Amortecedores esportivos e originais",
    icon: "activity",
    isActive: true,
  },
  {
    name: "Óleo de Motor",
    slug: "oleo-motor",
    description: "Óleos e lubrificantes",
    icon: "droplet",
    isActive: true,
  },
  {
    name: "Intake & Filtros",
    slug: "intake",
    description: "Intake esportivo e filtros de ar",
    icon: "wind",
    isActive: true,
  },
  {
    name: "Faróis LED",
    slug: "farois-led",
    description: "Faróis e lanternas em LED",
    icon: "sun",
    isActive: true,
  },
  {
    name: "Ponteiras de Escape",
    slug: "ponteiras-escape",
    description: "Ponteiras esportivas e cromadas",
    icon: "triangle",
    isActive: true,
  },
  {
    name: "Escape Esportivo",
    slug: "escape-esportivo",
    description: "Escapamentos completos e downpipes",
    icon: "gitlab",
    isActive: true,
  },
  {
    name: "Aerofólio & Body Kit",
    slug: "aerofólio",
    description: "Aerofólios, difusores e body kits",
    icon: "maximize-2",
    isActive: true,
  },
  {
    name: "LED Interno",
    slug: "led-interno",
    description: "Iluminação interna e ambient light",
    icon: "star",
    isActive: true,
  },
  {
    name: "Acessórios",
    slug: "acessorios",
    description: "Acessórios e utilidades gerais",
    icon: "tool",
    isActive: true,
  },
];

const seedDB = async () => {
  await mongoose.connect(env.MONGO_URI);
  console.log("✅ Conectado ao MongoDB");

  // Limpar coleções
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({ role: "admin" }),
  ]);
  console.log("🗑️  Coleções limpas");

  // Inserir categorias
  const createdCategories = await Category.insertMany(categories);
  console.log(`📂 ${createdCategories.length} categorias criadas`);

  // Criar admin padrão
  const admin = await User.create({
    name: "Admin AutoParts",
    email: "admin@autoparts.com",
    passwordHash: "admin123",
    role: "admin",
  });
  console.log(`👤 Admin criado: ${admin.email} / senha: admin123`);

  // Mapear slugs para IDs
  const catMap = Object.fromEntries(
    createdCategories.map((c) => [c.slug, c._id]),
  );

  const products = [
    {
      name: "Pneu Michelin Pilot Sport 4 225/45R17",
      slug: "pneu-michelin-pilot-sport-4-225-45r17",
      description:
        "Pneu de alto desempenho para uso em pista e estrada. Excelente aderência em piso seco e molhado. Fabricação francesa com tecnologia premium.",
      price: 689.9,
      originalPrice: 850.0,
      category: catMap["pneus"],
      brand: "Michelin",
      sku: "MCH-PS4-22545R17",
      stock: 24,
      images: [],
      specs: {
        Largura: "225mm",
        Perfil: "45",
        Aro: "R17",
        "Índice de carga": "91",
        "Índice de velocidade": "Y",
      },
      tags: ["pneu", "michelin", "esportivo", "pilot sport"],
      isFeatured: true,
    },
    {
      name: "Roda OZ Racing Ultraleggera 17x7.5 ET40",
      slug: "roda-oz-racing-ultraleggera-17x75-et40",
      description:
        "Roda em liga de alumínio forjado da OZ Racing, design clássico de 5 raios duplos. Extremamente leve, ideal para uso esportivo.",
      price: 1249.0,
      category: catMap["rodas"],
      brand: "OZ Racing",
      sku: "OZ-ULT-17X75",
      stock: 8,
      images: [],
      specs: {
        Diâmetro: '17"',
        Largura: '7.5"',
        ET: "40",
        PCD: "5x100",
        Material: "Alumínio forjado",
      },
      tags: ["roda", "oz racing", "esportiva", "alumínio"],
      isFeatured: true,
    },
    {
      name: "Kit Suspensão Esportiva H&R Springs Golf GTI MK7",
      slug: "kit-suspensao-hr-springs-golf-gti-mk7",
      description:
        "Molas esportivas H&R para rebaixamento de 30-35mm. Mantém conforto e melhora manuseio. 100% fabricado na Alemanha.",
      price: 1890.0,
      category: catMap["suspensao"],
      brand: "H&R",
      sku: "HR-SPRINGS-GOLFGTI-MK7",
      stock: 5,
      images: [],
      specs: {
        Rebaixamento: "30-35mm",
        Compatibilidade: "Golf GTI MK7/MK7.5",
        Material: "Aço cromo-silício",
        Origem: "Alemanha",
      },
      tags: ["suspensão", "molas", "h&r", "golf", "rebaixamento"],
      isFeatured: false,
    },
    {
      name: "Amortecedor Bilstein B8 Performance Plus (par dianteiro)",
      slug: "amortecedor-bilstein-b8-performance-plus-dianteiro",
      description:
        "Par de amortecedores dianteiros Bilstein B8, tecnologia monotubo com pressurização a gás nitrogênio. Resposta imediata e durabilidade superior.",
      price: 2380.0,
      originalPrice: 2680.0,
      category: catMap["amortecedores"],
      brand: "Bilstein",
      sku: "BIL-B8-FRONT-PAIR",
      stock: 6,
      images: [],
      specs: {
        Tipo: "Monotubo",
        Gás: "Nitrogênio",
        Posição: "Dianteiro",
        Quantidade: "2 unidades",
      },
      tags: ["amortecedor", "bilstein", "b8", "monotubo", "esportivo"],
      isFeatured: true,
    },
    {
      name: "Óleo Motul 8100 X-Clean+ 5W-30 5L",
      slug: "oleo-motul-8100-x-clean-plus-5w30-5l",
      description:
        "Óleo sintético de altíssima performance para motores modernos a gasolina e diesel com DPF/FAP. Aprovado pelas principais montadoras.",
      price: 349.9,
      category: catMap["oleo-motor"],
      brand: "Motul",
      sku: "MOT-8100-XCP-5W30-5L",
      stock: 40,
      images: [],
      specs: {
        Viscosidade: "5W-30",
        Volume: "5 litros",
        Tipo: "Sintético",
        Norma: "ACEA C3",
        Aprovações: "BMW LL-04, VW 504/507",
      },
      tags: ["óleo", "motul", "sintético", "5w30", "motor"],
      isFeatured: false,
    },
    {
      name: "Intake Esportivo K&N 69 Series Typhoon Universal",
      slug: "intake-esportivo-kn-69-series-typhoon-universal",
      description:
        "Kit intake curto K&N com filtro cônico de alto fluxo, duto de alumínio polido e isolamento térmico. Ganho comprovado de torque e potência.",
      price: 1120.0,
      category: catMap["intake"],
      brand: "K&N",
      sku: "KN-69-TYPHOON-UNIV",
      stock: 12,
      images: [],
      specs: {
        Tipo: "Short Ram",
        Filtro: "Cônico lavável",
        Material: "Alumínio polido",
        "Diâmetro entrada": "76mm",
      },
      tags: ["intake", "k&n", "filtro", "esportivo", "potência"],
      isFeatured: true,
    },
    {
      name: "Farol LED Sequencial Universal H4 6000K (par)",
      slug: "farol-led-sequencial-universal-h4-6000k-par",
      description:
        "Par de lâmpadas LED H4 com temperatura de cor 6000K (luz branca fria) e pisca sequencial integrado. Plug and play para a maioria dos veículos.",
      price: 389.9,
      originalPrice: 480.0,
      category: catMap["farois-led"],
      brand: "Osram",
      sku: "OSR-LED-H4-6K-SEQ",
      stock: 30,
      images: [],
      specs: {
        Encaixe: "H4",
        Temperatura: "6000K",
        Lumens: "8000lm/par",
        Voltagem: "12V",
        IP: "IP68",
      },
      tags: ["farol", "led", "h4", "6000k", "sequencial", "osram"],
      isFeatured: false,
    },
    {
      name: "Ponteira de Escape Dupla Oval Inox 304 Universal",
      slug: "ponteira-escape-dupla-oval-inox-304-universal",
      description:
        "Ponteira dupla oval em aço inoxidável 304, acabamento escovado. Encaixe universal 48-60mm com abraçadeira inclusa. Resistente a altas temperaturas.",
      price: 279.9,
      category: catMap["ponteiras-escape"],
      brand: "JetStyle",
      sku: "JTS-PONT-OVAL-DBL-304",
      stock: 20,
      images: [],
      specs: {
        Material: "Inox 304",
        Acabamento: "Escovado",
        Encaixe: "48-60mm",
        Formato: "Duplo oval",
      },
      tags: ["ponteira", "escape", "inox", "oval", "dupla"],
      isFeatured: false,
    },
    {
      name: "Escape Esportivo Completo Scorpion EVO Honda Civic 1.5T",
      slug: "escape-esportivo-completo-scorpion-evo-civic-15t",
      description:
        "Sistema de escape cat-back completo Scorpion EVO em titânio/aço inox. Inclui silencioso principal, intermediário e ponteira oval dupla. Som grave e encorpado.",
      price: 4890.0,
      originalPrice: 5500.0,
      category: catMap["escape-esportivo"],
      brand: "Scorpion",
      sku: "SCO-EVO-CIVIC-15T-CB",
      stock: 3,
      images: [],
      specs: {
        Tipo: "Cat-Back",
        Compatibilidade: "Honda Civic 1.5T 2017-2023",
        Material: "Titânio/Inox 304",
        Ponteira: "Oval dupla 115mm",
      },
      tags: ["escape", "cat-back", "scorpion", "civic", "esportivo"],
      isFeatured: true,
    },
    {
      name: "Aerofólio Traseiro Carbono Universal Estilo GT",
      slug: "aerofólio-traseiro-carbono-universal-gt",
      description:
        "Aerofólio estilo GT em fibra de carbono real (não fibra sintética). Peso ultraleve de 1.8kg, downforce otimizado para alta velocidade. Kit de fixação incluso.",
      price: 1650.0,
      category: catMap["aerofólio"],
      brand: "TuningParts",
      sku: "TP-AERO-CARB-GT-UNIV",
      stock: 7,
      images: [],
      specs: {
        Material: "Fibra de carbono real",
        Peso: "1.8kg",
        Largura: "1350mm",
        Tipo: "GT universale",
      },
      tags: ["aerofólio", "carbono", "gt", "body kit", "downforce"],
      isFeatured: true,
    },
    {
      name: "Kit LED Interno Ambiente RGB 16 cores com Controle",
      slug: "kit-led-interno-ambiente-rgb-16-cores-controle",
      description:
        "Kit completo de LED ambient light para interior do veículo. 4 tiras flexíveis de 50cm cada, 16 cores, controle remoto e app via Bluetooth. Instalação simples com fita 3M.",
      price: 189.9,
      category: catMap["led-interno"],
      brand: "AutoLight",
      sku: "AL-RGB-KIT-4X50-BT",
      stock: 50,
      images: [],
      specs: {
        Cores: "16 + modos dinâmicos",
        Tiras: "4x 50cm",
        Controle: "Remoto + App Bluetooth",
        Instalação: "Fita 3M dupla-face",
      },
      tags: ["led", "interno", "rgb", "ambient light", "bluetooth"],
      isFeatured: false,
    },
  ];

  const createdProducts = await Product.insertMany(products);
  console.log(`📦 ${createdProducts.length} produtos criados`);

  await mongoose.disconnect();
  console.log("\n✅ Seed concluído com sucesso!");
  console.log("─────────────────────────────────");
  console.log("Admin: admin@autoparts.com / admin123");
};

seedDB().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
