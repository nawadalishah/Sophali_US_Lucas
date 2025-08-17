import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import Navigation from './src/navigation/AppNavigation';
import { useFonts } from 'expo-font';
import { Provider } from 'react-redux';
import { store } from './src/redux/Store';
import { NativeBaseProvider } from 'native-base';
import { BackHandler, LogBox } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AndroidSafeArea } from './src/constants';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true
})

LogBox.ignoreLogs([
  '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.',
  '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.',
  'In React 18, SSRProvider is not necessary and is a noop. You can remove it from your app.',
  `SerializableStateInvariantMiddleware took 64ms, which is more than the warning threshold of 32ms.If your state or actions are very large, you may want to disable the middleware as it might cause too much of a slowdown in development mode. See https://redux-toolkit.js.org/api/getDefaultMiddleware for instructions.It is disabled in production builds, so you don't need to worry about that.`,
  `SerializableStateInvariantMiddleware took 60ms, which is more than the warning threshold of 32ms.If your state or actions are very large, you may want to disable the middleware as it might cause too much of a slowdown in development mode. See https://redux-toolkit.js.org/api/getDefaultMiddleware for instructions.It is disabled in production builds, so you don't need to worry about that.`,
  `SerializableStateInvariantMiddleware took 30ms, which is more than the warning threshold of 32ms.If your state or actions are very large, you may want to disable the middleware as it might cause too much of a slowdown in development mode. See https://redux-toolkit.js.org/api/getDefaultMiddleware for instructions.It is disabled in production builds, so you don't need to worry about that.`,
  `SerializableStateInvariantMiddleware took 73ms, which is more than the warning threshold of 32ms.If your state or actions are very large, you may want to disable the middleware as it might cause too much of a slowdown in development mode. See https://redux-toolkit.js.org/api/getDefaultMiddleware for instructions.It is disabled in production builds, so you don't need to worry about that.`,
]);
LogBox.ignoreAllLogs(true);

// Patch for old BackHandler.removeEventListener usage in dependencies
// @ts-ignore
if (!BackHandler.removeEventListener) {
  // @ts-ignore
  BackHandler.removeEventListener = () => {};
}

const App = () => {
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    'Lato-Black': require('./src/fonts/Lato-Black.ttf'),
    'Lato-Bold': require('./src/fonts/Lato-Bold.ttf'),
    'Lato-Regular': require('./src/fonts/Lato-Regular.ttf'),
    'Lato-Light': require('./src/fonts/Lato-Light.ttf'),
    'Lato-SemiBold': require('./src/fonts/Lato-SemiBold.ttf'),
  });

  useEffect(() => {
    checkOrientation();
    const subscription = ScreenOrientation.addOrientationChangeListener(
      handleOrientationChange,
    );
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const checkOrientation = async () => {
    // @ts-ignore
    const orientation = await ScreenOrientation.getOrientationAsync();
    setOrientation(orientation);
  };

  const handleOrientationChange = (o: any) => {
    setOrientation(o.orientationInfo.orientation);
  };

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hide();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <StatusBar style="dark" />
        <SafeAreaView
          onLayout={onLayoutRootView}
          style={{ ...AndroidSafeArea.AndroidSafeArea }}>
          <Navigation />
        </SafeAreaView>
      </Provider>
    </NativeBaseProvider>
  );
};

export default App; // Export the App component wrapped with the HOC
