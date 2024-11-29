import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
} from 'react-native';
import { BrokenHeartIcon } from '../lib/images';

interface GameOverModalProps {
  visible: boolean;
  onRestart: () => void;
  onQuit: () => void;
  scale: Animated.Value;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  onRestart,
  onQuit,
  scale,
}) => (
  <Modal visible={visible} transparent animationType="none">
    <View style={styles.modalContainer}>
      <Animated.View
        style={[
          styles.gameOverCard,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <Text style={styles.gameOverTitle}>Plus de vie !</Text>
        <Image source={BrokenHeartIcon} style={styles.brokenHeartIcon} />
        <View style={styles.buttonContainer}>
          <TouchableWithoutFeedback onPress={onRestart}>
            <View style={[styles.button, styles.retryButton]}>
              <Text style={styles.buttonText}>Recommencer</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={onQuit}>
            <View style={[styles.button, styles.quitButton]}>
              <Text style={styles.buttonText}>Quitter</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Animated.View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
  },
  quitButton: {
    backgroundColor: '#FF5252',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  brokenHeartIcon: {
    width: 60,
    height: 60,
    marginBottom: 20,
    tintColor: '#FF5252',
  },
});