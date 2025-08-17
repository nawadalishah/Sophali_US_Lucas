import * as React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';
const OrdersSvg = props => (
  <Svg
    width={props.size}
    height={props.size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect
      x={5}
      y={4}
      width={14}
      height={17}
      rx={2}
      stroke={props.color}
      strokeWidth={2}
    />
    <Path
      d="M9 9H15"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M9 13H15"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M9 17H13"
      stroke={props.color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);
export default OrdersSvg;

OrdersSvg.defaultProps = {
  size: 24,
  color: '#000000',
};
