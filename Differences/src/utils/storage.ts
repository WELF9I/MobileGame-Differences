import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  GAME_PROGRESS: 'game_progress',
  USER_SETTINGS: 'user_settings',
};

export interface GameProgress {
  unlockedLevels: number[];
  completedLevels: number[];
  lastPlayedLevel?: number;
}

export interface UserSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  language: string;
}

const defaultGameProgress: GameProgress = {
  unlockedLevels: [1], // Only first level unlocked by default
  completedLevels: [],
};

const defaultUserSettings: UserSettings = {
  soundEnabled: true,
  musicEnabled: true,
  language: 'fr',
};

export const StorageService = {
  async initializeStorage() {
    try {
      const existingProgress = await AsyncStorage.getItem(STORAGE_KEYS.GAME_PROGRESS);
      const existingSettings = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);

      if (!existingProgress) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.GAME_PROGRESS,
          JSON.stringify(defaultGameProgress)
        );
      }

      if (!existingSettings) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_SETTINGS,
          JSON.stringify(defaultUserSettings)
        );
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  },

  async getGameProgress(): Promise<GameProgress> {
    try {
      const progress = await AsyncStorage.getItem(STORAGE_KEYS.GAME_PROGRESS);
      return progress ? JSON.parse(progress) : defaultGameProgress;
    } catch (error) {
      console.error('Error getting game progress:', error);
      return defaultGameProgress;
    }
  },

  async updateGameProgress(progress: Partial<GameProgress>) {
    try {
      const currentProgress = await this.getGameProgress();
      const updatedProgress = { ...currentProgress, ...progress };
      await AsyncStorage.setItem(
        STORAGE_KEYS.GAME_PROGRESS,
        JSON.stringify(updatedProgress)
      );
    } catch (error) {
      console.error('Error updating game progress:', error);
    }
  },

  async unlockNextLevel(completedLevelId: number) {
    try {
      const progress = await this.getGameProgress();
      const nextLevelId = completedLevelId + 1;
      
      // Add completed level to completedLevels if not already there
      if (!progress.completedLevels.includes(completedLevelId)) {
        progress.completedLevels = [...progress.completedLevels, completedLevelId];
      }
  
      // Unlock next level if not already unlocked
      if (!progress.unlockedLevels.includes(nextLevelId)) {
        progress.unlockedLevels = [...progress.unlockedLevels, nextLevelId];
      }
  
      // Save the updated progress immediately
      await AsyncStorage.setItem(
        STORAGE_KEYS.GAME_PROGRESS,
        JSON.stringify(progress)
      );
      
      return progress;
    } catch (error) {
      console.error('Error unlocking next level:', error);
      throw error;
    }
  },

  async getUserSettings(): Promise<UserSettings> {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      return settings ? JSON.parse(settings) : defaultUserSettings;
    } catch (error) {
      console.error('Error getting user settings:', error);
      return defaultUserSettings;
    }
  },

  async updateUserSettings(settings: Partial<UserSettings>) {
    try {
      const currentSettings = await this.getUserSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_SETTINGS,
        JSON.stringify(updatedSettings)
      );
    } catch (error) {
      console.error('Error updating user settings:', error);
    }
  },
};