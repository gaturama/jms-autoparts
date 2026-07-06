import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { AppStackParamList } from "../../types/navigation.types";
import { Category } from "../../types/product.types";
import { productService, categoryService } from "../../service/productService";
import { saveProductImage, uriToBase64 } from "../../utils/imageHelpers";
import { Header } from "../../components/layout/Header";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

type Route = RouteProp<AppStackParamList, "AdminAddProduct">;
type Nav = StackNavigationProp<AppStackParamList>;

interface FormState {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  brand: string;
  sku: string;
  stock: string;
  category: string;
  tags: string;
  isFeatured: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  brand: "",
  sku: "",
  stock: "0",
  category: "",
  tags: "",
  isFeatured: false,
};

export default function AdminAddProductScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { productId } = route.params ?? {};
  const isEditing = !!productId;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingProduct, setIsFetchingProduct] = useState(isEditing);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof FormState) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  useEffect(() => {
    categoryService
      .list()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!productId) return;
    productService
      .getById(productId)
      .then((p) => {
        setForm({
          name: p.name,
          description: p.description,
          price: String(p.price),
          originalPrice: p.originalPrice ? String(p.originalPrice) : "",
          brand: p.brand,
          sku: p.sku,
          stock: String(p.stock),
          category:
            typeof p.category === "object" ? p.category._id : p.category,
          tags: p.tags.join(", "),
          isFeatured: p.isFeatured,
        });
      })
      .catch(() => Alert.alert("Erro", "Produto não encontrado"))
      .finally(() => setIsFetchingProduct(false));
  }, [productId]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "Precisamos de acesso à galeria para adicionar imagens.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nome obrigatório";
    if (!form.description.trim() || form.description.length < 10)
      e.description = "Descrição muito curta";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      e.price = "Preço inválido";
    if (!form.brand.trim()) e.brand = "Marca obrigatória";
    if (!form.sku.trim()) e.sku = "SKU obrigatório";
    if (!form.category) e.category = "Categoria obrigatória";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        originalPrice: form.originalPrice
          ? Number(form.originalPrice)
          : undefined,
        brand: form.brand.trim(),
        sku: form.sku.trim().toUpperCase(),
        stock: Number(form.stock) || 0,
        category: form.category,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isFeatured: form.isFeatured,
      };

      let savedProduct;
      if (isEditing && productId) {
        savedProduct = await productService.update(productId, payload);
      } else {
        savedProduct = await productService.create(payload);
      }

      if (imageUri && savedProduct._id) {
        const base64 = await uriToBase64(imageUri);
        await saveProductImage(savedProduct._id, base64);
      }

      Alert.alert(
        "Sucesso",
        isEditing
          ? "Produto atualizado com sucesso!"
          : "Produto criado com sucesso!",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      Alert.alert(
        "Erro",
        err instanceof Error ? err.message : "Falha ao salvar produto",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingProduct)
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Header title="Carregando..." onBack={() => navigation.goBack()} />
        <LoadingSpinnerInline />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Header
        title={isEditing ? "Editar produto" : "Novo produto"}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IMAGEM DO PRODUTO</Text>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={36} color={colors.textMuted} />
                <Text style={styles.imagePlaceholderText}>
                  Toque para escolher imagem
                </Text>
                <Text style={styles.imagePlaceholderSub}>
                  Salva localmente no dispositivo
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {imageUri && (
            <TouchableOpacity
              onPress={() => setImageUri(null)}
              style={styles.removeImageBtn}
            >
              <Ionicons name="close-outline" size={14} color={colors.error} />
              <Text style={styles.removeImageText}>Remover imagem</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMAÇÕES BÁSICAS</Text>
          <Input
            label="Nome do produto"
            value={form.name}
            onChangeText={set("name")}
            placeholder="Ex: Pneu Michelin Pilot Sport 4"
            error={errors.name}
          />
          <Input
            label="Descrição"
            value={form.description}
            onChangeText={set("description")}
            placeholder="Descreva o produto em detalhes..."
            multiline
            numberOfLines={4}
            error={errors.description}
          />
          <Input
            label="Marca"
            value={form.brand}
            onChangeText={set("brand")}
            placeholder="Ex: Michelin, Bilstein, K&N"
            error={errors.brand}
          />
          <Input
            label="SKU"
            value={form.sku}
            onChangeText={set("sku")}
            placeholder="Ex: MCH-PS4-225R17"
            autoCapitalize="characters"
            error={errors.sku}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREÇO & ESTOQUE</Text>
          <View style={styles.row}>
            <View style={styles.flex1}>
              <Input
                label="Preço (R$)"
                value={form.price}
                onChangeText={set("price")}
                keyboardType="decimal-pad"
                placeholder="0,00"
                error={errors.price}
              />
            </View>
            <View style={styles.flex1}>
              <Input
                label="Preço original"
                value={form.originalPrice}
                onChangeText={set("originalPrice")}
                keyboardType="decimal-pad"
                placeholder="0,00 (opcional)"
              />
            </View>
          </View>
          <Input
            label="Estoque (unidades)"
            value={form.stock}
            onChangeText={set("stock")}
            keyboardType="number-pad"
            placeholder="0"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CATEGORIA</Text>
          {errors.category && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat._id}
                style={[
                  styles.categoryOption,
                  form.category === cat._id && styles.categoryOptionActive,
                ]}
                onPress={() => setForm((f) => ({ ...f, category: cat._id }))}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryOptionText,
                    form.category === cat._id &&
                      styles.categoryOptionTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TAGS & DESTAQUE</Text>
          <Input
            label="Tags (separadas por vírgula)"
            value={form.tags}
            onChangeText={set("tags")}
            placeholder="pneu, esportivo, michelin"
          />
          <TouchableOpacity
            style={styles.featuredToggle}
            onPress={() =>
              setForm((f) => ({ ...f, isFeatured: !f.isFeatured }))
            }
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.checkbox,
                form.isFeatured && styles.checkboxActive,
              ]}
            >
              {form.isFeatured && <Ionicons name="checkmark" size={14} color={colors.white} />}
            </View>
            <View>
              <Text style={styles.featuredLabel}>Produto em destaque</Text>
              <Text style={styles.featuredSub}>
                Aparece na seção de destaques da Home
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Button
          label={isEditing ? "Salvar alterações" : "Criar produto"}
          onPress={handleSave}
          isLoading={isLoading}
          fullWidth
          size="lg"
          style={styles.saveBtn}
        />

        <View style={{ height: spacing["3x1"] }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const LoadingSpinnerInline = () => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.base },

  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  errorText: { fontSize: 12, color: colors.error, marginBottom: spacing.sm },

  imagePicker: {
    height: 180,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  imagePreview: { width: "100%", height: "100%" },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  imagePlaceholderIcon: { fontSize: 36 },
  imagePlaceholderText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  imagePlaceholderSub: { fontSize: 11, color: colors.textMuted },
  removeImageBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, marginTop: spacing.sm },
  removeImageText: { fontSize: 12, color: colors.error, fontWeight: "600" },

  row: { flexDirection: "row", gap: spacing.sm },
  flex1: { flex: 1 },

  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  categoryOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  categoryOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "22",
  },
  categoryOptionText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  categoryOptionTextActive: { color: colors.primary, fontWeight: "700" },

  featuredToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: { fontSize: 14, color: colors.white, fontWeight: "800" },
  featuredLabel: { fontSize: 14, fontWeight: "600", color: colors.textPrimary },
  featuredSub: { fontSize: 11, color: colors.textMuted },

  saveBtn: { marginTop: spacing.sm },
});