// const React = require('react-native');

// const { StyleSheet } = React;

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  boardIcon: {
    position: 'absolute',
    zIndex: 0,
    left: 0,
    top: 0,
  },
  pawnIcon: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 0,
  },
  row: {
    flexDirection: 'row',
    height: 100,
    padding: 20,
  },
});
