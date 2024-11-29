import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface ExitGameModalProps {
  visible: boolean;
  onContinue: () => void;
  onExit: () => void;
}

export const ExitGameModal: React.FC<ExitGameModalProps> = ({
  visible,
  onContinue,
  onExit,
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Confirmer ?</Text>
        <Text style={styles.message}>
          Quitter le niveau ? Toute progression sera perdue.
        </Text>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={onContinue}
        >
          <Text style={styles.continueButtonText}>Continuer à jouer</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.exitButton}
          onPress={onExit}
        >
          <Text style={styles.exitButtonText}>Quitter le niveau</Text>
        </TouchableOpacity>
      </View>
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
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    marginBottom: 12,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  exitButton: {
    paddingVertical: 12,
  },
  exitButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});