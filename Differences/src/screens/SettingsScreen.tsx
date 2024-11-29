import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Switch, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StorageService, UserSettings } from '../utils/storage';
import { LinearGradient } from 'react-native-linear-gradient';

// Import audio files
const backgroundMusicFile = require('../lib/music.mp3');
const tapSoundEffectFile = require('../lib/tap-sound.mp3');

// Move SettingLinkProps interface to the top
interface SettingLinkProps {
  iconName: string;
  text: string;
  description: string;
  color: string;
  onPress: () => void;  // Add onPress prop
}

// Define SettingLink component before the main component
const SettingLink = ({ iconName, text, description, color, onPress }: SettingLinkProps) => (
  <TouchableOpacity 
    style={styles.settingItem}
    onPress={onPress}
  >
    <View style={styles.iconTextContainer}>
      <Icon name={iconName} size={24} color={color} />
      <View>
        <Text style={styles.itemText}>{text}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
    </View>
    <Icon name="chevron-forward" size={24} color="#C7C7CC" />
  </TouchableOpacity>
);

// Configure Sound
Sound.setCategory('Playback');

// Initialize sound instances
let backgroundMusic: Sound | null = null;
let tapSound: Sound | null = null;

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [settings, setSettings] = useState<UserSettings>({
    soundEnabled: true,
    musicEnabled: true,
    language: 'fr'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
    initializeAudio();
    
    return () => {
      cleanupAudio();
    };
  }, []);

  const initializeAudio = () => {
    // Initialize background music
    backgroundMusic = new Sound(backgroundMusicFile, (error) => {
      if (error) {
        console.error('Failed to load background music:', error);
        return;
      }
      if (backgroundMusic) {
        backgroundMusic.setNumberOfLoops(-1);
        if (settings.musicEnabled) {
          backgroundMusic.play((success) => {
            if (!success) {
              console.error('Background music playback failed');
            }
          });
        }
      }
    });

    // Initialize tap sound
    tapSound = new Sound(tapSoundEffectFile, (error) => {
      if (error) {
        console.error('Failed to load tap sound:', error);
        return;
      }
    });
  };

  const cleanupAudio = () => {
    if (backgroundMusic) {
      backgroundMusic.release();
    }
    if (tapSound) {
      tapSound.release();
    }
  };

  const playTapSound = () => {
    if (settings.soundEnabled && tapSound) {
      tapSound.stop(() => {
        tapSound?.play((success) => {
          if (!success) {
            console.error('Tap sound playback failed');
          }
        });
      });
    }
  };

  const loadSettings = async () => {
    try {
      const savedSettings = await StorageService.getUserSettings();
      setSettings(savedSettings);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Error', 'Failed to load settings');
    }
  };

  const handleMusicToggle = async () => {
    const newMusicEnabled = !settings.musicEnabled;
    setSettings(prev => ({ ...prev, musicEnabled: newMusicEnabled }));
    
    if (newMusicEnabled) {
      backgroundMusic?.play();
    } else {
      backgroundMusic?.pause();
    }

    // Save the current music position
    if (backgroundMusic) {
      backgroundMusic.getCurrentTime((seconds) => {
        StorageService.saveAudioState({ lastMusicPosition: seconds });
      });
    }
  };

  const handleSoundToggle = () => {
    const newSoundEnabled = !settings.soundEnabled;
    setSettings(prev => ({ ...prev, soundEnabled: newSoundEnabled }));
    
    // Play test sound when enabling
    if (newSoundEnabled) {
      playTapSound();
    }
  };

  const handleDone = async () => {
    playTapSound();
    try {
      await StorageService.updateUserSettings(settings);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading settings...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradientHeader}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Paramètres</Text>
          <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
            <Text style={styles.doneText}>Terminé</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} bounces={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.iconTextContainer}>
              <Icon name="musical-notes" size={24} color="#FF9500" />
              <View>
                <Text style={styles.itemText}>Musique</Text>
                <Text style={styles.itemDescription}>Musique de fond du jeu</Text>
              </View>
            </View>
            <Switch
              value={settings.musicEnabled}
              onValueChange={handleMusicToggle}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.musicEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.iconTextContainer}>
              <Icon name="volume-high" size={24} color="#4CD964" />
              <View>
                <Text style={styles.itemText}>Effets sonores</Text>
                <Text style={styles.itemDescription}>Sons des actions du jeu</Text>
              </View>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={handleSoundToggle}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={settings.soundEnabled ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aide & Information</Text>
          
          <SettingLink 
            iconName="help-circle" 
            text="Aide" 
            description="Obtenir de l'aide sur le jeu"
            color="#4CD964"
            onPress={playTapSound}
          />
          <SettingLink 
            iconName="school" 
            text="Comment jouer" 
            description="Tutoriel et règles du jeu"
            color="#FF9500"
            onPress={playTapSound}
          />
          <SettingLink 
            iconName="information-circle" 
            text="À propos du jeu" 
            description="Informations sur la version"
            color="#007AFF"
            onPress={playTapSound}
          />
          <SettingLink 
            iconName="shield-checkmark" 
            text="Confidentialité" 
            description="Gestion des données personnelles"
            color="#FF2D55"
            onPress={playTapSound}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ by WELF9I</Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientHeader: {
    paddingTop: Platform.OS === 'ios' ? 0 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  doneButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  doneText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C6C6C8',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemText: {
    marginLeft: 12,
    fontSize: 17,
    color: '#000000',
    fontWeight: '500',
  },
  itemDescription: {
    marginLeft: 12,
    fontSize: 13,
    color: '#8E8E93',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C6C6C8',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#C7C7CC',
  },
});

export default SettingsScreen;