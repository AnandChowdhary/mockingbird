import React from "react";
import { SafeAreaView } from "react-native";
import Camera from "./views/Camera";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Camera />
    </SafeAreaView>
  );
}
