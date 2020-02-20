import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { ocrApi } from "../helpers/ocr";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  let camera: Camera | undefined = undefined;

  const takeImageAndOcr = async () => {
    if (!camera) return;
    const image = await camera.takePictureAsync({ base64: true, quality: 0.5 });
    console.log("Took a picture!");
    const result = await ocrApi(`data:image/png;base64,${image.base64}`);
    console.log("Result from OCR", result);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <Text style={{ fontSize: 20, padding: 15 }}>BigRead</Text>
      </View>
      <Camera ref={ref => (camera = ref)} style={{ flex: 1 }} type={type} />
      <View style={cam.nav}>
        <TouchableOpacity
          style={cam.button}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <View>
            <Ionicons style={cam.icon} name="ios-reverse-camera" />
            <Text style={cam.label}>Flip</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={cam.button} onPress={() => takeImageAndOcr()}>
          <View>
            <Ionicons style={cam.icon} name="ios-pause" />
            <Text style={cam.label}>Pause</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={cam.button} onPress={() => {}}>
          <View>
            <Ionicons style={cam.icon} name="ios-settings" />
            <Text style={cam.label}>Settings</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const cam = StyleSheet.create({
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  button: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  icon: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 35,
    color: "#aaa"
  },
  label: {
    textAlign: "center"
  }
});
