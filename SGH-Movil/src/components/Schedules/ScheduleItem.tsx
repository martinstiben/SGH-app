import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScheduleDTO } from '../../api/types/schedules';
import { styles } from '../../styles/scheduleItemStyles';

interface Props {
  schedule: ScheduleDTO;
}

export default function ScheduleItem({ schedule }: Props) {
  const getDayColor = (day: string) => {
    const colors = {
      'LUNES': '#3b82f6',
      'MARTES': '#10b981',
      'MIÉRCOLES': '#f59e0b',
      'JUEVES': '#ef4444',
      'VIERNES': '#8b5cf6',
      'SÁBADO': '#06b6d4',
      'DOMINGO': '#ec4899',
    };
    return colors[day as keyof typeof colors] || '#6b7280';
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderLeftColor: getDayColor(schedule.day),
          borderLeftWidth: 4,
        },
      ]}
    >
      {/* Header con día y hora */}
      <View style={styles.header}>
        <View style={styles.dayContainer}>
          <Text style={[styles.day, { color: getDayColor(schedule.day) }]}>
            {schedule.day}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.time}>
            {schedule.startTime} - {schedule.endTime}
          </Text>
        </View>
      </View>

      {/* Información principal */}
      <View style={styles.content}>
        <Text style={styles.subjectName}>
          📚 {schedule.subjectName}
        </Text>

        <Text style={styles.teacherName}>
          👨‍🏫 {schedule.teacherName}
        </Text>

        {schedule.courseName && (
          <Text style={styles.courseName}>
            🏫 {schedule.courseName}
          </Text>
        )}
      </View>

      {/* Footer con estado */}
      <View style={styles.footer}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getDayColor(schedule.day) }]} />
          <Text style={styles.statusText}>Activo</Text>
        </View>
      </View>
    </View>
  );
}