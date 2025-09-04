import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import type { PickedAsset } from "../managers/types";
import { formatBytes } from "../utils/formatBytes";

type Props = {
  image: PickedAsset;
  height?: number; // 미리보기 높이
};

export default function SelectedImageCard({ image, height = 220 }: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: image.uri }}
        style={[styles.preview, { height }]}
        resizeMode="contain"
        accessibilityLabel={image.fileName ?? "selected image"}
      />

      <View style={styles.meta}>
        <Text style={styles.name} numberOfLines={1}>
          {image.fileName ?? "(unnamed)"}
        </Text>
        <Text style={styles.caption}>
          {image.mimeType ?? "image/*"} • {formatBytes(image.fileSize)}
          {image.width && image.height
            ? ` • ${image.width}×${image.height}px`
            : ""}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  preview: {
    width: "100%",
    backgroundColor: "#fafafa",
  },
  meta: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  name: {
    fontWeight: "600",
  },
  caption: {
    color: "#666",
    fontSize: 12,
  },
});
