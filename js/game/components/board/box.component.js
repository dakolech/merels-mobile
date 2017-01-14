import React from 'react';
import { View } from 'react-native';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { styles } from '../board.styles';
import fontelloConfig from '../../../../icons/generated-font-thicker/config.json';

const Icon = createIconSetFromFontello(fontelloConfig);

function Box({ box, boxSize }) {
  return box ?
    <Icon
      name={box}
      size={boxSize}
      color="#900"
      style={styles.boardIcon}
    /> :
    <View style={{ width: boxSize, height: boxSize }} />;
}

Box.propTypes = {
  box: React.PropTypes.string,
};

export const BoxComponent = Box;
