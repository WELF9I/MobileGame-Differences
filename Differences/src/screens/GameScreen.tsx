import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LEVELS } from '../config/levels';
import { Difference } from '../types';
import { StorageService } from '../utils/storage';
import { CheckIcon, CloseIcon,TrophyIcon } from '../lib/images';

const GameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { levelId } = route.params as { levelId: number };
  const level = LEVELS.find(l => l.id === levelId);

  const [attempts, setAttempts] = useState(3);
  const [foundDifferences, setFoundDifferences] = useState<Difference[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [incorrectSpots, setIncorrectSpots] = useState<Array<{ x: number; y: number; id: number }>>([]);
  
  // Animation values
  const congratsScale = useRef(new Animated.Value(0)).current;
  const congratsConfetti = useRef(new Animated.Value(0)).current;
  const progressBarWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!level) {
      navigation.goBack();
    }
  }, [level]);

  const animateProgressBar = () => {
    const progress = (foundDifferences.length / level!.differences.length) * 100;
    Animated.timing(progressBarWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (level) {
      animateProgressBar();
    }
  }, [foundDifferences]);

  const handleLevelComplete = async () => {
    try {
      await StorageService.unlockNextLevel(levelId);
      setShowCongrats(true);
      
      // Animate congratulatory screen
      Animated.sequence([
        Animated.spring(congratsScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(congratsConfetti, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error handling level completion:', error);
    }
  };

  const handleImagePress = (event: any, imageNumber: number) => {
    if (!level || attempts <= 0) return;

    const { locationX, locationY } = event.nativeEvent;
    
    const foundDifference = level.differences.find(diff => {
      const distance = Math.sqrt(
        Math.pow(diff.x - locationX, 2) + Math.pow(diff.y - locationY, 2)
      );
      return distance < diff.radius && !foundDifferences.includes(diff);
    });

    if (foundDifference) {
      // Animate correct spot
      const newFoundDifferences = [...foundDifferences, foundDifference];
      setFoundDifferences(newFoundDifferences);
      
      if (newFoundDifferences.length === level.differences.length) {
        handleLevelComplete();
      }
    } else {
      // Show and animate incorrect spot
      const newSpotId = Date.now();
      setIncorrectSpots(prev => [...prev, { x: locationX, y: locationY, id: newSpotId }]);
      
      // Remove incorrect spot after animation
      setTimeout(() => {
        setIncorrectSpots(prev => prev.filter(spot => spot.id !== newSpotId));
      }, 1000);

      const newAttempts = Math.max(0, attempts - 1);
      setAttempts(newAttempts);
      
      if (newAttempts === 0) {
        navigation.goBack();
      }
    }
  };

  const renderSpots = (imageNumber: number) => {
    return foundDifferences.map((diff, index) => (
      <Animated.View
        key={`${imageNumber}-${index}`}
        style={[
          styles.spot,
          {
            left: diff.x - diff.radius,
            top: diff.y - diff.radius,
            width: diff.radius * 2,
            height: diff.radius * 2,
            borderRadius: diff.radius,
          },
        ]}
      />
    ));
  };

  const renderIncorrectSpots = () => {
    return incorrectSpots.map((spot) => (
      <Animated.View
        key={spot.id}
        style={[
          styles.incorrectSpot,
          {
            left: spot.x - 15,
            top: spot.y - 15,
          },
        ]}
      >
        <Image source={CloseIcon} style={styles.incorrectIcon} />
      </Animated.View>
    ));
  };

  const CongratsModal = () => (
    <Modal visible={showCongrats} transparent animationType="none">
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.congratsCard,
            {
              transform: [{ scale: congratsScale }],
            },
          ]}
        >
          <Text style={styles.congratsTitle}>Félicitations !</Text>
          <View style={styles.levelPreview}>
            <Image source={level?.originalImage} style={styles.previewImage} />
            {renderSpots(1)}
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressBarWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' as never }],
              });
            }}
          >
            <View style={styles.continueButton}>
              <Text style={styles.continueButtonText}>Continuer</Text>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    </Modal>
  );

  if (!level) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Niveau {level.id}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>❤️ {attempts}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>
              {foundDifferences.length}/{level.differences.length}
            </Text>
            <Image 
              source={CheckIcon} 
              style={[
                styles.checkIcon,
                { opacity: foundDifferences.length > 0 ? 1 : 0.3 }
              ]} 
            />
          </View>
        </View>
      </View>

      <View style={styles.imagesContainer}>
        <TouchableWithoutFeedback onPress={(e) => handleImagePress(e, 1)}>
          <View style={styles.imageWrapper}>
            <Image source={level.originalImage} style={styles.image} />
            {renderSpots(1)}
            {renderIncorrectSpots()}
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={(e) => handleImagePress(e, 2)}>
          <View style={styles.imageWrapper}>
            <Image source={level.modifiedImage} style={styles.image} />
            {renderSpots(2)}
            {renderIncorrectSpots()}
          </View>
        </TouchableWithoutFeedback>
      </View>

      <CongratsModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  stat: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 20,
    minWidth: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  checkIcon: {
    width: 20,
    height: 20,
  },
  imagesContainer: {
    flex: 1,
    padding: 8,
    gap: 8,
  },
  imageWrapper: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  spot: {
    position: 'absolute',
    borderWidth: 3.5,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
  incorrectSpot: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
  },
  incorrectIcon: {
    width: 20,
    height: 20,
    tintColor: 'red',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  congratsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  congratsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  levelPreview: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default GameScreen;