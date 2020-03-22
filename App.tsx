import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";

export default function App() {
  const [active, setActive] = useState("photo");
  return (
    <SafeAreaView style={styles.parent}>
      <View style={styles.container}>
        {active === "live" ? <CameraPage /> : <></>}
        {active === "photo" ? <CameraPage /> : <></>}
        {active === "subtitles" ? <Text>subtitles</Text> : <></>}
        {active === "settings" ? <Text>settings</Text> : <></>}
      </View>
      <View style={styles.nav}>
        <TouchableOpacity
          onPress={() => setActive("live")}
          style={{
            ...styles.navItem,
            ...(active === "live" ? styles.navItemActive : {})
          }}
        >
          <View style={styles.navItemInner}>
            <Ionicons
              name="md-videocam"
              size={32}
              color={active === "live" ? "#3498db" : "#777"}
            />
            <Text
              style={{
                ...(active === "live" ? styles.navItemActiveText : {})
              }}
            >
              Live
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActive("photo")}
          style={{
            ...styles.navItem,
            ...(active === "photo" ? styles.navItemActive : {})
          }}
        >
          <View style={styles.navItemInner}>
            <Ionicons
              name="md-camera"
              size={32}
              color={active === "photo" ? "#3498db" : "#777"}
            />
            <Text
              style={{
                ...(active === "photo" ? styles.navItemActiveText : {})
              }}
            >
              Photo
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActive("subtitles")}
          style={{
            ...styles.navItem,
            ...(active === "subtitles" ? styles.navItemActive : {})
          }}
        >
          <View style={styles.navItemInner}>
            <MaterialIcons
              name="subtitles"
              size={32}
              color={active === "subtitles" ? "#3498db" : "#777"}
            />
            <Text
              style={{
                ...(active === "subtitles" ? styles.navItemActiveText : {})
              }}
            >
              Subtitles
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActive("settings")}
          style={{
            ...styles.navItem,
            ...(active === "settings" ? styles.navItemActive : {})
          }}
        >
          <View style={styles.navItemInner}>
            <Ionicons
              name="md-cog"
              size={32}
              color={active === "settings" ? "#3498db" : "#777"}
            />
            <Text
              style={{
                ...(active === "settings" ? styles.navItemActiveText : {})
              }}
            >
              Settings
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  parent: {
    flex: 1
  },
  nav: {
    flexDirection: "row"
  },
  navItem: {
    flex: 1,
    paddingTop: 10
  },
  navItemInner: {
    alignItems: "center"
  },
  navItemActive: {},
  navItemActiveText: {
    color: "#3498db"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  cameraPage: {
    width: "100%",
    height: "100%",
    flex: 1
  },
  cameraInner: {
    width: "100%",
    height: "100%"
  },
  cameraItems: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  cameraNav: {
    marginBottom: 25,
    flexDirection: "row"
  },
  cameraBtn: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 25,
    marginHorizontal: 10
  },
  cameraBtnText: {
    fontSize: 24,
    color: "#000",
    margin: 10
  }
});

const CameraPage = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.cameraPage}>
      <Camera style={styles.cameraInner} type={type}>
        <View style={styles.cameraItems}>
          <View style={styles.cameraNav}>
            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Text style={styles.cameraBtnText}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraBtn} onPress={() => {}}>
              <Text style={styles.cameraBtnText}>Click</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
};
