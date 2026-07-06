import { NavigatorScreenParams } from "@react-navigation/native";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  CatalogTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;

  ProductDetail: { productId: string };
  Category: { slug: string; name: string };
  Search: undefined;
  Checkout: undefined;
  Orders: undefined;
  OrderDetail: { orderId: string };
  Wishlist: undefined;
  AdminDashboard: undefined;
  AdminProducts: undefined;
  AdminAddProduct: { productId?: string };
  AdminOrders: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};