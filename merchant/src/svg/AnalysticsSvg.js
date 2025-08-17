import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const AnalyticsSvg = ({
  width = 24,
  height = 50,
  color = 'white',
  ...props
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 512 512"
    fill="none"
    {...props}>
    <Path
      d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zm96 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32zm32 64H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 96H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32z"
      fill={color}
    />
  </Svg>
);

export default AnalyticsSvg;
