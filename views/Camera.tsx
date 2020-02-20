import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RNCamera } from "react-native-camera";

export default function App() {
  const [type, setType] = useState(RNCamera.Constants.Type.back);

  let camera: RNCamera | undefined = undefined;

  const takeImageAndOcr = async () => {
    if (!camera) return;
    alert("Photo!");
  };

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
      <RNCamera ref={ref => (camera = ref)} style={{ flex: 1 }} type={type} />
      <View style={cam.nav}>
        <TouchableOpacity
          style={cam.button}
          onPress={() => {
            setType(
              type === RNCamera.Constants.Type.back
                ? RNCamera.Constants.Type.front
                : RNCamera.Constants.Type.back
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
