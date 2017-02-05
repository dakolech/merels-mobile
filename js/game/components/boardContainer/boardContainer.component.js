import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, Text } from 'react-native';
import { Container, Content } from 'native-base';
import { list } from 'react-immutable-proptypes';

import { BoardComponent } from '../board';
import { GameComponent } from '../game';
import { styles, padding } from '../board.styles';
import { NextMoveComponent } from '../nextMove';
import { PlayersComponent } from '../players';
import { resetGame } from '../../game.actions';

function BoardContainer(props) {
  return (
    <Container>
      <Content style={styles.content}>
        <View
          style={[styles.container, { height: (props.boxSize * props.board.size) + (2 * padding) }]}
        >
          <View style={styles.boardComponent}>
            <BoardComponent />
          </View>
          <View style={styles.gameComponent}>
            <GameComponent />
          </View>
        </View>
        <View style={styles.nextMove}>
          <NextMoveComponent />
        </View>
        <View style={styles.players}>
          <PlayersComponent />
        </View>
        <View>
          <Text onPress={() => props.resetGame()}> Reset Game </Text>
        </View>
      </Content>
    </Container>
  );
}

BoardContainer.propTypes = {
  board: list,
  boxSize: React.PropTypes.number,
  resetGame: React.PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ resetGame }, dispatch);
}

const mapStateToProps = state => ({
  board: state.getIn(['game', 'boardToDraw']),
  boxSize: state.getIn(['game', 'boxSize']),
});

export const BoardContainerComponent = connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
