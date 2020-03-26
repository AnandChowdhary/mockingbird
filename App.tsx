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
  Slider,
  AsyncStorage
} from "react-native";
import { Ionicons, MaterialIcons, Feather, Entypo } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as WebBrowser from "expo-web-browser";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import { Analytics, Event, PageHit } from "expo-analytics";
const analytics = new Analytics("UA-106998524-1");

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
  type: string;
  setType: React.Dispatch<string>;
  i18n: LocalesType;
  setI18n: React.Dispatch<LocalesType>;
  theme: ThemesType;
  setTheme: React.Dispatch<ThemesType>;
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

const themes = {
  purple: {
    primary: "#6818e6",
    dark: "#371270",
    light: "#efe8fa"
  },
  red: {
    primary: "#f44336",
    dark: "#660a0a",
    light: "#ffebee"
  },
  blue: {
    primary: "#2196f3",
    dark: "#080d40",
    light: "#e3f2fd"
  },
  teal: {
    primary: "#009688",
    dark: "#013b31",
    light: "#e0f2f1"
  },
  green: {
    primary: "#4caf50",
    dark: "#022e06",
    light: "#e8f5e9"
  },
  brown: {
    primary: "#795548",
    dark: "#2b120d",
    light: "#efebe9"
  },
  pink: {
    primary: "#e91e63",
    dark: "#300217",
    light: "#fce4ec"
  }
};
type ThemesType = typeof themes.purple;

const track = (key: string, value: any) => {
  analytics
    .event(new Event(key, JSON.stringify(value)))
    .then(() => {})
    .catch(() => {});
};

