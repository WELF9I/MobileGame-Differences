import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarStarIcon, ClockIcon, CubeIcon, LockIcon, SettingsIcon, TrophyIcon } from '../lib/images';
import { useNavigation } from '@react-navigation/native';
import { LEVELS } from '../config/levels';

// Sample game data
const gameData: Level[] = LEVELS;
import { Level } from '../types';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const currentDate = new Date();
  const day = currentDate.getDate();
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const month = months[currentDate.getMonth()];

  const renderGameItem = ({ item }: { item: Level }) => (
    <TouchableOpacity 
      style={[styles.levelCard, item.isLocked && styles.lockedLevel]}
      onPress={() => {
        if (!item.isLocked) {
          navigation.navigate('Game', { levelId: item.id });
        }
      }}
    >
      {item.isLocked ? (
        <Image source={LockIcon} style={styles.lockIcon} />
      ) : (
        <Image source={item.coverImage} style={styles.levelImage} />
      )}
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={TrophyIcon} style={styles.headerIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Image source={SettingsIcon} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.dailyChallenge}>
            <Text style={styles.challengeTitle}>DÉFI QUOTIDIEN</Text>
            <Text style={styles.challengeDate}>{`${day} ${month}`}</Text>
            <Image source={CalendarStarIcon} style={styles.calendarIcon} />
          </View>

          <View style={styles.eventCard}>
            <View>
              <Text style={styles.eventTitle}>Monde des jeux</Text>
              <View style={styles.timeContainer}>
                <Image source={ClockIcon} style={styles.clockIcon} />
                <Text style={styles.timeText}>1j 16h</Text>
              </View>
            </View>
            <Image source={CubeIcon} style={styles.cubeIcon} />
          </View>
        </View>

        <FlatList
          data={gameData}
          renderItem={renderGameItem}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gamesContainer}
        />
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    gap: 16,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: '#4A90E2',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  gamesContainer: {
    paddingVertical: 16,
    gap: 16,
  },
  levelCard: {
    width: 150,
    height: 150,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
  },
  section: {
    gap: 16,
    marginBottom: 24,
  },
  dailyChallenge: {
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  challengeTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  challengeDate: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  calendarIcon: {
    width: 32,
    height: 32,
    tintColor: '#FFF',
  },
  eventCard: {
    backgroundColor: '#E9ECFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clockIcon: {
    width: 16,
    height: 16,
    tintColor: '#666',
  },
  timeText: {
    color: '#666',
    fontSize: 14,
  },
  cubeIcon: {
    width: 48,
    height: 48,
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  levelImage: {
    width: '100%',
    height: '100%',
  },
  lockedLevel: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    width: 32,
    height: 32,
    tintColor: '#999',
  },
});