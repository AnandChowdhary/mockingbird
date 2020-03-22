import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  StatusBar,
  Picker,
  Slider
} from "react-native";
import { Ionicons, MaterialIcons, Feather, Entypo } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as WebBrowser from "expo-web-browser";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";

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
  locale: string;
  setLocale: React.Dispatch<string>;
  quality: number;
  setQuality: React.Dispatch<number>;
  screenOn: string;
  setScreenOn: React.Dispatch<string>;
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
  const [active, setActive] = useState("settings-language");

  /**
   * Global app settings
   */
  const [flashMode, setFlashMode] = useState("auto");
  const [autofocus, setAutofocus] = useState("on");
  const [zoom, setZoom] = useState(0);
  const [focusDepth, setFocusDepth] = useState(0);
  const [endpoint, setEndpoint] = useState("default");
  const [locale, setLocale] = useState("en");
  const [screenOn, setScreenOn] = useState("camera");
  const [quality, setQuality] = useState(0.5);
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
    setEndpoint,
    locale,
    setLocale,
    quality,
    setQuality,
    screenOn,
    setScreenOn
  };

  useEffect(() => {
    deactivateKeepAwake();
    if (screenOn === "always") return activateKeepAwake();
    if (
      screenOn === "camera" &&
      ["live", "photo", "subtitles"].includes("active")
    )
      return activateKeepAwake();
  }, [screenOn, active]);

  return (
    <SafeAreaView style={styles.parent}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {active === "live" ? <CameraPage cameraParams={cameraParams} /> : <></>}
        {active === "photo" ? (
          <CameraPage cameraParams={cameraParams} />
        ) : (
          <></>
        )}
        {active === "subtitles" ? <Text>subtitles</Text> : <></>}
        {[
          "settings",
          "settings-webapp",
          "settings-zoom",
          "settings-focus",
          "settings-flash",
          "settings-subtitles",
          "settings-quality",
          "settings-language",
          "settings-about"
        ].includes(active) ? (
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
    paddingTop: 10,
    paddingBottom: 15
  },
  page: {
    width: "100%",
    height: "100%"
  },
  pagePadded: {
    padding: 25
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold"
  },
  settingsLink: {
    paddingVertical: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1
  },
  settingsLinkIcon: {
    width: 85,
    flexDirection: "row",
    justifyContent: "center"
  },
  settingsLinkInner: {
    flexDirection: "row",
    alignItems: "center"
  },
  settingsLinkText: {
    fontSize: 24
  },
  inputGroup: {},
  label: {
    fontSize: 18,
    marginBottom: 10
  },
  input: {
    padding: 15,
    fontSize: 24,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5
  },
  slider: {},
  buttons: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  button: {
    backgroundColor: "#eee",
    width: "30%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15
  },
  buttonFull: {
    width: "100%"
  },
  buttonSelected: {
    backgroundColor: "#333"
  },
  buttonText: {
    fontSize: 28
  },
  buttonTextSelected: {
    color: "#fff"
  }
});

/**
 * @source https://github.com/aaronksaunders/expo-rn-firebase-image-upload/blob/master/README.md
 * @param uri
 * @param progressCallback
 */
export const uploadAsFile = async (endpoint: string, uri: string) => {
  console.log("uploadAsFile", uri);
  const response = await fetch(uri);
  const blob = await response.blob();
  var metadata = {
    contentType: "image/jpeg"
  };
  const name = `${new Date().getTime()}-upload.jpg`;
  const ref = storage.ref().child(`users/${endpoint}/${name}`);
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
            icon: "touch-app",
            type: "material",
            label: "Interface",
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
                    <Feather name={item.icon} size={36} />
                  ) : (
                    <></>
                  )}
                  {item.type === "ionicons" ? (
                    <Ionicons name={item.icon} size={36} />
                  ) : (
                    <></>
                  )}
                  {item.type === "entypo" ? (
                    <Entypo name={item.icon} size={36} />
                  ) : (
                    <></>
                  )}
                  {item.type === "material" ? (
                    <MaterialIcons name={item.icon} size={36} />
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
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Web app</Text>
      </View>
      <ScrollView style={styles.pagePadded}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Link endpoint</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => cameraParams.setEndpoint(text)}
            value={cameraParams.endpoint}
          />
        </View>
        <Text style={{ marginTop: 25, fontSize: 18 }}>
          It's a good idea to choose a long and unique endpoint that's not
          easily guessable.
        </Text>
        <Text style={{ marginTop: 25, fontSize: 18 }}>
          To use the web app, go to{" "}
          <Text style={{ fontWeight: "bold" }}>
            https://mockingbird.netlify.com/{cameraParams.endpoint}
          </Text>{" "}
          from your desktop web browser.
        </Text>
      </ScrollView>
    </View>
  );
};

