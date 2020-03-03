import React from 'react';
import {SafeAreaView, StyleSheet, Text, StatusBar} from 'react-native';

declare var global: {HermesInternal: null | {}};

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Text>Hello</Text>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
