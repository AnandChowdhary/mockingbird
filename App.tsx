import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  View,
  TouchableHighlight,
} from 'react-native';
import Camera from './components/Camera';

declare var global: {HermesInternal: null | {}};

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Mockingbird</Text>
          </View>
          <View style={styles.camera}>
            <Camera />
          </View>
          <View style={styles.navbar}>
            <TouchableHighlight style={styles.item}>
              <Text style={styles.activeText}>Live</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.item}>
              <Text>Photo</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.item}>
              <Text>Subtitles</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.item}>
              <Text>Settings</Text>
            </TouchableHighlight>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
    height: '100%',
  },
  camera: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    padding: 15,
  },
  navbar: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
  },
  activeText: {
    fontWeight: 'bold',
  },
});

export default App;
