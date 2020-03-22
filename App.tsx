import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from "react-native";
import { Ionicons, MaterialIcons, Feather, Entypo } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as WebBrowser from "expo-web-browser";

import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";

interface CameraParams {
  active: string;
  setActive: React.Dispatch<string>;
  flashMode: any;
  setFlashMode: React.Dispatch<any>;
  autofocus: any;
  setAutofocus: React.Dispatch<any>;
  zoom: number;
  setZoom: React.Dispatch<number>;
  focusDepth: number;
  setFocusDepth: React.Dispatch<number>;
  endpoint: string;
  setEndpoint: React.Dispatch<string>;
}

/**
 * This is the public web API key (you can see this)
 * This is NOT the Firebase admin API key
 */
const WEB_API_KEY = "AIzaSyCSo4PAiC-cr1euluE4XybGZntQve3rc78";

try {
  firebase.initializeApp({
    apiKey: WEB_API_KEY,
    authDomain: "frankenstein-ce9dd.firebaseapp.com",
    databaseURL: "https://frankenstein-ce9dd.firebaseio.com",
    projectId: "frankenstein-ce9dd",
    storageBucket: "frankenstein-ce9dd.appspot.com",
    messagingSenderId: "168976872219",
    appId: "1:168976872219:web:bd6ef874bb4a27feb419be"
  });
} catch (error) {}
const storage = firebase.storage();
const database = firebase.database();

export default function App() {
  const [active, setActive] = useState("settings");

  /**
   * Global app settings
   */
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.auto); // auto, on, off, torch
  const [autofocus, setAutofocus] = useState(Camera.Constants.AutoFocus.on); // on, off
  const [zoom, setZoom] = useState(0); // 0 to 1
  const [focusDepth, setFocusDepth] = useState(0); // 0 (farthest) to 1 (closest)
  const [endpoint, setEndpoint] = useState("default");
  const cameraParams = {
    active,
    setActive,
    flashMode,
    setFlashMode,
    autofocus,
    setAutofocus,
    zoom,
    setZoom,
    focusDepth,
    setFocusDepth,
    endpoint,
    setEndpoint
  };

  return (
    <SafeAreaView style={styles.parent}>
      <View style={styles.container}>
        {active === "live" ? <CameraPage cameraParams={cameraParams} /> : <></>}
        {active === "photo" ? (
          <CameraPage cameraParams={cameraParams} />
        ) : (
          <></>
        )}
        {active === "subtitles" ? <Text>subtitles</Text> : <></>}
        {active === "settings" ? (
          <SettingsPage cameraParams={cameraParams} />
        ) : (
          <></>
        )}
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
              color={
                [
                  "settings",
                  "settings-webapp",
                  "settings-zoom",
                  "settings-focus",
                  "settings-flash",
                  "settings-subtitles",
                  "settings-quality",
                  "settings-language",
                  "settings-about"
                ].includes(active)
                  ? "#3498db"
                  : "#777"
              }
            />
            <Text
              style={{
                ...([
                  "settings",
                  "settings-webapp",
                  "settings-zoom",
                  "settings-focus",
                  "settings-flash",
                  "settings-subtitles",
                  "settings-quality",
                  "settings-language",
                  "settings-about"
                ].includes(active)
                  ? styles.navItemActiveText
                  : {})
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
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ccc"
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
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 10
  },
  page: {
    width: "100%",
    height: "100%"
  },
  headerText: {
    fontSize: 24
  },
  settingsLink: {
    paddingVertical: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1
  },
  settingsLinkIcon: {
    width: 75,
    flexDirection: "row",
    justifyContent: "center"
  },
  settingsLinkInner: {
    flexDirection: "row",
    alignItems: "center"
  },
  settingsLinkText: {
    fontSize: 18
  }
});

/**
 * @source https://github.com/aaronksaunders/expo-rn-firebase-image-upload/blob/master/README.md
 * @param uri
 * @param progressCallback
 */
export const uploadAsFile = async (
  endpoint: string,
  uri: string,
  progressCallback?: Function
) => {
  console.log("uploadAsFile", uri);
  const response = await fetch(uri);
  const blob = await response.blob();
  var metadata = {
    contentType: "image/jpeg"
  };
  let name = new Date().getTime() + "-media.jpg";
  const ref = storage.ref().child("assets/" + name);
  const task = await ref.put(blob, metadata);
  const url: string = await task.ref.getDownloadURL();
  await database.ref().update({ image: url });
  setTimeout(() => {
    storage
      .ref(ref.name)
      .delete()
      .then(() => {})
      .catch(() => {});
  }, 10000);
};

