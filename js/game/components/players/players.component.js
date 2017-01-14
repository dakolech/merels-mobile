import React from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import { bindActionCreators } from 'redux';
import { View, Text } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { styles } from './players.styles';
import { PLAYER1, PLAYER2 } from '../../game.reducer';

function Players({ [PLAYER1]: player1, [PLAYER2]: player2 }) {
  return (
    <View style={styles.container}>
      <View>
        <Text> {player1.get('name')} </Text>
        <View>
          <FontAwesomeIcon
            name="circle"
            size={30}
            color={player1.get('color')}
          />
        </View>
        <Text> Pawns in hand: {player1.get('pawnsInHand')} </Text>
      </View>
      <View>
        <Text> {player2.get('name')} </Text>
        <View>
          <FontAwesomeIcon
            name="circle"
            size={30}
            color={player2.get('color')}
          />
        </View>
        <Text> Pawns in hand: {player2.get('pawnsInHand')} </Text>
      </View>
    </View>
  );
}

Players.propTypes = {
  [PLAYER1]: map,
  [PLAYER2]: map,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ }, dispatch);
}

const mapStateToProps = state => ({
  [PLAYER1]: state.getIn(['game', PLAYER1]),
  [PLAYER2]: state.getIn(['game', PLAYER2]),
});

export const PlayersComponent = connect(mapStateToProps, mapDispatchToProps)(Players);
