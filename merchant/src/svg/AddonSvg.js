import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';
const AddonSvg = props => (
  <Svg
    fill={props.color}
    width={props.size}
    height={props.size}
    id="Icons"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 32 32"
    xmlSpace="preserve"
    {...props}>
    <G>
      <Path d="M16,11c-4.5,0-8-2.2-8-5s3.5-5,8-5s8,2.2,8,5S20.5,11,16,11z" />
    </G>
    <Path d="M16,13c-3.3,0-6.2-1-8-2.7V11c0,2.8,3.5,5,8,5s8-2.2,8-5v-0.7C22.2,12,19.3,13,16,13z" />
    <Path d="M30.9,11.7C30.9,11.6,30.9,11.6,30.9,11.7c-0.1-0.2-0.1-0.3-0.2-0.3c0,0,0,0,0,0c0,0-0.1-0.1-0.1-0.1L26,8.2V11 c0,4-4.3,7-10,7S6,15,6,11V8.2l-4.5,2.9c-0.1,0-0.1,0.1-0.1,0.1c0,0,0,0,0,0c-0.1,0.1-0.1,0.2-0.2,0.3c0,0,0,0,0,0.1 C1,11.8,1,11.9,1,12v9c0,0.3,0.2,0.7,0.5,0.8l14,9c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0c0.1,0,0.2,0.1,0.3,0.1s0.2,0,0.3-0.1 c0,0,0.1,0,0.1,0c0,0,0.1,0,0.1,0l14-9c0.3-0.2,0.5-0.5,0.5-0.8v-9C31,11.9,31,11.8,30.9,11.7z" />
  </Svg>
);
export default AddonSvg;

AddonSvg.defaultProps = {
  size: 24,
  color: '#000000',
};
