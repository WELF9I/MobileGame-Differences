import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ghostIcon } from '../lib/images';

export const ChallengesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={ghostIcon} 
          style={styles.icon}
        />
        <Text style={styles.title}>Fonctionnalité à venir !</Text>
        <Text style={styles.description}>
          Cette section n'est pas encore disponible. Nous travaillons dur pour vous apporter de nouveaux défis passionnants !
        </Text>
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>Bientôt disponible</Text>
        </View>
      </View>
      <Text style={styles.footer}>
        Revenez bientôt pour découvrir les nouveautés
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 24,
    tintColor: '#6C63FF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    maxWidth: '80%',
  },
  comingSoonBadge: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  comingSoonText: {
    color: '#4299E1',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
    paddingBottom: 24,
  },
});