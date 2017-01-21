import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text } from 'react-native';
import { list } from 'react-immutable-proptypes';

import { styles } from '../board.styles';
import { nextMove } from '../../game.actions';
import { PawnComponent } from './pawn.component';

function Game(props) {
  return (
    <View style={styles.row}>
      {props.board.map((column, columnIndex) => (
        <View key={columnIndex}>
          {column.map((box, boxIndex) => (
            <View
              key={boxIndex}
              style={{ width: props.boxSize, height: props.boxSize }}
            >
              {box.get('isPawnBox') &&
                (<Text
                  style={[styles.touchable, { width: props.boxSize, height: props.boxSize }]}
                  onPress={() => props.nextMove({ column: columnIndex, row: boxIndex })}
                >
                  a
                </Text>
              )}
              <PawnComponent key={boxIndex + 1} boxSize={props.boxSize} box={box} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

Game.propTypes = {
  board: list,
  nextMove: React.PropTypes.func,
  boxSize: React.PropTypes.number,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ nextMove }, dispatch);
}

const mapStateToProps = state => ({
  board: state.getIn(['game', 'board']),
  boxSize: state.getIn(['game', 'boxSize']),
});

export const GameComponent = connect(mapStateToProps, mapDispatchToProps)(Game);
