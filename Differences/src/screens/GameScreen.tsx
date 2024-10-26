import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LEVELS } from '../config/levels';
import { Difference } from '../types';
import { StorageService } from '../utils/storage';
import { CheckIcon } from '../lib/images'; // Add this import

const GameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { levelId } = route.params as { levelId: number };
  const level = LEVELS.find(l => l.id === levelId);

  const [attempts, setAttempts] = useState(3);
  const [foundDifferences, setFoundDifferences] = useState<Difference[]>([]);
  
  useEffect(() => {
    if (!level) {
      navigation.goBack();
    }
  }, [level]);

  const handleLevelComplete = async () => {
    try {
      await StorageService.unlockNextLevel(levelId);
      
      Alert.alert(
        'Félicitations!',
        'Vous avez trouvé toutes les différences!',
        [
          {
            text: 'Retour au menu',
            onPress: () => {
              //@ts-ignore
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            },
          },
        ]
      );
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
      const newFoundDifferences = [...foundDifferences, foundDifference];
      setFoundDifferences(newFoundDifferences);
      
      // Show immediate visual feedback for successful find
      if (newFoundDifferences.length === level.differences.length) {
        handleLevelComplete();
      }
    } else {
      const newAttempts = Math.max(0, attempts - 1);
      setAttempts(newAttempts);
      
      if (newAttempts === 0) {
        Alert.alert(
          'Game Over', 
          'Vous avez épuisé toutes vos tentatives!',
          [
            {
              text: 'Retour au menu',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    }
  };

  const renderSpots = (imageNumber: number) => {
    return foundDifferences.map((diff, index) => (
      <View
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
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={(e) => handleImagePress(e, 2)}>
          <View style={styles.imageWrapper}>
            <Image source={level.modifiedImage} style={styles.image} />
            {renderSpots(2)}
          </View>
        </TouchableWithoutFeedback>
      </View>
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
    padding: 16,
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
});

export default GameScreen;