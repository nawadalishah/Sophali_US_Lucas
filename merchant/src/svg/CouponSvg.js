import * as React from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';

const CouponSvg = ({ color }) => (
  <Svg width={50} height={50} xmlns="http://www.w3.org/2000/svg">
    <Circle
      cx={25}
      cy={25}
      r={22.5}
      stroke="#FFFFFF"
      strokeWidth={1.5}
      fill="transparent"
    />
    <G transform="translate(13 13)">
      <Path
        d="M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z"
        fill={color}
      />
    </G>
  </Svg>
);

export default CouponSvg;
