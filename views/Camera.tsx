import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);

  const takeImageAndOcr = async () => {
    alert("Photo!");
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
      <View style={cam.nav}>
        <TouchableOpacity style={cam.button} onPress={() => {}}>
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
