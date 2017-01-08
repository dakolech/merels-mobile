
import React from 'react';
import { Image } from 'react-native';

const launchscreen = require('../../../../images/shadow.png');

export function SplashPageComponent() {
  return (
    <Image source={launchscreen} style={{ flex: 1, height: null, width: null }} />
  );
}
