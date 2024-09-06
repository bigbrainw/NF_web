import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

const NUM_PARTICLES = 500; // Increased from 100 to 500

const CIRCLE_RADIUS = 300;

const Particle = ({ angle, animation, explosionAnimation }) => {
  const size = Math.random() * 2 + 1;
  const distance = CIRCLE_RADIUS + (Math.random() - 0.5) * 20;

  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  const initialX = width * (Math.random() - 0.5) * 2;
  const initialY = height * (Math.random() - 0.5) * 2;

  const explosionX = width * (Math.random() - 0.5) * 2;
  const explosionY = height * (Math.random() - 0.5) * 2;

  const translateX = Animated.add(
    animation.interpolate({
      inputRange: [0, 1],
      outputRange: [initialX, x],
    }),
    explosionAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, explosionX - x],
    })
  );

  const translateY = Animated.add(
    animation.interpolate({
      inputRange: [0, 1],
      outputRange: [initialY, y],
    }),
    explosionAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, explosionY - y],
    })
  );

  const opacity = Animated.multiply(
    animation.interpolate({
      inputRange: [0, 0.7, 1],
      outputRange: [0, 1, 1],
    }),
    explosionAnimation.interpolate({
      inputRange: [0, 0.7, 1],
      outputRange: [1, 0.5, 0],
    })
  );

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [{ translateX }, { translateY }],
          opacity,
        },
      ]}
    />
  );
};

const WelcomeAnimation = () => {
  const [animation] = useState(new Animated.Value(0));
  const [explosionAnimation] = useState(new Animated.Value(0));
  const [particles, setParticles] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const particlesArray = Array(NUM_PARTICLES).fill(0).map((_, index) => ({
      angle: (index / NUM_PARTICLES) * Math.PI * 2,
    }));
    setParticles(particlesArray);

    Animated.timing(animation, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const explosionProgress = scrollY.interpolate({
    inputRange: [0, height / 2],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const infoOpacity = scrollY.interpolate({
    inputRange: [height / 2, height],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.ScrollView
      style={styles.scrollView}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <View style={styles.container}>
        <View style={styles.particleContainer}>
          {particles.map((particle, index) => (
            <Particle
              key={index}
              angle={particle.angle}
              animation={animation}
              explosionAnimation={explosionProgress}
            />
          ))}
        </View>
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: Animated.subtract(1, explosionProgress),
            },
          ]}
        >
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.neuroFocusText}>NeuroFocus</Text>
        </Animated.View>
      </View>
      <Animated.View style={[styles.infoContainer, { opacity: infoOpacity }]}>
        <Text style={styles.sectionTitle}>About NeuroFocus</Text>
        <Text style={styles.infoText}>
          NeuroFocus is a cutting-edge startup dedicated to enhancing cognitive performance through innovative neurotechnology solutions.
        </Text>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.infoText}>
          We strive to empower individuals to unlock their full cognitive potential, enabling them to lead more productive and fulfilling lives.
        </Text>
        <Text style={styles.sectionTitle}>What We Offer</Text>
        <Text style={styles.infoText}>
          - State-of-the-art brain training programs
          - Personalized cognitive enhancement strategies
          - Advanced neurofeedback technologies
          - Expert consultation on mental performance optimization
        </Text>
      </Animated.View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#000000', // Changed to black
  },
  container: {
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particleContainer: {
    position: 'absolute',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#ffffff', // Kept white for contrast
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  welcomeText: {
    color: '#ffffff', // Kept white for contrast
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  neuroFocusText: {
    color: '#00ffff', // Changed to cyan for better visibility on black
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Slightly transparent white
    minHeight: height, // Ensure the info container is at least one full screen height
  },
  sectionTitle: {
    color: '#00ffff', // Changed to cyan for consistency with neuroFocusText
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  infoText: {
    color: '#ffffff', // Kept white for contrast
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
  },
});

export default WelcomeAnimation;