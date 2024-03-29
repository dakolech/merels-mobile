import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Content, Text, List, ListItem, Icon } from 'native-base';
import sideBarNativeBaseTheme from './sideBarNativeBase.theme';
import styles from './styles';
import { pushRoute } from '../../navigation.actions';

function SideBar(props) {
  return (
    <Container theme={sideBarNativeBaseTheme} >
      <Content>
        <List>
          <ListItem iconLeft button onPress={() => props.pushRoute({ key: 'mainMenu', index: 1 }, props.navigationKey)} >
            <Icon name="md-list-box" style={styles.icon} />
            <Text>Menu</Text>
          </ListItem>
        </List>
      </Content>
    </Container>
  );
}

SideBar.propTypes = {
  pushRoute: React.PropTypes.func,
  navigationKey: React.PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ pushRoute }, dispatch);
}

const mapStateToProps = state => ({
  navigationKey: state.getIn(['cardNavigation', 'key']),
});

export const SideBarComponent = connect(mapStateToProps, mapDispatchToProps)(SideBar);
