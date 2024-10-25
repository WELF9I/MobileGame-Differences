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
import { Level, Difference } from '../types';

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

  const handleImagePress = (event: any, imageNumber: number) => {
    if (!level || attempts <= 0) return;

    const { locationX, locationY } = event.nativeEvent;
    
    // Find if the click is near any difference spot
    const foundDifference = level.differences.find(diff => {
      const distance = Math.sqrt(
        Math.pow(diff.x - locationX, 2) + Math.pow(diff.y - locationY, 2)
      );
      return distance < diff.radius && !foundDifferences.includes(diff);
    });

    if (foundDifference) {
      setFoundDifferences(prev => [...prev, foundDifference]);
      
      if (foundDifferences.length + 1 === level.differences.length) {
        Alert.alert('Félicitations!', 'Vous avez trouvé toutes les différences!');
      }
    } else {
      const newAttempts = Math.max(0, attempts - 1);
      setAttempts(newAttempts);
      
      if (newAttempts === 0) {
        Alert.alert('Game Over', 'Vous avez épuisé toutes vos tentatives!');
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
            <Text style={styles.statLabel}>{foundDifferences.length}/{level.differences.length}</Text>
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
  },
  stat: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  imagesContainer: {
    flex: 1,
    gap: 16,
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
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
});

export default GameScreen;