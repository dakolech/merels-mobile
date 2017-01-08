import { Platform } from 'react-native';

export default {

  // Icon
  iconFamily: 'Ionicons',
  iconFontSize: (Platform.OS === 'ios') ? 30 : 28,
  iconMargin: 7,

  // List
  listBorderColor: '#ddd',
  listDividerBg: '#ddd',
  listItemHeight: 45,
  listItemPadding: 20,
  listNoteColor: '#808080',
  listNoteSize: 13,

  // Text
  textColor: '#fff',
  inverseTextColor: '#fff',

  // Other
  borderRadiusBase: (Platform.OS === 'ios') ? 5 : 2,
  borderWidth: 1,
  contentPadding: 10,
};