const SettingsPageFlash = ({
  setActive,
  cameraParams
}: {
  setActive: React.Dispatch<string>;
  cameraParams: CameraParams;
}) => {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Flash</Text>
      </View>
      <ScrollView style={styles.pagePadded}>
        <TouchableOpacity
          style={{
            ...styles.button,
            ...styles.buttonFull,
            ...(cameraParams.flashMode === "auto" ? styles.buttonSelected : {})
          }}
          onPress={() => cameraParams.setFlashMode("auto")}
        >
          <Text
            style={{
              ...styles.buttonText,
              ...(cameraParams.flashMode === "auto"
                ? styles.buttonTextSelected
                : {})
            }}
          >
            Auto (based on lighting)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.button,
            ...styles.buttonFull,
            ...(cameraParams.flashMode === "torch" ? styles.buttonSelected : {})
          }}
          onPress={() => cameraParams.setFlashMode("torch")}
        >
          <Text
            style={{
              ...styles.buttonText,
              ...(cameraParams.flashMode === "torch"
                ? styles.buttonTextSelected
                : {})
            }}
          >
            Always on
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.button,
            ...styles.buttonFull,
            ...(cameraParams.flashMode === "on" ? styles.buttonSelected : {})
          }}
          onPress={() => cameraParams.setFlashMode("on")}
        >
          <Text
            style={{
              ...styles.buttonText,
              ...(cameraParams.flashMode === "on"
                ? styles.buttonTextSelected
                : {})
            }}
          >
            On to click photo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...styles.button,
            ...styles.buttonFull,
            ...(cameraParams.flashMode === "off" ? styles.buttonSelected : {})
          }}
          onPress={() => cameraParams.setFlashMode("off")}
        >
          <Text
            style={{
              ...styles.buttonText,
              ...(cameraParams.flashMode === "off"
                ? styles.buttonTextSelected
                : {})
            }}
          >
            Always off
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
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
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Quality</Text>
      </View>
      <ScrollView style={styles.pagePadded}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Compression</Text>
          <Slider
            style={styles.slider}
            onValueChange={value => cameraParams.setQuality(value)}
            value={cameraParams.quality}
            step={0.1}
            minimumValue={0}
            maximumValue={1}
          />
        </View>
        <Text style={{ marginTop: 25, fontSize: 18, marginBottom: 25 }}>
          "0.1" means very low quality and very high compression, and "1.0"
          means no compression and very high quality (but consumes more data)
        </Text>
        <TouchableOpacity
          style={{ ...styles.button, ...styles.buttonFull }}
          onPress={() => cameraParams.setQuality(0.25)}
        >
          <Text style={styles.buttonText}>Low quality (least data)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.button, ...styles.buttonFull }}
          onPress={() => cameraParams.setQuality(0.5)}
        >
          <Text style={styles.buttonText}>Medium quality</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.button, ...styles.buttonFull }}
          onPress={() => cameraParams.setQuality(0.9)}
        >
          <Text style={styles.buttonText}>High quality (most data)</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const SettingsPageLanguage = ({
  setActive,
  cameraParams
}: {
  setActive: React.Dispatch<string>;
  cameraParams: CameraParams;
}) => {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Interface</Text>
      </View>
      <ScrollView style={styles.pagePadded}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Keep screen on</Text>
          <View style={{ ...styles.buttons, marginTop: 0 }}>
            {["always", "camera", "never"].map(item => {
              return (
                <TouchableOpacity
                  key={`zoom_${item}`}
                  style={{
                    ...styles.button,
                    ...(cameraParams.screenOn === item
                      ? styles.buttonSelected
                      : {})
                  }}
                  onPress={() => cameraParams.setScreenOn(item)}
                >
                  <Text
                    style={{
                      ...styles.buttonText,
                      fontSize: 18,
                      textTransform: "capitalize",
                      ...(cameraParams.screenOn === item
                        ? styles.buttonTextSelected
                        : {})
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={{ ...styles.inputGroup, marginTop: 25 }}>
          <Text style={styles.label}>Language</Text>
          <Picker
            style={styles.input}
            onValueChange={text => cameraParams.setLocale(text)}
            selectedValue={cameraParams.locale}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Nederlands" value="nl" />
            <Picker.Item label="Hindi" value="hi" />
          </Picker>
        </View>
      </ScrollView>
    </View>
  );
};

const SettingsPageZoom = ({
  setActive,
  cameraParams
}: {
  setActive: React.Dispatch<string>;
  cameraParams: CameraParams;
}) => {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Zoom</Text>
      </View>
      <ScrollView style={styles.pagePadded}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Zoom</Text>
          <Slider
            style={styles.slider}
            onValueChange={value => cameraParams.setZoom(value)}
            value={cameraParams.zoom}
            step={0.1}
            minimumValue={0}
            maximumValue={1}
          />
        </View>
        <View style={styles.buttons}>
          {[0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => {
            return (
              <TouchableOpacity
                key={`zoom_${item}`}
                style={styles.button}
                onPress={() => cameraParams.setZoom(item / 10)}
              >
                <Text style={styles.buttonText}>{item * 10}%</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
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
      quality: cameraParams.quality
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
                  type == Camera.Constants.Type.back
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
