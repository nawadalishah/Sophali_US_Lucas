import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const SettingsSvg = props => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM3 12c0 .3 0 .6.1.9l-1.1 1c-.2.2-.3.4-.3.6 0 .3.1.4.3.6l1.4 1.4c.2.2.4.3.6.3.2 0 .4-.1.6-.3l1-1.1c.3.1.6.1.9.1.3 0 .6 0 .9-.1l1 1.1c.2.2.4.3.6.3.3 0 .4-.1.6-.3l1.4-1.4c.2-.2.3-.4.3-.6 0-.2-.1-.4-.3-.6l-1.1-1c.1-.3.1-.6.1-.9 0-.3 0-.6-.1-.9l1.1-1c.2-.2.3-.4.3-.6 0-.3-.1-.4-.3-.6l-1.4-1.4c-.2-.2-.4-.3-.6-.3-.2 0-.4.1-.6.3l-1 1.1c-.3-.1-.6-.1-.9-.1-.3 0-.6 0-.9.1l-1-1.1c-.2-.2-.4-.3-.6-.3-.3 0-.4.1-.6.3L2.2 8.4c-.2.2-.3.4-.3.6 0 .2.1.4.3.6l1.1 1c-.1.3-.1.6-.1.9z"
      stroke="#7D849A"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SettingsSvg;
