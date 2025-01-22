import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  ImageBackground,
  Animated
} from 'react-native';
import BookSelect from '../components/BookSelect';
import { theme } from '../styles/theme';

function Writings(): JSX.Element {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [visibleSections, setVisibleSections] = useState(new Set<number>());
  
  const sections = [
    'Poetry', 'Puicos', 'What They Say',
    'Written Work', 'Excripts'
  ];

  useEffect(() => {
    // Show sections sequentially with a delay
    sections.forEach((_, index) => {
      setTimeout(() => {
        setVisibleSections(prev => {
          const newSet = new Set(prev);
          newSet.add(index);
          return newSet;
        });
      }, index * 200); // 200ms delay between each section
    });
  }, []);

  const handlePress = (text: string) => {
    setSelectedSection(text);
    setIsBookModalOpen(true);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/shelffinal.jpeg')}
        style={styles.shelfBg}
        imageStyle={{
          position: 'absolute',
          right: '-100%',
          width: '300%',
          height: '100%',
          opacity: 0.8,
        }}
        resizeMode="cover"
      >
        <View style={styles.shelfBox}>
          {sections.map((text, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.shelfSector,
                { opacity: visibleSections.has(index) ? 1 : 0 }
              ]}
              onPress={() => handlePress(text)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionText}>
                {text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ImageBackground>
      {isBookModalOpen && (
        <BookSelect
          isOpen={isBookModalOpen}
          onClose={() => {
            setIsBookModalOpen(false);
            setSelectedSection('');
          }}
          section={selectedSection}
        />
      )}
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shelfBg: {
    flex: 1,
    width: '100%',
  },
  shelfBox: {
    flex: 1,
    height: height,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelfSector: {
    width: width * 0.8,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: theme.colors.shadowly,
    borderRadius: 8,
    shadowColor: theme.colors.darkMaroon,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  sectionText: {
    fontFamily: 'Vidaloka-Regular',
    fontSize: 24,
    color: 'white',
    textTransform: 'uppercase',
    textShadowColor: theme.colors.primary,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
    letterSpacing: 4,
  },
});

export default Writings;