export interface ProductImageMeta {
  productId: string;
  storageKey: string;
  hasLocalImage: boolean;
}

export const getImageStorageKey = (productId: string): string =>
  `@autoparts:img:${productId}`;

export const PRODUCT_IMAGE_META: ProductImageMeta[] = [
  {
    productId: "mock-001",
    storageKey: getImageStorageKey("mock-001"),
    hasLocalImage: false,
  },
  {
    productId: "mock-002",
    storageKey: getImageStorageKey("mock-002"),
    hasLocalImage: false,
  },
  {
    productId: "mock-003",
    storageKey: getImageStorageKey("mock-003"),
    hasLocalImage: false,
  },
  {
    productId: "mock-004",
    storageKey: getImageStorageKey("mock-004"),
    hasLocalImage: false,
  },
  {
    productId: "mock-005",
    storageKey: getImageStorageKey("mock-005"),
    hasLocalImage: false,
  },
  {
    productId: "mock-006",
    storageKey: getImageStorageKey("mock-006"),
    hasLocalImage: false,
  },
  {
    productId: "mock-007",
    storageKey: getImageStorageKey("mock-007"),
    hasLocalImage: false,
  },
  {
    productId: "mock-008",
    storageKey: getImageStorageKey("mock-008"),
    hasLocalImage: false,
  },
  {
    productId: "mock-009",
    storageKey: getImageStorageKey("mock-009"),
    hasLocalImage: false,
  },
  {
    productId: "mock-010",
    storageKey: getImageStorageKey("mock-010"),
    hasLocalImage: false,
  },
  {
    productId: "mock-011",
    storageKey: getImageStorageKey("mock-011"),
    hasLocalImage: false,
  },
];

export const hasRegisteredImage = (productId: string): boolean =>
  PRODUCT_IMAGE_META.some((m) => m.productId === productId && m.hasLocalImage);
