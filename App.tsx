import React from 'react';
import {SafeAreaView, StyleSheet, Text, StatusBar} from 'react-native';
import Camera from './components/Camera';

declare var global: {HermesInternal: null | {}};

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Camera />
        <Text>Hello</Text>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
