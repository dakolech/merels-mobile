import React from 'react';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View, TouchableHighlight } from 'react-native';
import { Container, Content } from 'native-base';
import { list } from 'react-immutable-proptypes';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import fontelloConfig from '../../../icons/generated-font/config.json';
import { pushRoute } from '../../navigation';
import { HeaderComponent } from '../../common';
import { styles } from './board.styles';
import { setPawn } from '../game.actions';


const boxSize = 20;

const Icon = createIconSetFromFontello(fontelloConfig);

function getIconName(box) {
  return ['W', 'E', 'N', 'S'].reduce((acc, curr) =>
    box.get(curr) ? acc + curr.toLowerCase() : acc
  , '');
}

function renderBox(box, boxIndex, rowIndex) {
  const iconName = getIconName(box);
  return !!iconName ?
    <Icon
      key={boxIndex}
      name={getIconName(box)}
      size={boxSize}
      color="#900"
      style={styles.boardIcon}
    /> :
    <View key={boxIndex} style={{ width: boxSize, height: boxSize }} />;
}

function renderPawn(box, boxIndex) {
  return box.get('pawn') ?
    <FontAwesomeIcon key={boxIndex} name="circle" size={boxSize} color="#000" style={styles.pawnIcon} /> :
    undefined;
}

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
                  {box.get('isPawnBox') ?
                    (<TouchableHighlight
                      onPress={() => props.setPawn({ pawn: 'black', row: rowIndex, column: boxIndex })}
                    >
                      {renderBox(box, boxIndex, rowIndex)}
                    </TouchableHighlight>) :
                    renderBox(box, boxIndex, rowIndex)
                  }
                  {renderPawn(box, boxIndex + 1)}
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
  pushRoute: React.PropTypes.func,
  navigationKey: React.PropTypes.string,
  board: list,
  setPawn: React.PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ pushRoute, setPawn }, dispatch);
}

const mapStateToProps = state => ({
  navigationKey: state.getIn(['cardNavigation', 'key']),
  board: state.getIn(['game', 'board']),
});

export const BoardComponent = connect(mapStateToProps, mapDispatchToProps)(Board);
