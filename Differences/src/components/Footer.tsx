import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { HomeIcon, CalendarStarIcon } from '../lib/images';
import { useNavigation, useRoute } from '@react-navigation/native';

export const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const isHomeActive = route.name === 'Home';
  const isChallengesActive = route.name === 'Challenges';

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.footerItem}
        //@ts-ignore
        onPress={() => navigation.navigate('Home')}
      >
        <Image
          source={HomeIcon}
          style={[styles.icon, { tintColor: isHomeActive ? '#4A90E2' : '#999' }]}
        />
        <View style={styles.label}>
          <Text style={[styles.labelText, { color: isHomeActive ? '#4A90E2' : '#999' }]}>
            Accueil
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerItem}
        //@ts-ignore
        onPress={() => navigation.navigate('Challenges')}
      >
        <Image
          source={CalendarStarIcon}
          style={[styles.icon, { tintColor: isChallengesActive ? '#4A90E2' : '#999' }]}
        />
        <View style={styles.label}>
          <Text style={[styles.labelText, { color: isChallengesActive ? '#4A90E2' : '#999' }]}>
            Défis quotidiens
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerItem: {
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    marginTop: 4,
  },
  labelText: {
    fontSize: 12,
  },
});
