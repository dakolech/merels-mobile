import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Header, Title, Button, Icon } from 'native-base';
import { popRoute, openDrawer, reset } from '../../../navigation';
import styles from './styles';

class HeaderCom extends Component {

  static propTypes = {
    openDrawer: React.PropTypes.func,
    popRoute: React.PropTypes.func,
    navigationKey: React.PropTypes.string,
    title: React.PropTypes.string,
    main: React.PropTypes.string,
    reset: React.PropTypes.func,
    logout: React.PropTypes.func,
  }

  popRoute() {
    this.props.popRoute(this.props.navigationKey);
  }

  logout() {
    this.props.reset(this.props.navigationKey);
  }

  render() {
    const isMain = !!this.props.main;
    const iconName = isMain ? 'power' : 'arrow-back';
    const button = (
      <Button transparent onPress={() => isMain ? this.logout() : this.popRoute()}>
        <Icon name={`ios-${iconName}`} style={styles.iconArrow} />
      </Button>
    );
    return (
      // TODO add shadow to header
      <Header style={styles.header}>
        {button}
        <Title style={[styles.title, styles.shadowTextBrownBig]}>{this.props.title || 'Merels'}</Title>
        <Button transparent onPress={this.props.openDrawer}>
          <Icon name="md-menu" style={styles.iconMenu} />
        </Button>
      </Header>
    );
  }
}

function bindAction(dispatch) {
  return {
    openDrawer: () => dispatch(openDrawer()),
    popRoute: key => dispatch(popRoute(key)),
    reset: key => dispatch(reset([{ key: 'login' }], key, 0)),
  };
}

const mapStateToProps = state => ({
  navigationKey: state.getIn(['cardNavigation', 'key']),
});


export const HeaderComponent = connect(mapStateToProps, bindAction)(HeaderCom);
