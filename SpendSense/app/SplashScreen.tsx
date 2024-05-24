import React, { useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Audio } from 'expo-av';


interface SplashScreenProps {
    onFinish: () => void;
  }

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoImg = require('../assets/images/spendsense-logo.png');
  const intro = require('../assets/sounds/intro.mp3');
  const opacity = useSharedValue(0);

  useEffect(() => {

    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        intro 
      );
      await sound.playAsync();
      return sound;
    };
    
    const fadeIn = withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) });
    const fadeOut = withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) });

    opacity.value = fadeIn;

    const soundPromise = playSound();

    

    const timer = setTimeout(() => {
      opacity.value = fadeOut;
      setTimeout(onFinish, 1000); 
    }, 2000); 

    return () => clearTimeout(timer);
  }, [opacity, onFinish]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
      <Animated.View style={[styles.container, animatedStyle]}>
        <Image source={logoImg} style={styles.logo} />
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100
  },
  logo: {
    width: 300,
    height: 300,
  },
});

export default SplashScreen;