export default function App() {
  const [active, setActive] = useState("photo");

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
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [quality, setQuality] = useState(0.5);
  const [i18n, setI18n] = useState(locales.en);
  const [theme, setTheme] = useState(themes.purple);
  useEffect(() => {
    analytics
      .event(new PageHit(active))
      .then(() => {})
      .catch(() => {});
  }, [active]);
  useEffect(() => track("flashMode", flashMode), [flashMode]);
  useEffect(() => track("autofocus", autofocus), [autofocus]);
  useEffect(() => track("zoom", zoom), [zoom]);
  useEffect(() => track("focusDepth", focusDepth), [focusDepth]);
  useEffect(() => track("endpoint", endpoint), [endpoint]);
  useEffect(() => track("locale", locale), [locale]);
  useEffect(() => track("screenOn", screenOn), [screenOn]);
  useEffect(() => track("type", type), [type]);
  useEffect(() => track("quality", quality), [quality]);
  useEffect(() => track("i18n", i18n), [i18n]);
  useEffect(() => track("theme", theme), [theme]);

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
    setScreenOn,
    type,
    setType,
    i18n,
    setI18n,
    theme,
    setTheme
  };

  let initialized = false;
  useEffect(() => {
    AsyncStorage.getItem("settings")
      .then((result: any) => {
        if (result) {
          if (result.flashMode) setFlashMode(result.flashMode);
          if (result.autofocus) setAutofocus(result.autofocus);
          if (result.zoom) setZoom(result.zoom);
          if (result.focusDepth) setFocusDepth(result.focusDepth);
          if (result.endpoint) setEndpoint(result.endpoint);
          if (result.theme) setTheme(result.theme);
          if (result.locale) {
            setLocale(result.locale);
            setI18n(locales[result.locale]);
          }
          if (result.screenOn) setScreenOn(result.screenOn);
          if (result.type) setType(result.type);
          if (result.quality) setQuality(result.quality);
        }
      })
      .catch(() => {})
      .then(() => (initialized = true));
  }, []);

  useEffect(() => {
    deactivateKeepAwake();
    if (screenOn === "always") return activateKeepAwake();
    if (
      screenOn === "camera" &&
      ["live", "photo", "subtitles"].includes("active")
    )
      return activateKeepAwake();
  }, [screenOn, active]);

  useEffect(() => {
    if (initialized)
      AsyncStorage.setItem(
        "settings",
        JSON.stringify({
          flashMode,
          autofocus,
          zoom,
          focusDepth,
          endpoint,
          locale,
          screenOn,
          type,
          quality,
          i18n,
          theme
        })
      )
        .then(() => {})
        .catch(() => {});
  }, [
    flashMode,
    autofocus,
    zoom,
    focusDepth,
    endpoint,
    locale,
    screenOn,
    type,
    quality,
    i18n,
    theme
  ]);

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: theme.primary }} />
      <SafeAreaView style={styles.parent}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          {active === "live" ? (
            <CameraPage cameraParams={cameraParams} />
          ) : (
            <></>
          )}
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
              ...(active === "live" ? { backgroundColor: theme.light } : {})
            }}
          >
            <View style={styles.navItemInner}>
              <Ionicons
                name="md-videocam"
                size={32}
                color={active === "live" ? cameraParams.theme.primary : "#777"}
              />
              <Text
                style={{
                  ...(active === "live"
                    ? { color: cameraParams.theme.primary }
                    : {})
                }}
              >
                {i18n.live.title}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActive("photo")}
            style={{
              ...styles.navItem,
              ...(active === "photo" ? { backgroundColor: theme.light } : {})
            }}
          >
            <View style={styles.navItemInner}>
              <Ionicons
                name="md-camera"
                size={32}
                color={active === "photo" ? cameraParams.theme.primary : "#777"}
              />
              <Text
                style={{
                  ...(active === "photo"
                    ? { color: cameraParams.theme.primary }
                    : {})
                }}
              >
                {i18n.photo.title}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActive("subtitles")}
            style={{
              ...styles.navItem,
              ...(active === "subtitles"
                ? { backgroundColor: theme.light }
                : {})
            }}
          >
            <View style={styles.navItemInner}>
              <MaterialIcons
                name="subtitles"
                size={32}
                color={
                  active === "subtitles" ? cameraParams.theme.primary : "#777"
                }
              />
              <Text
                style={{
                  ...(active === "subtitles"
                    ? { color: cameraParams.theme.primary }
                    : {})
                }}
              >
                {i18n.subtitles.title}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActive("settings")}
            style={{
              ...styles.navItem,
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
                ? { backgroundColor: theme.light }
                : {})
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
                    ? cameraParams.theme.primary
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
                    ? { color: cameraParams.theme.primary }
                    : {})
                }}
              >
                {i18n.settings.title}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  parent: {
    flex: 1
  },
  nav: {
    flexDirection: "row",
    borderTopColor: "#eee",
    borderTopWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  navItem: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 10
  },
  navItemInner: {
    alignItems: "center",
    justifyContent: "flex-end"
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 10,
    borderRadius: 25,
    marginHorizontal: 10,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1
  },
  cameraBtnSquare: {
    paddingHorizontal: 5
  },
  cameraBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10
  },
  cameraBtnText: {
    fontSize: 22,
    marginLeft: 5,
    color: "#000"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 15,
    paddingTop: 25,
    paddingHorizontal: 25
  },
  page: {
    width: "100%",
    height: "100%"
  },
  pagePadded: {
    padding: 25
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff"
  },
  viewBackground: {
    position: "absolute",
    width: "100%",
    height: "25%",
    zIndex: -1,
    top: 0,
    left: 0,
    right: 0
  },
  settingsLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20
  },
  settingsLink: {
    paddingVertical: 12.5,
    width: "47%",
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1
  },
  settingsLinkIcon: {
    marginBottom: 5
  },
  settingsLinkInner: {
    justifyContent: "center",
    alignItems: "center"
  },
  settingsLinkText: {
    fontSize: 26
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
    borderRadius: 5,
    backgroundColor: "#fff"
  },
  slider: {},
  buttons: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  button: {
    backgroundColor: "#fff",
    width: "30%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1
  },
  buttonFull: {
    width: "100%"
  },
  buttonHalf: {
    width: "48%"
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
  await database.ref(endpoint).update({ url });
  setTimeout(() => {
    storage
      .ref(ref.name)
      .delete()
      .then(() => {})
      .catch(() => {});
  }, 60000);
};

