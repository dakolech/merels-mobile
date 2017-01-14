import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Text } from 'react-native';

import { styles } from '../board.styles';

function NextMove(props) {
  return (
    <Text> {props.nextMove} </Text>
  );
}

NextMove.propTypes = {
  nextMove: React.PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ }, dispatch);
}

const mapStateToProps = state => ({
  nextMove: state.getIn(['game', 'nextMove']),
});

export const NextMoveComponent = connect(mapStateToProps, mapDispatchToProps)(NextMove);
