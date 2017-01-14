// const React = require('react-native');

// const { StyleSheet } = React;

import { StyleSheet } from 'react-native';

export const boxSize = 20;
export const padding = 20;

export const styles = StyleSheet.create({
  boardIcon: {
    position: 'absolute',
    zIndex: 0,
    left: 0,
    top: 0,
  },
  pawnIcon: {
    position: 'absolute',
    zIndex: 3,
    left: 0,
    top: 0,
  },
  touchable: {
    color: 'rgba(0,0,0,0)',
    position: 'absolute',
    zIndex: 2,
    left: 0,
    top: 0,
    width: boxSize,
    height: boxSize,
  },
  row: {
    flexDirection: 'row',
    padding,
  },
  boardComponent: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameComponent: {
    position: 'absolute',
    zIndex: 2,
    left: 0,
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
});
