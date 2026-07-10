import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppStackParamList } from "../../types/navigation.types";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../service/authService";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Badge } from "../../components/common/Badge";
import { formatDate } from "../../utils/formatDate";
import { formatPhone } from "../../utils/validators";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";
import { fonts } from "../../styles/typography";

type Nav = StackNavigationProp<AppStackParamList>;

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sublabel?: string;
  onPress: () => void;
  danger?: boolean;
}

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  console.log("1");
  const { user, logout, updateUser } = useAuth();
  console.log("2", user);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
  });

  const set = (key: string) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await authService.updateMe(form);
      updateUser(updated);
      setIsEditing(false);
      Alert.alert("Salvo", "Perfil atualizado com sucesso.");
    } catch (err) {
      Alert.alert(
        "Erro",
        err instanceof Error ? err.message : "Falha ao salvar",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Deseja realmente sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout },
    ]);
  };

  const menuItems: MenuItem[] = [
    {
      icon: "clipboard-outline",
      label: "Meus pedidos",
      sublabel: "Acompanhe suas compras",
      onPress: () => navigation.navigate("Orders"),
    },
    {
      icon: "heart-outline",
      label: "Lista de desejos",
      sublabel: "Produtos salvos",
      onPress: () => navigation.navigate("Wishlist"),
    },
    {
      icon: "search-outline",
      label: "Buscar produtos",
      onPress: () => navigation.navigate("Search"),
    },
    ...(user?.role === "admin"
      ? [
          {
            icon: "settings-outline" as const,
            label: "Painel Admin",
            sublabel: "Gerenciar loja",
            onPress: () => navigation.navigate("AdminDashboard"),
          },
        ]
      : []),
  ];

  console.log("3");

  if (!user) return null;

  console.log("4");
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PERFIL</Text>
      </View>
      <View style={styles.headerDivider} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name[0].toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              {user.role === "admin" && (
                <Badge label="ADMIN" variant="primary" />
              )}
            </View>
            <Text style={styles.userEmail}>{user.email}</Text>
            {user.phone && (
              <Text style={styles.userPhone}>{formatPhone(user.phone)}</Text>
            )}
            <Text style={styles.memberSince}>
              Membro desde {formatDate(user.createdAt)}
            </Text>
          </View>
        </View>

        {isEditing ? (
          <View style={styles.editSection}>
            <Text style={styles.sectionTitle}>EDITAR PERFIL</Text>
            <Input
              label="Nome"
              value={form.name}
              onChangeText={set("name")}
              autoCapitalize="words"
              placeholder="Seu nome completo"
            />
            <Input
              label="Telefone"
              value={form.phone}
              onChangeText={(v) => set("phone")(formatPhone(v))}
              keyboardType="phone-pad"
              placeholder="(48) 99999-9999"
            />
            <View style={styles.editActions}>
              <Button
                label="Cancelar"
                onPress={() => {
                  setIsEditing(false);
                  setForm({ name: user.name, phone: user.phone ?? "" });
                }}
                variant="outline"
                style={styles.editActionBtn}
              />
              <Button
                label="Salvar"
                onPress={handleSave}
                isLoading={isSaving}
                style={styles.editActionBtn}
                textStyle={{ color: colors.textInverse }}
              />
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setIsEditing(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.editBtnText}>Editar perfil</Text>
          </TouchableOpacity>
        )}

        <View style={styles.menu}>
          <Text style={styles.sectionTitle}>ACESSO RÁPIDO</Text>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.menuItem,
                i === menuItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              <View style={styles.menuIconWrap}>
                <Ionicons name={item.icon} size={19} color={item.danger ? colors.error : colors.primary} />
              </View>
              <View style={styles.menuInfo}>
                <Text
                  style={[
                    styles.menuLabel,
                    item.danger && { color: colors.error },
                  ]}
                >
                  {item.label}
                </Text>
                {!!item.sublabel && (
                  <Text style={styles.menuSublabel}>{item.sublabel}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.logoutSection}>
          <Button
            label="Sair da conta"
            onPress={handleLogout}
            variant="outline"
            fullWidth
            style={styles.logoutBtn}
            textStyle={{ color: colors.error }}
          />
          <Text style={styles.version}>AutoParts v1.0.0</Text>
        </View>

        <View style={{ height: spacing["3x1"] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.textPrimary,
    letterSpacing: 3,
  },
  headerDivider: { height: 1, backgroundColor: colors.border },

  avatarSection: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.base,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  avatarText: { fontFamily: fonts.displayBold, fontSize: 26, color: colors.textInverse },
  userInfo: { flex: 1, justifyContent: "center" },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: 3,
  },
  userName: { fontFamily: fonts.displayBold, fontSize: 17, color: colors.textPrimary },
  userEmail: { fontSize: 12, color: colors.textMuted },
  userPhone: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  memberSince: { fontSize: 11, color: colors.textMuted, marginTop: 4 },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    margin: spacing.base,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editBtnIcon: { fontSize: 16 },
  editBtnText: { fontSize: 14, fontWeight: "600", color: colors.textSecondary },

  editSection: {
    margin: spacing.base,
    padding: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontFamily: fonts.displaySemibold,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  editActions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  editActionBtn: { flex: 1 },

  menu: {
    margin: spacing.base,
    marginTop: 0,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuIconWrap: { width: 28, alignItems: "center" },
  menuInfo: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  menuSublabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  menuArrow: { fontSize: 16, color: colors.textMuted },

  logoutSection: { paddingHorizontal: spacing.base, paddingTop: spacing.sm },
  logoutBtn: { borderColor: colors.error },
  version: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.md,
  },
});