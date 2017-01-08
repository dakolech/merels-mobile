import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { Container, Content, Text, List, ListItem, Icon } from 'native-base';
import { reset, closeDrawer } from '../../../navigation';
import sideBarNativeBaseTheme from './sideBarNativeBase.theme';
import styles from './styles';
import { navigateTo } from '../../navigation.actions';

const backgroundSideBar = require('../../../../images/backgroundSideBarDarker.gif');

class SideBar extends Component {

  static propTypes = {
    navigateTo: React.PropTypes.func,
    navigationKey: React.PropTypes.string,
    email: React.PropTypes.string,
    closeDrawer: React.PropTypes.func,
    reset: React.PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.logout = ::this.logout;
  }

  logout() {
    this.props.closeDrawer();
    this.props.reset(this.props.navigationKey);
  }

  navigateTo(route) {
    this.props.navigateTo(route, 'home');
  }

  render() {
    return (
      <Container theme={sideBarNativeBaseTheme} >
        <Content>
          <Image source={backgroundSideBar}>
            <List>
              {
              // TODO add thumbnail functionality
              // <ListItem style={styles.firstListItem} button onPress={() => this.navigateTo('user')}>
              //   <Thumbnail source={'./img/one.png'} />
              //   <Text>{this.props.email}</Text>
              // </ListItem>
              }
              <ListItem iconLeft style={styles.firstListItem} button onPress={() => this.navigateTo('user')} >
                <Icon name="ios-contact" style={styles.icon} />
                <Text>{this.props.email}</Text>
              </ListItem>
              <ListItem iconLeft button onPress={() => this.navigateTo('home')} >
                <Icon name="md-list-box" style={styles.icon} />
                <Text>Tournaments</Text>
              </ListItem>
              <ListItem iconLeft button onPress={() => this.navigateTo('newTournament')} >
                <Icon name="md-add" style={styles.icon} />
                <Text>New Tournament</Text>
              </ListItem>
              <ListItem iconLeft button onPress={() => this.navigateTo('settings')} >
                <Icon name="md-options" style={styles.icon} />
                <Text>Settings</Text>
              </ListItem>
              <ListItem iconLeft button onPress={this.logout} >
                <Icon name="md-paper-plane" style={styles.icon} />
                <Text>Logout</Text>
              </ListItem>
              {
              // TODO - blankPage component - if you want to quickly paste code and test sth
              // <ListItem iconLeft button onPress={() => this.navigateTo('blankPage')} >
              //   <Icon name="ios-plane" style={styles.icon} />
              //   <Text>Blank Page</Text>
              // </ListItem>
              }
            </List>
          </Image>
        </Content>
      </Container>
    );
  }
}

function bindAction(dispatch) {
  return {
    closeDrawer: () => dispatch(closeDrawer()),
    navigateTo: (route, homeRoute) => dispatch(navigateTo({ route, homeRoute, isSidebar: true })),
    reset: key => dispatch(reset([{ key: 'login' }], key, 0)),
  };
}

const mapStateToProps = state => ({
  email: state.getIn('auth', 'currentUser', 'email'),
  navigationKey: state.cardNavigation.key,
});

export const SideBarComponent = connect(mapStateToProps, bindAction)(SideBar);
