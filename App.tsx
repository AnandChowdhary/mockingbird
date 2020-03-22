import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function App() {
  const [active, setActive] = useState("photo");
  return (
    <SafeAreaView style={styles.parent}>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
      </View>
      <View style={styles.nav}>
        <TouchableOpacity
          style={{
            ...styles.navItem,
            ...(active === "live" ? styles.navItemActive : {})
          }}
        >
          <View style={styles.navItemInner}>
            <Ionicons
              name="md-videocam"
              size={32}
              color={active === "" ? "#3498db" : "#777"}
            />
            <Text
              style={{
                ...(active === "Textlive" ? styles.navItemActiveText : {})
              }}
            >
              Live
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
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
    flex: 1
  },
  navItemInner: {
    alignItems: "center"
  },
  navItemActive: {},
  navItemActiveText: {
    fontWeight: "bold",
    color: "#3498db"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
