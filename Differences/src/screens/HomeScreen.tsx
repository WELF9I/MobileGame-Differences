import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  FlatList,
  Dimensions
} from 'react-native';
import { LEVELS } from '../config/levels';
import { GameProgress, StorageService } from '../utils/storage';
import { 
  CalendarStarIcon, 
  CompletedIcon,
  SettingsIcon, 
  TrophyIcon,
  LockIcon,
  ghostIcon,
} from '../lib/images';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Level } from '../types';
import AudioManager from '../utils/AudioManager';


const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_SPACING = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // Accounting for padding and gap

const HomeScreen = () => {
  // When a button is pressed
AudioManager.getInstance().playTapSound();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);

  useEffect(() => {
    if (isFocused) {
      loadGameProgress();
    }
  }, [isFocused]);

  const loadGameProgress = async () => {
    const progress = await StorageService.getGameProgress();
    setGameProgress(progress);
  };

  const renderDailyAndEventCards = () => (
    <View style={styles.challengeContainer}>
      <TouchableOpacity
        style={styles.challengeCard}
        activeOpacity={0.8}
      >
        <Text style={styles.challengeTitle}>DÉFI QUOTIDIEN</Text>
        <View style={styles.challengeContent}>
          <Text style={styles.challengeDate}>{`${new Date().getDate()} ${
            ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'][new Date().getMonth()]
          }`}</Text>
          <Image source={CalendarStarIcon} style={styles.calendarIcon} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.challengeCard, styles.eventCard]}
        activeOpacity={0.8}
      >
        <Text style={styles.challengeTitle}>ÉVÈNEMENT</Text>
        <View style={styles.challengeContent}>
          <Text style={styles.challengeDate}>Halloween</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>9j 14h</Text>
            <Image source={ghostIcon} style={styles.ghostIcon} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderGameItem = ({ item, index }: { item: Level, index: number }) => {
    const isUnlocked = gameProgress?.unlockedLevels.includes(item.id);
    const isCompleted = gameProgress?.completedLevels.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.levelCard, { marginBottom: CARD_SPACING }]}
        activeOpacity={0.8}
        disabled={!isUnlocked}
        onPress={() => {
          if (isUnlocked) {
            //@ts-ignore
            navigation.navigate('Game', { levelId: item.id });
          }
        }}
      >
        <Image source={item.coverImage} style={styles.levelImage} />
        {isCompleted && (
          <View style={styles.completedOverlay}>
            <Image source={CompletedIcon} style={styles.checkIcon} />
          </View>
        )}
        {!isUnlocked && (
          <View style={styles.lockedOverlay}>
            <Image source={LockIcon} style={styles.lockIcon} />
          </View>
        )}
        {isCompleted && (
          <View style={styles.crownContainer}>
            <Image source={TrophyIcon} style={styles.crownIcon} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderGamePair = ({ item }: { item: Level[] }) => (
    <View style={styles.gamePairContainer}>
      {item.map((game, index) => (
        <View key={game.id} style={index === 0 ? styles.topGame : styles.bottomGame}>
          {renderGameItem({ item: game, index })}
        </View>
      ))}
    </View>
  );

  // Group levels into pairs for the two-row layout
  const groupedLevels = LEVELS.reduce((acc: Level[][], curr, i) => {
    if (i % 2 === 0) {
      acc.push([curr, LEVELS[i + 1]].filter(Boolean));
    }
    return acc;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
          <Image source={SettingsIcon} style={[styles.settingsIcon, { tintColor: '#3B82F6' }]} />
        </TouchableOpacity>
      </View>

      {renderDailyAndEventCards()}

      <FlatList
        data={groupedLevels}
        renderItem={renderGamePair}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gameListContainer}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + CARD_SPACING}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerSpacer: {
    width: 40,
  },
  settingsIcon: {
    width: 24,
    height: 24,
  },
  settingsButton: {
    padding: 8,
  },
  challengeContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  challengeCard: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
  },
  eventCard: {
    backgroundColor: '#8B5CF6',
  },
  challengeTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  challengeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeDate: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  calendarIcon: {
    width: 32,
    height: 32,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingLeft: 8,
    fontWeight: '500',
  },
  ghostIcon: {
    width: 24,
    height: 24,
  },
  gameListContainer: {
    paddingHorizontal: 16,
  },
  gamePairContainer: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
  },
  topGame: {
    marginBottom: CARD_SPACING / 2,
  },
  bottomGame: {
    marginTop: CARD_SPACING / 2,
  },
  levelCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  levelImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  completedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(90, 90, 90, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    width: 40,
    height: 40,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    width: 32,
    height: 32,
  },
  crownContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  crownIcon: {
    width: 20,
    height: 20,
  },
});

export default HomeScreen;