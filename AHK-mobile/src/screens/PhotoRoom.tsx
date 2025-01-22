import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Image, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;

interface PexelsPhoto {
  src: {
    large: string;
  };
  photographer: string;
  alt: string;
}

function PhotoRoom(): JSX.Element {
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(
        'https://api.pexels.com/v1/search?query=photography&per_page=20',
        {
          headers: {
            Authorization: 'gIi2NOmJ3NnxND476nkZiNqVpDVlafaCzcEQspKfu4VVqiB7nvibqy2q'
          }
        }
      );
      const data = await response.json();
      setPhotos(data.photos);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const nextPhoto = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(prev => prev + 1);
      translateX.value = withSpring(0);
    }
  };

  const previousPhoto = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      translateX.value = withSpring(0);
    }
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: { startX: number }) => {
      context.startX = translateX.value;
    },
    onActive: (event, context: { startX: number }) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        if (event.translationX > 0 && currentIndex > 0) {
          runOnJS(previousPhoto)();
        } else if (event.translationX < 0 && currentIndex < photos.length - 1) {
          runOnJS(nextPhoto)();
        } else {
          translateX.value = withSpring(0);
        }
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  return (
    <ImageBackground 
      source={require('../../assets/images/photobg.jpg')} 
      style={styles.container}
      resizeMode="cover"
    >
      <GestureHandlerRootView style={styles.gestureContainer}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.photoContainer]}>
            {photos[currentIndex] && (
              <>
                <View style={styles.photoFrame}>
                  <View style={styles.photoWrapper}>
                    <Image
                      source={{ uri: photos[currentIndex].src.large }}
                      style={styles.photo}
                      resizeMode="contain"
                    />
                  </View>
                </View>
                <View style={styles.photoInfo}>
                  <Text style={styles.photoTitle}>{photos[currentIndex].alt}</Text>
                  <Text style={styles.photographerName}>by {photos[currentIndex].photographer}</Text>
                </View>
              </>
            )}
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          onPress={previousPhoto} 
          style={[styles.navButton, { opacity: currentIndex > 0 ? 1 : 0.5 }]}
          disabled={currentIndex === 0}
        >
          <Ionicons name="chevron-back" size={30} color={theme.colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={nextPhoto} 
          style={[styles.navButton, { opacity: currentIndex < photos.length - 1 ? 1 : 0.5 }]}
          disabled={currentIndex === photos.length - 1}
        >
          <Ionicons name="chevron-forward" size={30} color={theme.colors.secondary} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  gestureContainer: {
    position: 'absolute',
    height: height * 0.66,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.01,
    left: -35,
    right: 15,
    top: 28,
    bottom:0,
  },
  photoContainer: {
    width: width * 0.9,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoFrame: {
    width: '100%',
    padding: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  photoWrapper: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderWidth: 5,
    borderColor: theme.colors.secondary,
    backgroundColor: theme.colors.secondary,
  },
  navigationButtons: {
    position: 'absolute',
    height: height * 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    bottom: height * 0.2,
  },
  navButton: {
    padding: 10,
    backgroundColor: theme.colors.shadowly,
    borderRadius: 20,
  },
  photoInfo: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  photoTitle: {
    fontFamily: 'System',  // iOS system font
    fontSize: 14,
    color: theme.colors.darkMaroon,
    textAlign: 'center',
    marginBottom: 4,
  },
  photographerName: {
    fontFamily: 'System',  // iOS system font
    fontSize: 12,
    color: theme.colors.darkMaroon,
    fontStyle: 'italic',
  },
});

export default PhotoRoom;