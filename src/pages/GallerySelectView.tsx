import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Platform } from "react-native";
import ImagePickerView from "../components/ImagePickerView";

export default function GallerySelectView() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Gallery Picker (Web Compatible)</Text>
        <Text style={styles.subtitle}>
          Platform: {Platform.OS} / React Native + Expo Image Picker
        </Text>

        <ImagePickerView />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1, padding: 16, gap: 16 },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { color: "#6b7280" },
});
