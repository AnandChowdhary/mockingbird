import React, { createRef, useEffect } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

export default ({ recognizeUrl }: { recognizeUrl?: string }) => {
  const viewRef = createRef<WebView>();
  const inject = (url: string) => {
    if (!viewRef) return;
    console.log(url.length);
    viewRef.current.injectJavaScript(`
      (() => {
        window.recognize("data:image/png;base64,${url}");
      })();
    `);
  };
  useEffect(() => {
    if (recognizeUrl) inject(recognizeUrl);
  }, [recognizeUrl, viewRef, inject]);
  return (
    <View style={{ height: 250 }}>
      <WebView
        ref={viewRef}
        originWhitelist={["*"]}
        source={{
          uri: `https://anandchowdhary.github.io/bigread/webview.html`
        }}
        style={{ marginTop: 20 }}
        scrollEnabled={true}
      />
    </View>
  );
};
