import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const BellSvg = props => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M12 2C13.1046 2 14 2.89543 14 4V4.84297C15.1435 5.18509 16 6.20356 16 7.5V14L20 17V18H4V17L8 14V7.5C8 6.20356 8.85648 5.18509 10 4.84297V4C10 2.89543 10.8954 2 12 2ZM6 18V19C6 19.5523 6.44771 20 7 20H17C17.5523 20 18 19.5523 18 19V18H6Z"
      stroke={props.color || '#7D849A'}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default BellSvg;
