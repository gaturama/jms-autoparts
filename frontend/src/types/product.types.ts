export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category | string;
  brand: string;
  sku: string;
  stock: number;
  images: string[];
  specs: Record<string, string>;
  tags: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  product: string;
  user: { _id: string; name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  page?: number;
  limit?: number;
}