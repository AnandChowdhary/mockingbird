import React from 'react';
import {SafeAreaView, StyleSheet, Text, StatusBar, View} from 'react-native';
import Camera from './components/Camera';

declare var global: {HermesInternal: null | {}};

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.container}>
          <Text>Cam:</Text>
          <Camera />
          <Text>Hello</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
  },
});

export default App;
