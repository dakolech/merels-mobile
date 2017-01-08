import { findNodeHandle } from 'react-native';
import TextInputState from 'react-native/lib/TextInputState';


export function focusTextInput(node) {
  TextInputState.focusTextInput(findNodeHandle(node));
}
