import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default () => {
  return (
    <View style={{ height: 250 }}>
      <WebView
        originWhitelist={["*"]}
        source={{
          uri: "https://anandchowdhary.github.io/bigread/webview.html"
        }}
        style={{ marginTop: 20 }}
        scrollEnabled={true}
      />
    </View>
  );
};
