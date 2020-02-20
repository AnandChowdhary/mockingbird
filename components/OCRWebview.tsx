import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default () => {
  return (
    <View>
      <WebView
        originWhitelist={["*"]}
        source={{ uri: "http://127.0.0.1:5500/test-ocr.html" }}
        style={{ marginTop: 20 }}
        scrollEnabled={true}
      />
    </View>
  );
};
