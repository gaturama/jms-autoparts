import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { AppStackParamList, MainTabParamList } from "../types/navigation.types";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

import HomeScreen from "../screens/home/HomeScreen";
import CatalogScreen from "../screens/catalog/CatalogScreen";
import CartScreen from "../screens/cart/CartScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ProductDetailScreen from "../screens/product/ProductDetailScreen";
import CategoryScreen from "../screens/catalog/CategoryScreen";
import SearchScreen from "../screens/search/SearchScreen";
import CheckoutScreen from "../screens/checkout/CheckoutScreen";
import OrdersScreen from "../screens/orders/OrdersScreen";
import OrderDetailScreen from "../screens/orders/OrderDetailScreen";
import WishlistScreen from "../screens/wishlist/WishlistScreen";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminProductsScreen from "../screens/admin/AdminProductsScreen";
import AdminAddProductScreen from "../screens/admin/AdminAddProductsScreen";
import AdminOrdersScreen from "../screens/admin/AdminOrdersScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<AppStackParamList>();

const TabIcon = ({
  label,
  icon,
  focused,
  badgeCount,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  badgeCount?: number;
}) => (
  <View style={{ alignItems: "center", paddingTop: spacing.xs }}>
    <View>
      <Ionicons
        name={icon}
        size={22}
        color={focused ? colors.primary : colors.textMuted}
      />

      {!!badgeCount && (
        <View
          style={{
            position: "absolute",
            top: -4,
            right: -8,
            backgroundColor: colors.primary,
            borderRadius: 999,
            minWidth: 16,
            height: 16,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 3,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700" }}>
            {badgeCount > 99 ? "99+" : badgeCount}
          </Text>
        </View>
      )}
    </View>

    <Text
      style={{
        fontSize: 10,
        marginTop: 2,
        fontWeight: focused ? "700" : "400",
        color: focused ? colors.primary : colors.textMuted,
      }}
    >
      {label}
    </Text>
  </View>
);

const BottomTabs: React.FC = () => {
  const { itemCount } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 62,
          paddingBottom: spacing.xs,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Início" icon="home-outline" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="CatalogTab"
        component={CatalogScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Prodt" icon="search-outline" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              label="Cart"
              icon="cart-outline"
              focused={focused}
              badgeCount={itemCount}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Perfil" icon="person-outline" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={BottomTabs} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    <Stack.Screen name="Category" component={CategoryScreen} />
    <Stack.Screen name="Search" component={SearchScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
    <Stack.Screen name="Orders" component={OrdersScreen} />
    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    <Stack.Screen name="Wishlist" component={WishlistScreen} />
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
    <Stack.Screen name="AdminAddProduct" component={AdminAddProductScreen} />
    <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
  </Stack.Navigator>
);
