import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { resolveProductImage } from "../../utils/imageHelpers";
import { colors } from "../../styles/colors";
import { spacing, radius } from "../../styles/spacing";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface ProductImageGalleryProps {
  productId: string;
  imageUris?: string[];
  height?: number;
}

const PLACEHOLDER = require("../../assets/images/placeholder-product.png");

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  productId,
  imageUris = [],
  height = 300,
}) => {
  const [mainSource, setMainSource] = useState<{ uri: string } | number>(
    PLACEHOLDER,
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const [sources, setSources] = useState<Array<{ uri: string } | number>>([
    PLACEHOLDER,
  ]);

  useEffect(() => {
    const buildSources = async () => {
      const local = await resolveProductImage(productId);
      const apiSources = imageUris.map((uri) => ({ uri }));

      const all: Array<{ uri: string } | number> =
        local !== PLACEHOLDER
          ? [local, ...apiSources]
          : apiSources.length > 0
            ? apiSources
            : [PLACEHOLDER];

      setSources(all);
      setMainSource(all[0]);
    };
    buildSources();
  }, [productId, imageUris]);

  const selectImage = (index: number) => {
    setActiveIndex(index);
    setMainSource(sources[index]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.mainWrapper, { height }]}>
        <Image
          source={mainSource}
          style={styles.mainImage}
          resizeMode="contain"
        />
      </View>

      {sources.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbsScroll}
          style={styles.thumbsBar}
        >
          {sources.map((src, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => selectImage(i)}
              style={[styles.thumb, activeIndex === i && styles.thumbActive]}
              activeOpacity={0.8}
            >
              <Image
                source={src}
                style={styles.thumbImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {sources.length > 1 && (
        <View style={styles.dots}>
          {sources.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, activeIndex === i && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: colors.cardAlt },
  mainWrapper: {
    width: SCREEN_WIDTH,
    backgroundColor: colors.cardAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mainImage: { width: "100%", height: "100%" },

  thumbsBar: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  thumbsScroll: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: colors.card,
  },
  thumbActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  thumbImage: { width: "100%", height: "100%" },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 18,
  },
});
