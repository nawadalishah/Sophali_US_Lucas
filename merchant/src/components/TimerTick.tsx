import { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, Text } from '../constants';
import React from 'react';

export default function TimerTick({ item }: any) {
  const [actualTime, setActualTime] = useState('');
  const [color, setColor] = useState(COLORS.preparingOrder);
  const [textColor, setTextColor] = useState(COLORS.white);

  useEffect(() => {
    setInterval(() => {
      if (getMinutes(item) < -200) {
        setActualTime('time exceed');
      } else {
        setActualTime(`(${getMinutes(item)} min ${getSeconds(item)} sec)`);
      }
    }, 1000);
  }, [item]);

  const getTimeRemaining = (order: any) => {
    const now: any = new Date();
    const startTime = new Date(order.updatedAt);
    const totalTime = order.total_time_in_minutes * 60 * 1000; // convert to milliseconds
    const endTime: any = new Date(startTime.getTime() + totalTime);
    const timeRemaining = endTime - now;

    return timeRemaining;
  };

  const getMinutes = (item: any) => {
    const order = {
      updatedAt: item.updatedAt,
      total_time_in_minutes: item.total_time_in_minutes,
    };

    const timeRemining = getTimeRemaining(order);
    let minutes = Math.floor(timeRemining / (60 * 1000));
    if (minutes < -1) {
      // Adjust the display value for negative minutes
      minutes = minutes + 1;
    }

    const seventyPercentConsumed = isSeventyPercentConsumed(
      timeRemining,
      order.total_time_in_minutes,
    );
    if (seventyPercentConsumed && minutes > 0) {
      setColor(COLORS.tickerPreparingTimeColor);
      setTextColor(COLORS.black);
      return minutes;
    }
    if (minutes < 0) setColor(COLORS.tickerWarningTimeColor);
    return minutes;
  };
  // function isSeventyPercentConsumed(timeRemining: any, totalTime: any) {
  //   const seventyPercent = (70 / 100) * totalTime;
  //   const remaining = Number((timeRemining / (60 * 1000)).toFixed(2));
  //   return remaining >= totalTime - seventyPercent;
  // }

  function isSeventyPercentConsumed(timeRemaining: any, totalTime: any) {
    const totalTimes = totalTime * 60 * 1000;

    const elapsedPercent = ((totalTimes - timeRemaining) / totalTimes) * 100;
    return elapsedPercent >= 70;
  }

  const getSeconds = (item: any) => {
    const order = {
      updatedAt: item.updatedAt,
      total_time_in_minutes: item.total_time_in_minutes,
    };

    const timeRemining = getTimeRemaining(order);
    const seconds = Math.floor((timeRemining % (60 * 1000)) / 1000);

    return Math.abs(seconds);
  };

  return (
    <View
      style={{
        // justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        // marginBottom: 12,
      }}>
      <TouchableOpacity
        disabled={true}
        style={{
          backgroundColor: color,
          borderRadius: 30,
          padding: 5,
          // marginHorizontal: 5,
        }}
        // onPress={() => setFavorite('New')}
      >
        <Text
          style={{
            textTransform: 'capitalize',
            color: textColor,
            paddingRight: 10,
            paddingLeft: 10,
          }}
          lines={1}>
          Preparing...{' '}
        </Text>
        <Text
          style={{
            textTransform: 'capitalize',
            color: textColor,
          }}
          lines={1}>
          {actualTime}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