const SettingsPageHome = ({
  setActive
}: {
  setActive: React.Dispatch<string>;
}) => {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>
      <ScrollView>
        {[
          {
            icon: "md-lock",
            type: "ionicons",
            label: "Web app",
            to: "webapp"
          },
          { icon: "zoom-in", type: "feather", label: "Zoom", to: "zoom" },
          {
            icon: "center-focus-strong",
            type: "material",
            label: "Focus",
            to: "focus"
          },
          { icon: "flashlight", type: "entypo", label: "Flash", to: "flash" },
          {
            icon: "subtitles",
            type: "material",
            label: "Subtitles",
            to: "subtitles"
          },
          {
            icon: "high-quality",
            type: "material",
            label: "Quality",
            to: "quality"
          },
          {
            icon: "language",
            type: "entypo",
            label: "Language",
            to: "language"
          },
          {
            icon: "info-with-circle",
            type: "entypo",
            label: "About",
            url:
              "https://github.com/AnandChowdhary/mockingbird/blob/master/README.md"
          }
        ].map(item => {
          return (
            <TouchableOpacity
              key={`${item.label}${item.to}${item.url}`}
              onPress={async () => {
                if (item.to) return setActive(`settings-${item.to}`);
                if (item.url) await WebBrowser.openBrowserAsync(item.url);
              }}
              style={styles.settingsLink}
            >
              <View style={styles.settingsLinkInner}>
                <View style={styles.settingsLinkIcon}>
                  {item.type === "feather" ? (
                    <Feather name={item.icon} size={32} />
                  ) : (
                    <></>
                  )}
                  {item.type === "ionicons" ? (
                    <Ionicons name={item.icon} size={32} />
                  ) : (
                    <></>
                  )}
                  {item.type === "entypo" ? (
                    <Entypo name={item.icon} size={32} />
                  ) : (
                    <></>
                  )}
                  {item.type === "material" ? (
                    <MaterialIcons name={item.icon} size={32} />
                  ) : (
                    <></>
                  )}
                </View>
                <Text style={styles.settingsLinkText}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const SettingsPageWebapp = ({
  setActive,
  cameraParams
}: {
  setActive: React.Dispatch<string>;
  cameraParams: CameraParams;
}) => {
  return <></>;
};

const SettingsPageFocus = ({
  setActive,
  cameraParams
}: {
  setActive: React.Dispatch<string>;
  cameraParams: CameraParams;
}) => {
  return <></>;
};

const SettingsPageFlash = ({
  setActive,
  cameraParams
}: {
  setActive: React.Dispatch<string>;
  cameraParams: CameraParams;
}) => {
  return <></>;
};

const SettingsPageSubtitles = ({
  setActive,
  cameraParams
}: {
  setActive: React.Dispatch<string>;
  cameraParams: CameraParams;
}) => {
  return <></>;
};

const SettingsPageQuality = ({
  setActive,
  cameraParams
}: {
  setActive: React.Dispatch<string>;
  cameraParams: CameraParams;
}) => {
  return <></>;
};

const SettingsPageLanguage = ({
  setActive,
  cameraParams
}: {
  setActive: React.Dispatch<string>;
  cameraParams: CameraParams;
}) => {
  return <></>;
};

const SettingsPageZoom = ({
  setActive,
  cameraParams
}: {
  setActive: React.Dispatch<string>;
  cameraParams: CameraParams;
}) => {
  return <></>;
};

const SettingsPage = ({ cameraParams }: { cameraParams: CameraParams }) => {
  if (cameraParams.active === "settings")
    return <SettingsPageHome setActive={cameraParams.setActive} />;
  if (cameraParams.active === "settings-webapp")
    return (
      <SettingsPageWebapp
        cameraParams={cameraParams}
        setActive={cameraParams.setActive}
      />
    );
  if (cameraParams.active === "settings-zoom")
    return (
      <SettingsPageZoom
        cameraParams={cameraParams}
        setActive={cameraParams.setActive}
      />
    );
  if (cameraParams.active === "settings-focus")
    return (
      <SettingsPageFocus
        cameraParams={cameraParams}
        setActive={cameraParams.setActive}
      />
    );
  if (cameraParams.active === "settings-flash")
    return (
      <SettingsPageFlash
        cameraParams={cameraParams}
        setActive={cameraParams.setActive}
      />
    );
  if (cameraParams.active === "settings-subtitles")
    return (
      <SettingsPageSubtitles
        cameraParams={cameraParams}
        setActive={cameraParams.setActive}
      />
    );
  if (cameraParams.active === "settings-quality")
    return (
      <SettingsPageQuality
        cameraParams={cameraParams}
        setActive={cameraParams.setActive}
      />
    );
  if (cameraParams.active === "settings-language")
    return (
      <SettingsPageLanguage
        cameraParams={cameraParams}
        setActive={cameraParams.setActive}
      />
    );
};

const CameraPage = ({ cameraParams }: { cameraParams: CameraParams }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState<Camera>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);
  const click = async () => {
    if (!camera) return;
    const image = await camera.takePictureAsync({
      quality: 0.1
    });
    await uploadAsFile(cameraParams.endpoint, image.uri);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.cameraPage}>
      <Camera
        useCamera2Api={true}
        ref={ref => setCamera(ref)}
        style={styles.cameraInner}
        type={type}
        zoom={cameraParams.zoom}
        autoFocus={cameraParams.autofocus}
        flashMode={cameraParams.flashMode}
        focusDepth={cameraParams.focusDepth}
      >
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
            <TouchableOpacity style={styles.cameraBtn} onPress={click}>
              <Text style={styles.cameraBtnText}>Click</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
};
