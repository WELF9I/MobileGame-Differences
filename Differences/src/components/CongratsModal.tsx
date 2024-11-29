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
import { NavigationProp } from '@react-navigation/native';

interface CongratsModalProps {
  visible: boolean;
  level: {
    id: number;
    originalImage: any;
    differences: any[];
  } | null;
  navigation: NavigationProp<any>;
  congratsScale: Animated.Value;
  progressBarWidth: Animated.Value;
  foundDifferences: any[];
}

export const CongratsModal: React.FC<CongratsModalProps> = ({
  visible,
  level,
  navigation,
  congratsScale,
  progressBarWidth,
  foundDifferences,
}) => {
  if (!level) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.congratsCard,
            {
              transform: [{ scale: congratsScale }],
            },
          ]}
        >
          <Text style={styles.congratsTitle}>Félicitations !</Text>
          <View style={styles.levelPreview}>
            <Image source={level.originalImage} style={styles.previewImage} />
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressBarWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' as never }],
              });
            }}
          >
            <View style={styles.continueButton}>
              <Text style={styles.continueButtonText}>Continuer</Text>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  congratsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  congratsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  levelPreview: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});