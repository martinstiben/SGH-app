import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Modal from 'react-native-modal';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  onRegistrationSuccess?: () => void;
  isRegistrationSuccess?: boolean;
}

export default function CustomAlert({
  visible,
  title,
  message,
  type = 'info',
  onClose,
  onRegistrationSuccess,
  isRegistrationSuccess = false
}: Props) {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          iconColor: '#10b981',
          borderColor: '#d1fae5',
          backgroundColor: '#ecfdf5',
          icon: '✓',
        };
      case 'error':
        return {
          iconColor: '#ef4444',
          borderColor: '#fee2e2',
          backgroundColor: '#fef2f2',
          icon: '✕',
        };
      default:
        return {
          iconColor: '#3b82f6',
          borderColor: '#dbeafe',
          backgroundColor: '#eff6ff',
          icon: 'ℹ',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Modal
      isVisible={visible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.4}
      backdropColor="#1e293b"
    >
      <View style={styles.container}>
        {/* Icon Circle */}
        <View style={[styles.iconCircle, { backgroundColor: typeStyles.backgroundColor, borderColor: typeStyles.borderColor }]}>
          <Text style={[styles.iconText, { color: typeStyles.iconColor }]}>{typeStyles.icon}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>
        
        {/* Message */}
        <Text style={styles.message}>{message}</Text>

        {/* Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: typeStyles.iconColor }]}
          onPress={() => {
            if (isRegistrationSuccess && onRegistrationSuccess) {
              onRegistrationSuccess();
            } else {
              onClose();
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isRegistrationSuccess ? 'Continuar' : 'Entendido'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#1e40af',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    marginHorizontal: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
  },
  iconText: {
    fontSize: 28,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
