import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { list } from 'react-immutable-proptypes';

import { styles } from '../board.styles';
import { BoxComponent } from './box.component';

function Board(props) {
  return (
    <View style={styles.row}>
      {props.board.map((column, columnIndex) => (
        <View key={columnIndex}>
          {column.map((box, boxIndex) => (
            <View
              key={boxIndex}
              style={{ width: props.boxSize, height: props.boxSize }}
            >
              <BoxComponent key={boxIndex} box={box} boxSize={props.boxSize} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

Board.propTypes = {
  board: list,
  boxSize: React.PropTypes.number,
};

const mapStateToProps = state => ({
  board: state.getIn(['game', 'boardToDraw']),
  boxSize: state.getIn(['game', 'boxSize']),
});

export const BoardComponent = connect(mapStateToProps)(Board);
