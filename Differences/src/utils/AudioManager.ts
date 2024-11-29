import Sound from 'react-native-sound';
import { StorageService } from './storage';

class AudioManager {
  private static instance: AudioManager;
  private backgroundMusic: Sound | null = null;
  private tapSound: Sound | null = null;
  private isMusicEnabled: boolean = false;
  private isSoundEnabled: boolean = false;

  private constructor() {
    Sound.setCategory('Playback');
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async initialize() {
    try {
      const settings = await StorageService.getUserSettings();
      this.isMusicEnabled = settings.musicEnabled;
      this.isSoundEnabled = settings.soundEnabled;

      // Initialize background music
      this.backgroundMusic = new Sound(require('../lib/music.mp3'), (error) => {
        if (error) {
          console.error('Failed to load background music:', error);
          return;
        }
        if (this.backgroundMusic) {
          this.backgroundMusic.setNumberOfLoops(-1);
          if (this.isMusicEnabled) {
            this.playBackgroundMusic();
          }
        }
      });

      // Initialize tap sound
      this.tapSound = new Sound(require('../lib/tap-sound.mp3'), (error) => {
        if (error) {
          console.error('Failed to load tap sound:', error);
        }
      });
    } catch (error) {
      console.error('Error initializing AudioManager:', error);
    }
  }

  playBackgroundMusic() {
    if (this.isMusicEnabled && this.backgroundMusic) {
      this.backgroundMusic.play((success) => {
        if (!success) {
          console.error('Background music playback failed');
        }
      });
    }
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.stop();
    }
  }

  playTapSound() {
    if (this.isSoundEnabled && this.tapSound) {
      this.tapSound.stop(() => {
        this.tapSound?.play();
      });
    }
  }

  setMusicEnabled(enabled: boolean) {
    this.isMusicEnabled = enabled;
    if (enabled) {
      this.playBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.isSoundEnabled = enabled;
  }

  cleanup() {
    if (this.backgroundMusic) {
      this.backgroundMusic.release();
    }
    if (this.tapSound) {
      this.tapSound.release();
    }
  }
}

export default AudioManager;