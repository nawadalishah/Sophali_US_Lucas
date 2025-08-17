import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const ToolsSvg = ({ color }) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17h-2v-2h2v2zm3.07-7.34l-1.41 1.41-1.37-1.37c-.36.4-.8.72-1.29.9V14h2v2h-2v1h-2v-1H8v-2h2v-.82c-.53-.15-.99-.33-1.4-.62l1.4-1.4l-1.41-1.41L7.6 9.6c-.28-.41-.47-.86-.62-1.4H6v2H4v-2H3v-2h1v-2h2v2h.82c.15-.53.33-.99.62-1.4l-1.4-1.4l1.41-1.41l1.37 1.37c.36-.4.8-.72 1.29-.9V4h-2V2h2V1h2v1h2v2h-2v.82c.53.15.99.33 1.4.62l-1.4 1.4l1.41 1.41l1.37-1.37c.28.41.47.86.62 1.4H18v-2h2v2h1v2h-1v2h-2v-.82c-.15.53-.33.99-.62 1.4l1.4 1.4l-1.41 1.41z"
      fill={color}
    />
  </Svg>
);

export default ToolsSvg;
