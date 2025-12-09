
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
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
  placeholder = 'Filtrar por cursos...'
}: SearchBarProps) {
  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchBarIconContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#94a3b8"
        />
      </View>

      <TextInput
        style={styles.searchBarInput}
        value={searchTerm}
        onChangeText={onSearchChange}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="default"
        returnKeyType="search"
        autoFocus={false}
      />

      {searchTerm.length > 0 && (
        <TouchableOpacity
          style={styles.searchBarClearButton}
          onPress={onClear}
        >
          <Ionicons name="close-circle" size={20} color="#94a3b8" />
        </TouchableOpacity>
      )}
    </View>
  );
}