const SettingsPageHome = ({
  setActive,
  cameraParams
}: {
  setActive: React.Dispatch<string>;
  cameraParams: CameraParams;
}) => {
  return (
    <View style={styles.page}>
      <View
        style={{
          ...styles.header,
          backgroundColor: cameraParams.theme.primary
        }}
      >
        <Text style={styles.headerText}>
          {cameraParams.i18n.settings.title}
        </Text>
      </View>
      <View
        style={{
          ...styles.viewBackground,
          backgroundColor: cameraParams.theme.primary
        }}
      ></View>
      <ScrollView contentContainerStyle={styles.settingsLinks}>
        {[
          {
            icon: "md-lock",
            type: "ionicons",
            label: cameraParams.i18n.settings.webApp.title,
            to: "webapp"
          },
          {
            icon: "zoom-in",
            type: "feather",
            label: cameraParams.i18n.settings.zoom.title,
            to: "zoom"
          },
          {
            icon: "center-focus-strong",
            type: "material",
            label: cameraParams.i18n.settings.focus.title,
            to: "focus"
          },
          {
            icon: "flashlight",
            type: "entypo",
            label: cameraParams.i18n.settings.flash.title,
            to: "flash"
          },
          {
            icon: "subtitles",
            type: "material",
            label: cameraParams.i18n.settings.subtitles.title,
            to: "subtitles"
          },
          {
            icon: "high-quality",
            type: "material",
            label: cameraParams.i18n.settings.quality.title,
            to: "quality"
          },
          {
            icon: "touch-app",
            type: "material",
            label: cameraParams.i18n.settings.interface.title,
            to: "language"
          },
          {
            icon: "info-with-circle",
            type: "entypo",
            label: cameraParams.i18n.settings.about.title,
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
                    <Feather
                      name={item.icon}
                      size={48}
                      color={cameraParams.theme.dark}
                    />
                  ) : (
                    <></>
                  )}
                  {item.type === "ionicons" ? (
                    <Ionicons
                      name={item.icon}
                      size={48}
                      color={cameraParams.theme.dark}
                    />
                  ) : (
                    <></>
                  )}
                  {item.type === "entypo" ? (
                    <Entypo
                      name={item.icon}
                      size={48}
                      color={cameraParams.theme.dark}
                    />
                  ) : (
                    <></>
                  )}
                  {item.type === "material" ? (
                    <MaterialIcons
                      name={item.icon}
                      size={48}
                      color={cameraParams.theme.dark}
                    />
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
      <View
        style={{
          ...styles.header,
          backgroundColor: cameraParams.theme.primary
        }}
      >
        <Text style={styles.headerText}>
          {cameraParams.i18n.settings.webApp.title}
        </Text>
      </View>
      <ScrollView style={styles.pagePadded}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {cameraParams.i18n.settings.webApp.linkEndpoint}
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={text => cameraParams.setEndpoint(text)}
            value={cameraParams.endpoint}
          />
        </View>
        <Text style={{ marginTop: 25, fontSize: 18 }}>
          {cameraParams.i18n.settings.webApp.guessable}
        </Text>
        <Text style={{ marginTop: 25, fontSize: 18 }}>
          {cameraParams.i18n.settings.webApp.linkDetails.replace(
            "$LINK",
            `https://mockingbird.netlify.com/${cameraParams.endpoint}`
          )}
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
      <View
        style={{
          ...styles.header,
          backgroundColor: cameraParams.theme.primary
        }}
      >
        <Text style={styles.headerText}>
          {cameraParams.i18n.settings.flash.title}
        </Text>
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
            {cameraParams.i18n.settings.flash.auto}
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
            {cameraParams.i18n.settings.flash.torch}
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
            {cameraParams.i18n.settings.flash.on}
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
            {cameraParams.i18n.settings.flash.off}
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
  return (
    <View style={styles.page}>
      <View
        style={{
          ...styles.header,
          backgroundColor: cameraParams.theme.primary
        }}
      >
        <Text style={styles.headerText}>
          {cameraParams.i18n.settings.focus.title}
        </Text>
      </View>
      <ScrollView style={styles.pagePadded}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {cameraParams.i18n.settings.focus.autoFocus.title}
          </Text>
          <View style={{ ...styles.buttons, marginTop: 0 }}>
            {["on", "off"].map((item: "on" | "off") => {
              return (
                <TouchableOpacity
                  key={`zoom_${item}`}
                  style={{
                    ...styles.button,
                    ...styles.buttonHalf,
                    ...(cameraParams.autofocus === item
                      ? styles.buttonSelected
                      : {})
                  }}
                  onPress={() => cameraParams.setAutofocus(item)}
                >
                  <Text
                    style={{
                      ...styles.buttonText,
                      fontSize: 18,
                      textTransform: "capitalize",
                      ...(cameraParams.autofocus === item
                        ? styles.buttonTextSelected
                        : {})
                    }}
                  >
                    {cameraParams.i18n.settings.focus.autoFocus[item]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ ...styles.inputGroup, marginTop: 25 }}>
            <Text style={styles.label}>
              {cameraParams.i18n.settings.focus.focusDepth.title}
            </Text>
            <Slider
              style={styles.slider}
              onValueChange={value => cameraParams.setFocusDepth(value)}
              value={cameraParams.focusDepth}
              step={0.1}
              minimumValue={0}
              maximumValue={1}
            />
            <Text style={{ marginTop: 25, fontSize: 18, marginBottom: 25 }}>
              {cameraParams.i18n.settings.focus.focusDepth.details}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const SettingsPageSubtitles = ({
  setActive,
  cameraParams
}: {
  setActive: React.Dispatch<string>;
  cameraParams: CameraParams;
}) => {
  return (
    <View style={styles.page}>
      <View
        style={{
          ...styles.header,
          backgroundColor: cameraParams.theme.primary
        }}
      >
        <Text style={styles.headerText}>
          {cameraParams.i18n.settings.subtitles.title}
        </Text>
      </View>
      <ScrollView style={styles.pagePadded}></ScrollView>
    </View>
  );
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
      <View
        style={{
          ...styles.header,
          backgroundColor: cameraParams.theme.primary
        }}
      >
        <Text style={styles.headerText}>
          {cameraParams.i18n.settings.quality.title}
        </Text>
      </View>
      <ScrollView style={styles.pagePadded}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {cameraParams.i18n.settings.quality.compression}
          </Text>
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
          {cameraParams.i18n.settings.quality.details}
        </Text>
        <TouchableOpacity
          style={{ ...styles.button, ...styles.buttonFull }}
          onPress={() => cameraParams.setQuality(0.25)}
        >
          <Text style={styles.buttonText}>
            {cameraParams.i18n.settings.quality.low}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.button, ...styles.buttonFull }}
          onPress={() => cameraParams.setQuality(0.5)}
        >
          <Text style={styles.buttonText}>
            {cameraParams.i18n.settings.quality.medium}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.button, ...styles.buttonFull }}
          onPress={() => cameraParams.setQuality(0.9)}
        >
          <Text style={styles.buttonText}>
            {cameraParams.i18n.settings.quality.high}
          </Text>
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
      <View
        style={{
          ...styles.header,
          backgroundColor: cameraParams.theme.primary
        }}
      >
        <Text style={styles.headerText}>
          {cameraParams.i18n.settings.interface.title}
        </Text>
      </View>
      <ScrollView style={styles.pagePadded}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {cameraParams.i18n.settings.interface.screenOn}
          </Text>
          <View style={{ ...styles.buttons, marginTop: 0 }}>
            {["always", "camera", "never"].map(
              (item: "always" | "camera" | "never") => {
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
                      {cameraParams.i18n.settings.interface[item]}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </View>
        <View style={{ ...styles.inputGroup, marginTop: 25 }}>
          <Text style={styles.label}>
            {cameraParams.i18n.settings.interface.language}
          </Text>
          <Picker
            style={styles.input}
            onValueChange={(text: "en" | "nl" | "hi") => {
              cameraParams.setLocale(text);
              cameraParams.setI18n(locales[text]);
            }}
            selectedValue={cameraParams.locale}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Nederlands" value="nl" />
            <Picker.Item label="Hindi" value="hi" />
          </Picker>
        </View>
        <View style={{ ...styles.inputGroup, marginVertical: 25 }}>
          <Text style={styles.label}>
            {cameraParams.i18n.settings.interface.theme}
          </Text>
          <View style={{ ...styles.buttons, marginTop: 0 }}>
            {Object.keys(themes).map((item: string) => {
              return (
                <TouchableOpacity
                  key={`zoom_${item}`}
                  style={{
                    ...styles.button
                  }}
                  onPress={() => cameraParams.setTheme(themes[item])}
                >
                  <Text
                    style={{
                      ...styles.buttonText,
                      fontSize: 18,
                      color: themes[item].primary,
                      fontWeight: "bold",
                      textTransform: "capitalize"
                    }}
                  >
                    {cameraParams.i18n.settings.interface.themes[item]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
      <View
        style={{
          ...styles.header,
          backgroundColor: cameraParams.theme.primary
        }}
      >
        <Text style={styles.headerText}>
          {cameraParams.i18n.settings.zoom.title}
        </Text>
      </View>
      <ScrollView style={styles.pagePadded}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {cameraParams.i18n.settings.zoom.title}
          </Text>
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
    return (
      <SettingsPageHome
        cameraParams={cameraParams}
        setActive={cameraParams.setActive}
      />
    );
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
        type={cameraParams.type}
        zoom={cameraParams.zoom}
        autoFocus={cameraParams.autofocus}
        flashMode={cameraParams.flashMode}
        focusDepth={cameraParams.focusDepth}
      >
        <View style={styles.cameraItems}>
          <View style={styles.cameraNav}>
            <TouchableOpacity
              style={{ ...styles.cameraBtn, ...styles.cameraBtnSquare }}
              onPress={() => {
                cameraParams.setType(
                  cameraParams.type === "back" ||
                    cameraParams.type == Camera.Constants.Type.back
                    ? "front"
                    : "back"
                );
              }}
            >
              <View
                style={styles.cameraBtnInner}
                accessibilityLabel={cameraParams.i18n.photo.flip}
              >
                {cameraParams.type === "back" ||
                cameraParams.type == Camera.Constants.Type.back ? (
                  <MaterialIcons
                    name="camera-front"
                    size={32}
                    color={cameraParams.theme.dark}
                  />
                ) : (
                  <MaterialIcons
                    name="camera-rear"
                    size={32}
                    color={cameraParams.theme.dark}
                  />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraBtn} onPress={click}>
              <View style={styles.cameraBtnInner}>
                <MaterialIcons
                  name="camera"
                  size={32}
                  color={cameraParams.theme.dark}
                />
                <Text style={styles.cameraBtnText}>
                  {cameraParams.i18n.photo.click}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
};

const locales = {
  en: {
    live: {
      title: "Live"
    },
    photo: {
      title: "Photo",
      flip: "Flip",
      click: "Click photo"
    },
    subtitles: {
      title: "Subtitles"
    },
    settings: {
      title: "Settings",
      webApp: {
        title: "Web App",
        linkEndpoint: "Link endpoint",
        guessable:
          "It's a good idea to choose a long and unique endpoint that's not easily guessable.",
        linkDetails:
          "To use the web app, go to $LINK from your desktop web browser."
      },
      focus: {
        title: "Focus",
        autoFocus: {
          title: "Auto focus",
          on: "On",
          off: "Off"
        },
        focusDepth: {
          title: "Focus depth",
          details:
            '"0" means infinite focus and "1" means focus as close as possible.'
        }
      },
      subtitles: {
        title: "Subtitles"
      },
      quality: {
        title: "Quality",
        compression: "Compression",
        details:
          '"0.1" means very low quality and very high compression, and "1.0" means no compression and very high quality (but consumes more data)',
        low: "Low quality (least data)",
        medium: "Medium quality",
        high: "High quality (most data)"
      },
      interface: {
        title: "Interface",
        theme: "Theme",
        themes: {
          purple: "Purple",
          red: "Red",
          blue: "Blue",
          teal: "Teal",
          green: "Green",
          brown: "Brown",
          pink: "Pink"
        },
        screenOn: "Keep screen on",
        always: "Always",
        camera: "Camera",
        never: "Never",
        language: "Language"
      },
      about: {
        title: "About"
      },
      zoom: {
        title: "Zoom"
      },
      flash: {
        title: "Flash",
        auto: "Auto (based on lighting)",
        torch: "Always on",
        on: "On to click photo",
        off: "Always off"
      }
    }
  },
  hi: {
    live: {
      title: "लाइव"
    },
    photo: {
      title: "तस्वीर",
      flip: "फ्लिप",
      click: "फोटो खींचो"
    },
    subtitles: {
      title: "उपशीर्षक"
    },
    settings: {
      title: "समायोजन",
      webApp: {
        title: "वेब अप्प",
        linkEndpoint: "लिंक वेबसाइट",
        guessable:
          "एक लंबी और अनोखी वेबसाइट चुनना एक अच्छा विचार है जो आसानी से अनुमान लगाने योग्य नहीं है।",
        linkDetails:
          "वेब ऐप का उपयोग करने के लिए, अपने डेस्कटॉप वेब ब्राउज़र से $LINK पर जाएं।"
      },
      subtitles: {
        title: "उपशीर्षक"
      },
      focus: {
        title: "फोकस",
        autoFocus: {
          title: "ऑटो फोकस",
          on: "चालू",
          off: "बंद"
        },
        focusDepth: {
          title: "फोकस की गहराई",
          details:
            '"0" का अर्थ है अनंत फोकस और "1" का अर्थ है जितना संभव हो उतना करीब।'
        }
      },
      quality: {
        title: "गुणवत्ता",
        compression: "दबाव",
        details:
          '"0.1" का अर्थ है बहुत कम गुणवत्ता और बहुत उच्च संपीड़न, और "1.0" का अर्थ है कोई संपीड़न और बहुत उच्च गुणवत्ता (लेकिन अधिक डेटा का उपभोग नहीं करता है)',
        low: "कम गुणवत्ता (कम से कम डेटा)",
        medium: "मध्यम गुणवत्ता",
        high: "उच्च गुणवत्ता (सबसे अधिक डेटा)"
      },
      interface: {
        title: "इंटरफेस",
        theme: "विषय",
        themes: {
          purple: "बैंगनी",
          red: "लाल",
          blue: "नीला",
          teal: "टील",
          green: "हरा",
          brown: "भूरा",
          pink: "गुलाबी"
        },
        screenOn: "स्क्रीन को चालू रखें",
        always: "हमेशा",
        camera: "कैमरा",
        never: "कभी नहीँ",
        language: "भाषा"
      },
      about: {
        title: "ऐप के बारे में"
      },
      zoom: {
        title: "ज़ूम"
      },
      flash: {
        title: "चमक",
        auto: "स्वचालित (प्रकाश पर आधारित)",
        torch: "हमेशा बने रहें",
        on: "फोटो क्लिक करने के लिए",
        off: "हमेशा बंद रहें"
      }
    }
  },
  nl: {
    live: {
      title: "Live"
    },
    photo: {
      title: "Foto",
      flip: "Draai",
      click: "Maak foto"
    },
    subtitles: {
      title: "Ondertiteling"
    },
    settings: {
      title: "Instellingen",
      webApp: {
        title: "Web App",
        linkEndpoint: "Link endpoint",
        guessable:
          "Het is het beste om een lange en unieke endpoint te kiezen die niet makkelijk te raden is.",
        linkDetails:
          "Om de app te gebruiken, ga naar $LINK van je desktop web browser."
      },
      focus: {
        title: "Focus",
        autoFocus: {
          title: "Auto focus",
          on: "aan",
          off: "uit"
        },
        focusDepth: {
          title: "Focus diepte",
          details:
            '"0" betekent oneindige focus en "1" betekent focus zo dichtbij mogelijk.'
        }
      },
      subtitles: {
        title: "Ondertiteling"
      },
      quality: {
        title: "Kwaliteit",
        compression: "Compressie",
        details:
          '"0.1" betektn lage kwaliteit met veel compressie en "1.0" betekent geen compressie met hoge kwaliteit (maar dit gebruikt meer data) ',
        low: "Lage kwaliteit (minste data)",
        medium: "Medium kwaliteit",
        high: "Hoge kwaliteit (meeste data)"
      },
      interface: {
        title: "Interface",
        theme: "Thema",
        themes: {
          purple: "Purper",
          red: "Rood",
          blue: "Blauw",
          teal: "Groenblauw",
          green: "Groen",
          brown: "Bruin",
          pink: "Roze"
        },
        screenOn: "Houd scherm aan",
        always: "Altijd",
        camera: "Camera",
        never: "Nooit",
        language: "Taal"
      },
      about: {
        title: "Over"
      },
      zoom: {
        title: "Zoom"
      },
      flash: {
        title: "Flits",
        auto: "Auto (afhankelijk van lichtsituatie)",
        torch: "Altijd aan",
        on: "Aan bij het nemen van een foto",
        off: "Altijd uit"
      }
    }
  }
};

type LocalesType = typeof locales.en;
