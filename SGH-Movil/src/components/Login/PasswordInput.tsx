import React, { memo } from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import { styles } from '../../styles/loginStyles';

// Preload images to ensure they appear immediately
const eyeVisible = require('../../assets/images/eye.png');
const eyeHidden = require('../../assets/images/eye-off.png');
const lockIcon = require('../../assets/images/lock.png');

interface PasswordInputProps {
  value: string;
  onChange: (text: string) => void;
  isVisible: boolean;
  onToggle: () => void;
  placeholder?: string;
}

function PasswordInputComponent({
  value,
  onChange,
  isVisible,
  onToggle,
  placeholder = "Tu contraseña"
}: PasswordInputProps) {
  return (
    <View style={styles.inputWrapper}>
      <Image
        source={lockIcon}
        style={styles.inputIcon}
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChange}
        secureTextEntry={!isVisible}
        autoCorrect={false}
        autoComplete="password"
        textContentType="password"
        returnKeyType="done"
      />
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        style={styles.eyeButton}
      >
        <Image
          source={isVisible ? eyeVisible : eyeHidden}
          style={styles.eyeIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

// memo evita renders innecesarios si las props no cambian
export const PasswordInput = memo(PasswordInputComponent);
