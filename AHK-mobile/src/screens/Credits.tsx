import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions,
  Animated,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { theme } from '../styles/theme';

export default function Credits(): JSX.Element {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const scrollAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    setIsAnimationComplete(false);
    Animated.timing(scrollAnimation, {
      toValue: 1,
      duration: 30000,
      useNativeDriver: true,
    }).start(() => {
      setIsAnimationComplete(true);
    });
  };

  const animatedStyle = {
    transform: [{
      translateY: scrollAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [height * 0.70, -height * 1.3],
      })
    }]
  };

  const renderScrollingContent = () => (
    <SafeAreaView style={{ flex: 1 }}>      
      <Animated.View style={[styles.content, animatedStyle]}>
        <View style={styles.header}>
          <Text style={styles.title}>CREDITS</Text>
        <Text style={styles.subtitle}>TO</Text>
        <Text style={styles.subheader}>THE DIGITAL FRONTIER</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          In a digital realm far beyond traditional boundaries,{'\n'}
          a new era of artistic expression emerges...
        </Text>
        <Text style={styles.text}>
          Through the vast expanse of virtual space,{'\n'}
          creators and innovators push the boundaries{'\n'}
          of what's possible in digital art and design.
        </Text>
        <Text style={styles.text}>
          This is where tradition meets innovation,{'\n'}
          where the physical and digital worlds{'\n'}
          converge to create something entirely new...
        </Text>
        <Text style={styles.text}>
          Software Development by Judith Rios & Gabino López.
        </Text>
        <Text style={styles.text}>
          All art is created by Andrew H. King.
        </Text>
        <Text style={styles.text}>
          The website is hosted on your ♥.
        </Text>
      </View>
    </Animated.View>
    </SafeAreaView>
  );

  const renderCompletedContent = () => (
    <SafeAreaView style={{ flex: 1 }}>
      <View />
      <ScrollView style={styles.completedContent}>
        <View style={styles.header}>
          <Text style={styles.completedTitle}>CREDITS</Text>
          <Text style={styles.completedSubtitle}>TO</Text>
          <Text style={styles.completedSubheader}>THE DIGITAL FRONTIER</Text>
        </View>
        <View style={styles.columns}>
          <View style={styles.column}>
            <Text style={styles.completedText}>
              In a digital realm far beyond traditional boundaries, 
              a new era of artistic expression emerges...
            </Text>
            <Text style={styles.completedText}>
              Through the vast expanse of virtual space,
              creators and innovators push the boundaries
              of what's possible in digital art and design.
            </Text>
            <Text style={styles.completedText}>
              This is where tradition meets innovation,
              where the physical and digital worlds
              converge to create something entirely new...
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.completedText}>
              Software Development by Judith Rios & Gabino López.
            </Text>
            <Text style={styles.completedText}>
              All art is created by Andrew H. King.
            </Text>
            <Text style={styles.completedText}>
              The website is hosted on your ♥.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      {isAnimationComplete ? renderCompletedContent() : renderScrollingContent()}
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 60,
  },
  content: {
    width: width * 0.8,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Vidaloka-Regular',
    fontSize: 48,
    color: theme.colors.secondary,
    letterSpacing: 6,
  },
  subtitle: {
    fontFamily: 'Vidaloka-Regular',
    fontSize: 24,
    color: theme.colors.secondary,
    marginBottom: 0,
  },
  subheader: {
    fontFamily: 'Vidaloka-Regular',
    fontSize: 36,
    color: theme.colors.secondary,
    letterSpacing: 4,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Vidaloka-Regular',
    fontSize: 24,
    color: theme.colors.secondary,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 2,
  },
  completedContent: {
    flex: 1,
  },
  completedContentContainer: {
    padding: 20,
    paddingTop: 60,
  },
  columns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  column: {
    width: '50%',
    padding: 10,
  },
  completedTitle: {
    fontFamily: 'Vidaloka-Regular',
    fontSize: 36,
    color: theme.colors.secondary,
    letterSpacing: 4,
  },
  completedSubtitle: {
    fontFamily: 'Vidaloka-Regular',
    fontSize: 18,
    color: theme.colors.secondary,
  },
  completedSubheader: {
    fontFamily: 'Vidaloka-Regular',
    fontSize: 24,
    color: theme.colors.secondary,
    letterSpacing: 3,
  },
  completedText: {
    fontFamily: 'Vidaloka-Regular',
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 1,
  },
});