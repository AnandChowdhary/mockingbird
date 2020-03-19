import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCamera} from '@fortawesome/free-solid-svg-icons';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

/**
 * Converts a base64 image to Blob
 * @source https://github.com/react-native-community/react-native-image-picker/issues/510#issuecomment-382359022
 * @param url - Base 64 encoded image
 */
function urlToBlob(url: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onerror = reject;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response);
      }
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
}

/**
 * This is the public web API key (you can see this)
 * This is NOT the Firebase admin API key
 */
const WEB_API_KEY = 'AIzaSyCSo4PAiC-cr1euluE4XybGZntQve3rc78';

try {
  firebase.initializeApp({
    apiKey: WEB_API_KEY,
    authDomain: 'frankenstein-ce9dd.firebaseapp.com',
    databaseURL: 'https://frankenstein-ce9dd.firebaseio.com',
    projectId: 'frankenstein-ce9dd',
    storageBucket: 'frankenstein-ce9dd.appspot.com',
    messagingSenderId: '168976872219',
    appId: '1:168976872219:web:bd6ef874bb4a27feb419be',
  });
} catch (error) {}

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
    const data = await camera.takePictureAsync({
      quality: 0.5,
      base64: true,
      width: 300,
    });
    if (!data.base64) return;
    const blob = await urlToBlob(data.uri);
    const ref = (
      await firebase
        .storage()
        .ref(new Date().toISOString() + '.jpg')
        .put(blob, {contentType: 'image/jpeg'})
    ).ref;
    const url = await ref.getDownloadURL();
    if (!url) return console.log('No download URL');
    await firebase
      .database()
      .ref()
      .update({image: url});
  };
  return (
    <View style={styles.container}>
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
            <View style={styles.insideContainer}>
              <TouchableOpacity
                onPress={() => takePicture(camera)}
                style={styles.capture}>
                <View style={styles.captureBtn}>
                  <FontAwesomeIcon size={25} icon={faCamera} />
                  <Text style={styles.captureText}>Click photo</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  insideContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  captureBtn: {
    display: 'flex',
    flexDirection: 'row',
  },
  captureText: {
    marginLeft: 15,
    fontSize: 20,
  },
});
