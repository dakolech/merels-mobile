// Base colors
export const green = '#239b87';
export const greenLighter = '#56ceba';
export const greenSharp = '#239b4b';
export const white = '#fff';
export const grey = '#5f5a5a';
export const greyLighter = '#c5c0c0';
export const blue = '#23879b';
export const whiteBackground = '#fbfafa';
export const gold = '#d7c04d';
export const brown = '#9b4b23';
export const red = '#db5f5d';

export const backgroundTableItem = '#f6f3f3';

// MIXINS

export const buttonDisabled = {
  backgroundColor: greyLighter,
};

export const content = {
  marginLeft: 5,
  marginRight: 5,
  paddingBottom: 40,
};

export const card = {
  marginTop: 5,
  marginBottom: 5,
};

export const cardWithError = Object.assign({
  borderLeftColor: red,
  borderLeftWidth: 5,
}, card);

export const container = {
  backgroundColor: whiteBackground,
};

// Shadows
export const shadowTextBrownBig = {
  textShadowColor: brown,
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 2,
};

export const shadowTextBrown = {
  textShadowColor: brown,
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
};

export const shadowTextGreyLight = {
  textShadowColor: greyLighter,
  textShadowOffset: { width: 0.5, height: 0.5 },
  textShadowRadius: 1,
};

export const shadowTextLightGrey = {
  textShadowColor: grey,
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 1,
};
