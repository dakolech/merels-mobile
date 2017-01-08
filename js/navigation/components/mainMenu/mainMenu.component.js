import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Content, Text, List, ListItem, Icon } from 'native-base';
import { pushRoute } from '../../navigation.actions';

function MainMenu(props) {
  return (
    <Container>
      <Content>
        <List>
          <ListItem iconLeft button onPress={() => props.pushRoute({ key: 'newGame', index: 1 }, props.navigationKey)} >
            <Icon name="md-list-box" />
            <Text>New Game</Text>
          </ListItem>
        </List>
      </Content>
    </Container>
  );
}

MainMenu.propTypes = {
  pushRoute: React.PropTypes.func,
  navigationKey: React.PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ pushRoute }, dispatch);
}

const mapStateToProps = state => ({
  navigationKey: state.getIn(['cardNavigation', 'key']),
});

export const MainMenuComponent = connect(mapStateToProps, mapDispatchToProps)(MainMenu);
