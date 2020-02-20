import React from "react";
import { WebView } from "react-native-webview";
import { html } from "../helpers/web-ocr";

export default () => {
  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html }}
      style={{ marginTop: 20 }}
    />
  );
};
