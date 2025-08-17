import * as React from 'react';
import { View, TextInput } from 'react-native';
import Svg, { Circle, Text } from 'react-native-svg';

const CreditSvg = ({ color, totalBalance }) => {
  const [editableNumber, setEditableNumber] = React.useState('145.1');

  return (
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
          stroke={color}
          strokeWidth="1.5"
          fill="transparent"
        />
        <Text
          x={25}
          y={30}
          textAnchor="middle"
          fontSize={14}
          fill={color}
          style={{ userSelect: 'none' }}>
          {totalBalance | 0}
        </Text>
      </Svg>
    </View>
  );
};

export default CreditSvg;
