import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';
import { Container, Content } from 'native-base';
import { list } from 'react-immutable-proptypes';

import { nextMove } from '../../game.actions';
import { BoardComponent } from '../board';
import { GameComponent } from '../game';
import { styles } from '../board.styles';

function BoardContainer(props) {
  return (
    <Container>
      <Content>
        <View style={styles.container}>
          <View style={styles.boardComponent}>
            <BoardComponent />
          </View>
          <View style={styles.gameComponent}>
            <GameComponent />
          </View>
        </View>
      </Content>
    </Container>
  );
}

BoardContainer.propTypes = {
  board: list,
  nextMove: React.PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ nextMove }, dispatch);
}

const mapStateToProps = state => ({
  board: state.getIn(['game', 'board']),
});

export const BoardContainerComponent = connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
