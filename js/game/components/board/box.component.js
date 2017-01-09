import React from 'react';
import { View } from 'react-native';
import { map } from 'react-immutable-proptypes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { styles, boxSize } from './board.styles';
import fontelloConfig from '../../../../icons/generated-font/config.json';

const Icon = createIconSetFromFontello(fontelloConfig);

function getIconName(box) {
  return ['W', 'E', 'N', 'S'].reduce((acc, curr) =>
    box.get(curr) ? acc + curr.toLowerCase() : acc
  , '');
}

function Box({ box }) {
  return getIconName(box) ?
    <Icon
      name={getIconName(box)}
      size={boxSize}
      color="#900"
      style={styles.boardIcon}
    /> :
    <View style={{ width: boxSize, height: boxSize }} />;
}

Box.propTypes = {
  box: map,
};

export const BoxComponent = Box;
