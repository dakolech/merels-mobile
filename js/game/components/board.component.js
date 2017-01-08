import React from 'react';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';
import { Container, Content, Text, List, ListItem } from 'native-base';
import { list } from 'react-immutable-proptypes';
import fontelloConfig from '../../../icons/generated-font/config.json';
import { pushRoute } from '../../navigation';
import { HeaderComponent } from '../../common';

const Icon = createIconSetFromFontello(fontelloConfig);

function getIconName(box) {
  return ['W', 'E', 'N', 'S'].reduce((acc, curr) =>
    box.get(curr) ? acc + curr.toLowerCase() : acc
  , '');
}

function renderBox(box, boxIndex) {
  const iconName = getIconName(box);
  if (!!iconName) {
    return <Icon key={boxIndex} name={getIconName(box)} size={20} color="#900" />;
  } else {
    return <View style={{ width: 20, height: 20 }} />;
  }
}

// <Icon key={boxIndex} name={getIconName(box)} size={30} color="#900" />
// <Text> {getIconName(box)} </Text>

function Board(props) {
  return (
    <Container>
      <Content>
        <HeaderComponent />
        <View style={{ flexDirection: 'row', height: 100, padding: 20 }}>
          {props.board.map((row, rowIndex) => (
            <View key={rowIndex}>
              {row.map((box, boxIndex) => (
                renderBox(box, boxIndex)
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
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ pushRoute }, dispatch);
}

const mapStateToProps = state => ({
  navigationKey: state.getIn(['cardNavigation', 'key']),
  board: state.getIn(['game', 'board']),
});

export const BoardComponent = connect(mapStateToProps, mapDispatchToProps)(Board);
