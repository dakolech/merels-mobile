import React from 'react';
import { Text } from 'react-native';

import styles from './title.styles';

function Title(props) {
  return (
    <Text style={[styles.title, props.style]}>{props.title}</Text>
  );
}

Title.propTypes = {
  title: React.PropTypes.string,
  style: React.PropTypes.oneOf(React.PropTypes.number, React.PropTypes.shape({
    fontWeight: React.PropTypes.string,
    color: React.PropTypes.string,
    fontSize: React.PropTypes.number,
    textAlign: React.PropTypes.string,
  })),
};

export const TitleComponent = Title;
