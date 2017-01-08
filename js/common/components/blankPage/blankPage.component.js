import React from 'react';
import { connect } from 'react-redux';
import { Container, Content, Text } from 'native-base';
import { HeaderComponent } from '../header';

import styles from './styles';

function BlankPage() {
  return (
    <Container style={styles.container}>
      <Content>
        <HeaderComponent />
        <Text>
          Create Something Awesome . . .
        </Text>
      </Content>
    </Container>
  );
}

BlankPage.propTypes = {
};

function bindAction() {
  return {
  };
}

const mapStateToProps = () => ({
});


export const BlankPageComponent = connect(mapStateToProps, bindAction)(BlankPage);
