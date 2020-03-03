import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCog,
  faClosedCaptioning,
  faCamera,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';

const items = [
  {
    label: 'Live',
    icon: faVideo,
  },
  {
    label: 'Photo',
    icon: faCamera,
  },
  {
    label: 'Subtitles',
    icon: faClosedCaptioning,
  },
  {
    label: 'Settings',
    icon: faCog,
  },
];

export default ({active}: {active: string}) => {
  return (
    <View style={styles.navbar}>
      {items.map(i => (
        <TouchableHighlight style={styles.item} key={`navbarItem_${i.label}`}>
          <View style={styles.itemContainer}>
            <FontAwesomeIcon
              size={25}
              color={active === i.label ? '#347b9a' : undefined}
              icon={i.icon}
            />
            <Text
              style={
                active === i.label
                  ? {
                      ...styles.text,
                      ...styles.activeText,
                    }
                  : styles.text
              }>
              {i.label}
            </Text>
          </View>
        </TouchableHighlight>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
    paddingTop: 10,
  },
  itemContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeText: {
    fontWeight: 'bold',
    color: '#347b9a',
  },
  text: {
    marginTop: 5,
  },
});
