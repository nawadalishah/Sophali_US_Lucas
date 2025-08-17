import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const EyeOnSvg = props => (
  <Svg
    fill="#000000"
    width="16px"
    height="16px"
    viewBox="0 0 24 24"
    id="eye"
    data-name="Line Color"
    xmlns="http://www.w3.org/2000/svg"
    className="icon line-color"
    {...props}>
    <Path
      id="secondary"
      d="M19,12s-3.13,4-7,4-7-4-7-4,3.13-4,7-4S19,12,19,12Zm-7-2a2,2,0,1,0,2,2A2,2,0,0,0,12,10Z"
      style={{
        fill: 'none',
        stroke: 'rgb(44, 169, 188)',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
    <Path
      id="primary"
      d="M3,7V4A1,1,0,0,1,4,3H7"
      style={{
        fill: 'none',
        stroke: 'rgb(0, 0, 0)',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
    <Path
      id="primary-2"
      data-name="primary"
      d="M21,7V4a1,1,0,0,0-1-1H17"
      style={{
        fill: 'none',
        stroke: 'rgb(0, 0, 0)',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
    <Path
      id="primary-3"
      data-name="primary"
      d="M3,17v3a1,1,0,0,0,1,1H7"
      style={{
        fill: 'none',
        stroke: 'rgb(0, 0, 0)',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
    <Path
      id="primary-4"
      data-name="primary"
      d="M21,17v3a1,1,0,0,1-1,1H17"
      style={{
        fill: 'none',
        stroke: 'rgb(0, 0, 0)',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
      }}
    />
  </Svg>
);
export default EyeOnSvg;
