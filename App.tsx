import React from "react";
import { SafeAreaView, View, Text, StyleSheet, Platform } from "react-native";
import ImagePickerView from "./components/ImagePickerView";

export default function App() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.dummyText}>Hello world!2</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1, padding: 16, gap: 16 },
  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { color: "#6b7280" },
  dummyText: {
    margin: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "blue",
  },
});
