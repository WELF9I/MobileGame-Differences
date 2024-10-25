import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const SettingsScreen = () => {
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
        <TouchableOpacity>
          <Text style={styles.doneText}>Terminé</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingItem}>
        <View style={styles.iconTextContainer}>
          <Icon name="musical-notes" size={24} color="#FF9500" />
          <Text style={styles.itemText}>Musique</Text>
        </View>
        <Switch
          value={isMusicEnabled}
          onValueChange={() => setIsMusicEnabled(!isMusicEnabled)}
        />
      </View>

      <View style={styles.separator} />

      <SettingLink iconName="help-circle" text="Aide" color="#4CD964" />
      <SettingLink iconName="school" text="Comment jouer" color="#FF9500" />
      <SettingLink iconName="information-circle" text="À propos du jeu" color="#007AFF" />
      <SettingLink iconName="document-text" text="Droits relatifs à la vie privée" color="#5AC8FA" />
      <SettingLink iconName="person" text="Préférences de confidentialité" color="#007AFF" />
    </ScrollView>
  );
};

interface SettingLinkProps {
  iconName: string;
  text: string;
  color: string;
}

const SettingLink = ({ iconName, text, color }: SettingLinkProps) => (
  <TouchableOpacity style={styles.settingItem}>
    <View style={styles.iconTextContainer}>
      <Icon name={iconName} size={24} color={color} />
      <Text style={styles.itemText}>{text}</Text>
    </View>
    <Icon name="chevron-forward" size={24} color="#C7C7CC" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  doneText: {
    fontSize: 16,
    color: '#007AFF',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CED0CE',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    marginLeft: 12,
    fontSize: 16,
  },
  separator: {
    height: 20,
    backgroundColor: '#F2F2F7',
  },
});

export default SettingsScreen;