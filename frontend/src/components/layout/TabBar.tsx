import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart } from "../../context/CartContext";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

const TAB_CONFIG: Record<string, { icon: string; label: string }> = {
  HomeTab: { icon: "🏠", label: "Início" },
  CatalogTab: { icon: "🔍", label: "Catálogo" },
  CartTab: { icon: "🛒", label: "Carrinho" },
  ProfileTab: { icon: "👤", label: "Perfil" },
};

export const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();

  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom || spacing.sm }]}
    >
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name];
          const { options } = descriptors[route.key];
          const isCart = route.name === "CartTab";

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
            >
              <View style={styles.iconWrapper}>
                <Text style={[styles.icon, isFocused && styles.iconFocused]}>
                  {config?.icon ?? "●"}
                </Text>
                {isCart && itemCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {itemCount > 99 ? "99+" : itemCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[styles.label, isFocused && styles.labelFocused]}>
                {config?.label ?? route.name}
              </Text>
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bar: {
    flexDirection: "row",
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.xs,
    position: "relative",
  },
  iconWrapper: {
    position: "relative",
    marginBottom: 3,
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.textMuted,
  },
  labelFocused: {
    color: colors.primary,
    fontWeight: "700",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.white,
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    width: 28,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
});
