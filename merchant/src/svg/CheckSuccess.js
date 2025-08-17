import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function CheckSuccess(props) {
  return (
    <Svg
      width={96}
      height={96}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48 96a48 48 0 0040.053-74.459l-38.16 42.4a10.667 10.667 0 01-14.33 1.398l-17.43-13.072a5.334 5.334 0 016.4-8.534l17.43 13.072L81.14 13.28A48 48 0 1048 96z"
        fill="#00834A"
      />
    </Svg>
  );
}

export default CheckSuccess;
