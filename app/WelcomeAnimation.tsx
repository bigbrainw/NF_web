import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ScrollView, Button, TextInput, Linking } from 'react-native';

const { width, height } = Dimensions.get('window');

const NUM_PARTICLES = 500;
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

  const customSolutionsOpacity = scrollY.interpolate({
    inputRange: [height, height * 1.5],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const featuresOpacity = scrollY.interpolate({
    inputRange: [height * 1.5, height * 2],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const applicationsOpacity = scrollY.interpolate({
    inputRange: [height * 2, height * 2.5],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const howItWorksOpacity = scrollY.interpolate({
    inputRange: [height * 2.5, height * 3],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const earlyAccessOpacity = scrollY.interpolate({
    inputRange: [height * 3, height * 3.5],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const teamOpacity = scrollY.interpolate({
    inputRange: [height * 3.5, height * 4],
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
          <Text style={styles.welcomeText}>Unleash the Power of Your Mind</Text>
          <Text style={styles.shortDescription}>
            We develop cutting-edge EEG chips and programs to help individuals engage and unlock the full potential of their brains.
          </Text>
          <View style={styles.ctaContainer}>
            <Button title="Learn More" onPress={() => alert('Learn More pressed')} />
            <Button title="Join the Waitlist" onPress={() => alert('Join the Waitlist pressed')} />
          </View>
        </Animated.View>
      </View>
      <Animated.View style={[styles.infoContainer, { opacity: infoOpacity }]}>
        <Text style={styles.sectionTitle}>Our Vision</Text>
        <Text style={styles.infoText}>
          We believe in making brain technology accessible to everyone, empowering people to enhance focus, productivity, and well-being.
        </Text>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.infoText}>
          To create innovative EEG technology and applications that bridge the gap between science and everyday life.
        </Text>
      </Animated.View>
      <Animated.View style={[styles.infoContainer, { opacity: customSolutionsOpacity }]}>
        <Text style={styles.sectionTitle}>Custom Solutions</Text>
        <Text style={styles.infoText}>
          Tailored EEG solutions for research, healthcare, and personal development.
        </Text>
      </Animated.View>
      <Animated.View style={[styles.infoContainer, { opacity: featuresOpacity }]}>
        <Text style={styles.sectionTitle}>Features</Text>
        <Text style={styles.sectionSubTitle}>Key Features of Our EEG Chips:</Text>
        <Text style={styles.infoText}>- Ultra-compact and lightweight</Text>
        <Text style={styles.infoText}>- Accurate detection of brain waves</Text>
        <Text style={styles.infoText}>- Easy integration with modern devices</Text>
        <Text style={styles.infoText}>- Low power consumption</Text>
        <Text style={styles.infoText}>- Customizable APIs for developers</Text>
        <Text style={styles.sectionSubTitle}>Key Features of Our Programs:</Text>
        <Text style={styles.infoText}>- Brain activity visualization</Text>
        <Text style={styles.infoText}>- Focus and productivity enhancement tools</Text>
        <Text style={styles.infoText}>- Gamified exercises for mental clarity</Text>
      </Animated.View>
      <Animated.View style={[styles.infoContainer, { opacity: applicationsOpacity }]}>
        <Text style={styles.sectionTitle}>Applications</Text>
        <Text style={styles.sectionSubTitle}>Highlight the potential use cases of your technology:</Text>
        <Text style={styles.sectionSubTitle}>For Personal Use:</Text>
        <Text style={styles.infoText}>- Focus and productivity improvement</Text>
        <Text style={styles.infoText}>- Stress management</Text>
        <Text style={styles.infoText}>- Meditation and mindfulness enhancement</Text>
        <Text style={styles.sectionSubTitle}>For Researchers and Developers:</Text>
        <Text style={styles.infoText}>- Neurofeedback training</Text>
        <Text style={styles.infoText}>- Cognitive performance monitoring</Text>
        <Text style={styles.sectionSubTitle}>For Enterprises:</Text>
        <Text style={styles.infoText}>- Employee productivity tools</Text>
        <Text style={styles.infoText}>- Wellness initiatives</Text>
      </Animated.View>
      <Animated.View style={[styles.infoContainer, { opacity: howItWorksOpacity }]}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.sectionSubTitle}>Explain the flow of your technology in simple steps:</Text>
        <Text style={styles.infoText}>1. <Text style={styles.boldText}>Step 1:</Text> Wear the device with our EEG chip.</Text>
        <Text style={styles.infoText}>2. <Text style={styles.boldText}>Step 2:</Text> Engage with the program via an app.</Text>
        <Text style={styles.infoText}>3. <Text style={styles.boldText}>Step 3:</Text> Track your progress and unlock new insights.</Text>
      </Animated.View>
      <Animated.View style={[styles.infoContainer, { opacity: earlyAccessOpacity }]}>
        <Text style={styles.sectionTitle}>Early Access/Join Us</Text>
        <Text style={styles.infoText}>
          "Be the first to experience the future of brain technology."
        </Text>
        <Text style={styles.infoText}>Encourage visitors to join a waitlist or sign up for beta access:</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Interest (e.g., personal use, research)"
            placeholderTextColor="#888"
          />
          <Button title="Join Now" onPress={() => alert('Thank you for joining!')} />
        </View>
      </Animated.View>
      <Animated.View style={[styles.infoContainer, { opacity: teamOpacity }]}>
        <Text style={styles.sectionTitle}>Team</Text>
        <View style={styles.teamMember}>
          <Text style={styles.teamName}>Elijah</Text>
          <Text style={styles.teamRole}>Co-Founder</Text>
          <Text style={styles.teamBio}>Elijah is a tech entrepreneur with expertise in computational neuroscience and AI applications. Connect on <Text style={styles.link} onPress={() => Linking.openURL('https://linkedin.com/in/yupingho')}>LinkedIn</Text>.</Text>
        </View>
        <View style={styles.teamMember}>
          <Text style={styles.teamName}>Enkbold Ganbold</Text>
          <Text style={styles.teamRole}>Co-Founder</Text>
          <Text style={styles.teamBio}> Connect on <Text style={styles.link} onPress={() => Linking.openURL('https://linkedin.com/in/janedoe')}>LinkedIn</Text>.</Text>
        </View>
        <View style={styles.teamMember}>
          <Text style={styles.teamName}>Amarjargal Ayurzana</Text>
          <Text style={styles.teamRole}>Co-Founder</Text>
          <Text style={styles.teamBio}>. Connect on <Text style={styles.link} onPress={() => Linking.openURL('https://linkedin.com/in/janedoe')}>LinkedIn</Text>.</Text>
        </View>
      </Animated.View>
      <Animated.View style={[styles.infoContainer, { opacity: featuresOpacity }]}>
    <Text style={styles.sectionTitle}>FAQ</Text>
    <Text style={styles.sectionSubTitle}>Common Questions</Text>
    
    <Text style={styles.infoText}>
      <Text style={styles.boldText}>What is an EEG chip?</Text>{'\n'}
      An EEG chip is a compact electronic device that detects and processes brainwave signals, enabling applications such as neurofeedback, mental health monitoring, and productivity enhancement.
    </Text>
    
    <Text style={styles.infoText}>
      <Text style={styles.boldText}>How accurate is your technology?</Text>{'\n'}
      Our technology provides high accuracy in brainwave detection, leveraging state-of-the-art algorithms and hardware to ensure reliable data interpretation.
    </Text>
    
    <Text style={styles.infoText}>
      <Text style={styles.boldText}>Is it safe for everyday use?</Text>{'\n'}
      Yes, our EEG chips are designed with safety and comfort in mind, adhering to rigorous standards for everyday use without any adverse effects.
    </Text>
    
    <Text style={styles.infoText}>
      <Text style={styles.boldText}>Who can benefit from it?</Text>{'\n'}
      Anyone looking to enhance focus, improve productivity, manage stress, or explore cognitive insights can benefit from our technology. It's ideal for individuals, researchers, and enterprises alike.
    </Text>
  </Animated.View>
  <Animated.View style={[styles.footerContainer]}>
  <Text style={styles.sectionTitle}>Footer</Text>

  <Text style={styles.footerLink} onPress={() => alert('Navigate to About Us')}>
    About Us
  </Text>
  <Text style={styles.footerLink} onPress={() => alert('Navigate to Contact')}>
    Contact
  </Text>
  <Text style={styles.footerLink} onPress={() => alert('Navigate to Privacy Policy')}>
    Privacy Policy
  </Text>
  <Text style={styles.footerLink} onPress={() => alert('Navigate to Terms of Use')}>
    Terms of Use
  </Text>

  {/* Example for social media icons (replace with actual icons/images if available) */}
  <Text style={styles.footerLink} onPress={() => alert('Navigate to Facebook')}>
    Facebook
  </Text>
  <Text style={styles.footerLink} onPress={() => alert('Navigate to Twitter')}>
    Twitter
  </Text>
  <Text style={styles.footerLink} onPress={() => alert('Navigate to LinkedIn')}>
    LinkedIn
  </Text>

  <Text style={styles.footerText}>© 2025 NeuroFocus. All rights reserved.</Text>
</Animated.View>
          
    </Animated.ScrollView>
    
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#000000',
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
    backgroundColor: '#ffffff',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: '#00ffff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  shortDescription: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  ctaContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    minHeight: height,
  },
  sectionTitle: {
    color: '#00ffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionSubTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  infoText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#888',
    borderWidth: 1,
    marginBottom: 10,
    color: '#fff',
    paddingHorizontal: 10,
  },
  form: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  teamMember: {
    marginBottom: 20,
  },
  teamName: {
    color: '#00ffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  teamRole: {
    color: '#ffffff',
    fontSize: 16,
    fontStyle: 'italic',
  },
  teamBio: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 5,
  },
  link: {
    color: '#00ffff',
    textDecorationLine: 'underline',
  },
  footerContainer: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  footerLink: {
    color: '#00ffff',
    fontSize: 16,
    marginBottom: 5,
    textDecorationLine: 'underline',
  },
  footerText: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 10,
  },
});

export default WelcomeAnimation;
