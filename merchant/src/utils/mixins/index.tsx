import { Dimensions, PixelRatio, Platform } from 'react-native';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
const guidelineBaseWidth = 375;
export const scaleSize = (size: number) =>
  (WINDOW_WIDTH / guidelineBaseWidth) * size;
export const scaleSizeHeight = (size: number) =>
  (WINDOW_HEIGHT / guidelineBaseWidth) * size;

export const scaleFont = (size: number) =>
  Platform.OS === 'ios'
    ? size * PixelRatio.getFontScale()
    : size / PixelRatio.getFontScale();

type CSSProperty = 'margin' | 'padding';

interface Styles {
  [key: string]: number;
}

function dimensions(
  top = 0,
  right = top,
  bottom = top,
  left = right,
  property: CSSProperty = 'margin',
): Styles {
  const styles: Styles = {};

  styles[`${property}Top`] = top;
  styles[`${property}Right`] = right;
  styles[`${property}Bottom`] = bottom;
  styles[`${property}Left`] = left;

  return styles;
}

export function margin(top = 0, right = 0, bottom = 0, left = 0) {
  return dimensions(top, right, bottom, left, 'margin');
}

export function padding(top = 0, right = 0, bottom = 0, left = 0) {
  return dimensions(top, right, bottom, left, 'padding');
}

export function boxShadow(
  color = '',
  offset = { height: 2, width: 2 },
  radius = 8,
  opacity = 0.2,
) {
  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation: radius,
  };
}
