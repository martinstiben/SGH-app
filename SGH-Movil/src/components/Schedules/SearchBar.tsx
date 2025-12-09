import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/schedulesStyles';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  onClear,
  placeholder = 'Buscar horarios...'
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.searchBarContainer, isFocused && styles.searchBarContainerFocused]}>
      <View style={styles.searchBarIconContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={isFocused ? '#3b82f6' : '#94a3b8'}
        />
      </View>

      <TextInput
        style={styles.searchBarInput}
        value={searchTerm}
        onChangeText={onSearchChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {searchTerm.length > 0 && (
        <TouchableOpacity
          style={styles.searchBarClearButton}
          onPress={onClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-circle" size={20} color="#94a3b8" />
        </TouchableOpacity>
      )}
    </View>
  );
}
