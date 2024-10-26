import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LEVELS } from '../config/levels';
import { GameProgress, StorageService } from '../utils/storage';
import { 
  CalendarStarIcon, 
  ClockIcon, 
  CubeIcon, 
  HomeIcon, 
  LockIcon, 
  CompletedIcon,
  SettingsIcon, 
  TrophyIcon,
  CheckIcon,
  ghostIcon,
  KeyIcon
} from '../lib/images';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Level } from '../types';

const HomeScreen = () => {
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

  const renderDailyChallenge = () => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const month = months[currentDate.getMonth()];
    
    return (
      <TouchableOpacity
        style={styles.challengeCard}
        activeOpacity={0.8}
      >
        <Text style={styles.challengeTitle}>DÉFI QUOTIDIEN</Text>
        <View style={styles.challengeContent}>
          <Text style={styles.challengeDate}>{`${day} ${month}`}</Text>
          <Image 
            source={CalendarStarIcon}
            style={styles.calendarIcon}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEventCard = () => (
    <TouchableOpacity
      style={[styles.challengeCard, styles.eventCard]}
      activeOpacity={0.8}
    >
      <Text style={styles.challengeTitle}>ÉVÈNEMENT</Text>
      <View style={styles.challengeContent}>
        <Text style={styles.challengeDate}>Halloween</Text>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>9j 14h</Text>
          <Image 
            source={ghostIcon} 
            style={styles.ghostIcon}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderLevelCard = (level: Level) => {
    const isUnlocked = gameProgress?.unlockedLevels.includes(level.id);
    const isCompleted = gameProgress?.completedLevels.includes(level.id);

    return (
      <TouchableOpacity
        key={level.id}
        style={styles.levelCard}
        activeOpacity={0.8}
        disabled={!isUnlocked}
        onPress={() => {
          if (isUnlocked) {
            //@ts-ignore
            navigation.navigate('Game', { levelId: level.id });
          }
        }}
      >
        <Image source={level.coverImage} style={styles.levelImage} />
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
            <Image source={SettingsIcon} style={[styles.settingsIcon, { tintColor: '#3B82F6' }]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.challengeContainer}>
          {renderDailyChallenge()}
          {renderEventCard()}
        </View>

        <View style={styles.levelsGrid}>
          {LEVELS.map(level => renderLevelCard(level))}
        </View>

        <TouchableOpacity style={styles.getKeysButton}>
          <Text style={styles.getKeysText}>Obtenir plus de clés</Text>
          <Image source={KeyIcon} style={styles.keyIcon} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerSpacer: {
    width: 40, // Same width as settings button for balance
  },
  trophyIcon: {
    width: 24,
    height: 24,
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
    justifyContent: 'flex-end',
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
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
    justifyContent: 'center',
  },
  levelCard: {
    width: '45%',
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
  getKeysButton: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  getKeysText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  keyIcon: {
    width: 20,
    height: 20,
  },
});