import React from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { styles, boxSize } from './board.styles';
import { PLAYER1, PLAYER2 } from '../../game.reducer';

function Pawn(props) {
  return props.box.get('pawn') ?
    <FontAwesomeIcon name="circle" size={boxSize} color={props[props.box.get('pawn')]} style={styles.pawnIcon} /> :
    null;
}

Pawn.propTypes = {
  box: map,
  [PLAYER1]: React.PropTypes.string,
  [PLAYER2]: React.PropTypes.string,
};

const mapStateToProps = state => ({
  [PLAYER1]: state.getIn(['game', PLAYER1, 'color']),
  [PLAYER2]: state.getIn(['game', PLAYER2, 'color']),
});

export const PawnComponent = connect(mapStateToProps)(Pawn);
