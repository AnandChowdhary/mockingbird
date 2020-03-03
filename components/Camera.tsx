import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text>Waiting</Text>
  </View>
);

export default () => {
  const takePicture = async (camera: RNCamera) => {
    const options = {quality: 0.5, base64: true};
    const data = await camera.takePictureAsync(options);
    //  eslint-disable-next-line
    console.log(data.uri);
  };
  return (
    <>
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        {({camera, status, recordAudioPermissionStatus}) => {
          if (status !== 'READY') return <PendingView />;
          return (
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => takePicture(camera)}
                style={styles.capture}>
                <Text style={{fontSize: 14}}> SNAP </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    //   flex: 1,
    //   flexDirection: 'column',
    //   backgroundColor: 'black',
  },
  preview: {
    //   flex: 1,
    //   justifyContent: 'flex-end',
    //   alignItems: 'center',
  },
  capture: {
    //   flex: 0,
    //   backgroundColor: '#fff',
    //   borderRadius: 5,
    //   padding: 15,
    //   paddingHorizontal: 20,
    //   alignSelf: 'center',
    //   margin: 20,
  },
});
