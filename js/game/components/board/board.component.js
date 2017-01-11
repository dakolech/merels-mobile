import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { list } from 'react-immutable-proptypes';

import { HeaderComponent } from '../../../common';
import { styles, boxSize } from './board.styles';
import { nextMove } from '../../game.actions';
import { PawnComponent } from './pawn.component';
import { BoxComponent } from './box.component';

function Board(props) {
  return (
    <Container>
      <Content>
        <HeaderComponent />
        <View style={styles.row}>
          {props.board.map((row, rowIndex) => (
            <View key={rowIndex}>
              {row.map((box, boxIndex) => (
                <View
                  key={boxIndex}
                  style={{ width: boxSize, height: boxSize }}
                >
                  {box.get('isPawnBox') &&
                    (<Text
                      style={styles.touchable}
                      onPress={() => props.nextMove({ row: rowIndex, column: boxIndex })}
                    >
                      a
                    </Text>
                  )}
                  <BoxComponent key={boxIndex} box={box} />
                  <PawnComponent key={boxIndex + 1} box={box} />
                </View>
              ))}
            </View>
          ))}
        </View>
      </Content>
    </Container>
  );
}

Board.propTypes = {
  board: list,
  nextMove: React.PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ nextMove }, dispatch);
}

const mapStateToProps = state => ({
  board: state.getIn(['game', 'board']),
});

export const BoardComponent = connect(mapStateToProps, mapDispatchToProps)(Board);
