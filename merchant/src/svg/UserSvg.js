import * as React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const UserIcon = ({ color }) => (
  <View style={{ width: 50, height: 50 }}>
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Circle
        cx="25"
        cy="25"
        r="22.5"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        fill="transparent"
      />
      <Path
        d="M25 13.125C21.6032 13.125 18.75 15.9782 18.75 19.375C18.75 22.7718 21.6032 25.625 25 25.625C28.3968 25.625 31.25 22.7718 31.25 19.375C31.25 15.9782 28.3968 13.125 25 13.125ZM25 15.625C27.2091 15.625 29.0625 17.4784 29.0625 19.6875C29.0625 21.8966 27.2091 23.75 25 23.75C22.7909 23.75 20.9375 21.8966 20.9375 19.6875C20.9375 17.4784 22.7909 15.625 25 15.625ZM38.125 36.875C38.125 33.6802 34.897 30.9375 31.25 30.9375H18.75C15.103 30.9375 11.875 33.6802 11.875 36.875V38.125H38.125V36.875Z"
        fill={color}
      />
    </Svg>
  </View>
);

export default UserIcon;
