import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { LEVELS } from '../config/levels';
import { Difference } from '../types';
import { StorageService } from '../utils/storage';
import { CheckIcon, CloseIcon } from '../lib/images';
import { CongratsModal } from '../components/CongratsModal';
import { GameOverModal } from '../components/GameOverModal';
import { ExitGameModal } from '../components/ExitGameModal';
import AudioManager from '../utils/AudioManager';

type GameScreenRouteParams = {
  levelId: number;
  handleExitConfirmation?: () => void;
};

const GameScreen = () => {
  AudioManager.getInstance().playTapSound();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: GameScreenRouteParams }, 'params'>>();
  const { levelId } = route.params;
  const level = LEVELS.find(l => l.id === levelId);

  const [attempts, setAttempts] = useState(3);
  const [foundDifferences, setFoundDifferences] = useState<Difference[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [incorrectSpots, setIncorrectSpots] = useState<Array<{ x: number; y: number; id: number; animation: Animated.Value }>>([]);
  
  // Animation values
  const congratsScale = useRef(new Animated.Value(0)).current;
  const gameOverScale = useRef(new Animated.Value(0)).current;
  const congratsConfetti = useRef(new Animated.Value(0)).current;
  const progressBarWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    //@ts-ignore
    navigation.setParams({ handleExitConfirmation });
  }, []);
  
  useEffect(() => {
    if (!level) {
      navigation.goBack();
    }
  }, [level]);

  const handleExitConfirmation = () => {
    setShowExitConfirmation(true);
  };

  const handleContinue = () => {
    setShowExitConfirmation(false);
  };

  const handleQuit = () => {
    setShowExitConfirmation(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' as never }],
    });
  };

  const handleRestart = () => {
    setShowGameOver(false);
    setAttempts(3);
    setFoundDifferences([]);
    setIncorrectSpots([]);
    gameOverScale.setValue(0);
  };

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

  const handleGameOver = () => {
    setShowGameOver(true);
    Animated.spring(gameOverScale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const animateSpot = (spotAnimation: Animated.Value) => {
    Animated.sequence([
      Animated.spring(spotAnimation, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(spotAnimation, {
        toValue: 0,
        duration: 200,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleImagePress = (event: any, imageNumber: number) => {
    if (!level || attempts <= 0) return;

    const { locationX, locationY } = event.nativeEvent;
    // Add this console.log to display the coordinates
    console.log(`Image ${imageNumber} clicked at - X: ${Math.round(locationX)}, Y: ${Math.round(locationY)}`);
    
    const foundDifference = level.differences.find(diff => {
      const distance = Math.sqrt(
        Math.pow(diff.x - locationX, 2) + Math.pow(diff.y - locationY, 2)
      );
      return distance < diff.radius && !foundDifferences.includes(diff);
    });

    if (foundDifference) {
      const newFoundDifferences = [...foundDifferences, foundDifference];
      setFoundDifferences(newFoundDifferences);
      
      if (newFoundDifferences.length === level.differences.length) {
        handleLevelComplete();
      }
    } else {
      const spotAnimation = new Animated.Value(0);
      const newSpotId = Date.now();
      setIncorrectSpots(prev => [...prev, { x: locationX, y: locationY, id: newSpotId, animation: spotAnimation }]);
      
      animateSpot(spotAnimation);
      
      setTimeout(() => {
        setIncorrectSpots(prev => prev.filter(spot => spot.id !== newSpotId));
      }, 1000);

      const newAttempts = Math.max(0, attempts - 1);
      setAttempts(newAttempts);
      
      if (newAttempts === 0) {
        handleGameOver();
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
            transform: [
              {
                scale: spot.animation.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1.2, 1],
                }),
              },
              {
                rotate: spot.animation.interpolate({
                  inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
                  outputRange: ['0deg', '-10deg', '10deg', '-10deg', '10deg', '0deg'],
                }),
              },
            ],
          },
        ]}
      >
        <Image source={CloseIcon} style={styles.incorrectIcon} />
      </Animated.View>
    ));
  };


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
            <Image source={level.originalImage} style={styles.image} resizeMode="contain" />
            {renderSpots(1)}
            {renderIncorrectSpots()}
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={(e) => handleImagePress(e, 2)}>
          <View style={styles.imageWrapper}>
            <Image source={level.modifiedImage} style={styles.image} resizeMode="contain" />
            {renderSpots(2)}
            {renderIncorrectSpots()}
          </View>
        </TouchableWithoutFeedback>
      </View>

      <CongratsModal
        visible={showCongrats}
        level={level}
        //@ts-ignore
        navigation={navigation}
        congratsScale={congratsScale}
        progressBarWidth={progressBarWidth}
        foundDifferences={foundDifferences}
        attempts={attempts}  // Add this line
      />
      
      <GameOverModal 
        visible={showGameOver}
        onRestart={handleRestart}
        onQuit={handleQuit}
        scale={gameOverScale}
      />

      <ExitGameModal
        visible={showExitConfirmation}
        onContinue={handleContinue}
        onExit={handleQuit}
      />
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
    elevation: 5,
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
    flexDirection: 'column',
    paddingHorizontal: 4,
  },
  imageWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  spot: {
    position: 'absolute',
    borderWidth: 3.5,
    borderColor: '#00FF00',
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
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
  },
});

export default GameScreen;