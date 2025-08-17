import * as React from 'react';
import Svg, { Rect } from 'react-native-svg';

const MenuSvg = ({ color = 'black', width = 24, height = 24, ...props }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...props}>
    <Rect x="2" y="5" width="20" height="2" fill={color} />
    <Rect x="2" y="11" width="20" height="2" fill={color} />
    <Rect x="2" y="17" width="20" height="2" fill={color} />
  </Svg>
);

export default MenuSvg;
