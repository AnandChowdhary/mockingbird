import React from 'react';
import {SafeAreaView, StyleSheet, Text, StatusBar, View} from 'react-native';
import Navbar from './components/Navbar';
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
          <Navbar active="Photo" />
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
});

export default App;
