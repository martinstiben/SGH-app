import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScheduleDTO } from '../../api/types/schedules';
import { styles } from '../../styles/scheduleItemStyles';

interface Props {
  schedule: ScheduleDTO;
  isCoordinatorView?: boolean;
  onPress?: () => void;
}

export default function ScheduleItem({ schedule, isCoordinatorView = false, onPress }: Props) {
  const getDayInfo = (day: string) => {
    const dayData = {
      'LUNES': { color: '#3b82f6', short: 'Lun', full: 'Lunes' },
      'MARTES': { color: '#10b981', short: 'Mar', full: 'Martes' },
      'MIÉRCOLES': { color: '#f59e0b', short: 'Mié', full: 'Miércoles' },
      'JUEVES': { color: '#ef4444', short: 'Jue', full: 'Jueves' },
      'VIERNES': { color: '#8b5cf6', short: 'Vie', full: 'Viernes' },
      'SÁBADO': { color: '#06b6d4', short: 'Sáb', full: 'Sábado' },
      'DOMINGO': { color: '#ec4899', short: 'Dom', full: 'Domingo' },
    };
    return dayData[day as keyof typeof dayData] || { color: '#6b7280', short: day, full: day };
  };

  const formatTime = (time: string) => {
    // Asegurar formato HH:mm consistente
    if (time.includes(':')) {
      return time;
    }
    // Si solo tiene HH, agregar :00
    return `${time}:00`;
  };

  if (isCoordinatorView) {
    // Vista de carta para coordinadores
    return (
      <TouchableOpacity
        style={[
          styles.card,
          styles.cardGlow,
          {
            borderLeftColor: getDayInfo(schedule.day).color,
            borderLeftWidth: 4,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {/* Header con día y hora */}
        <View style={styles.header}>
          <View style={[styles.dayBadge, { backgroundColor: getDayInfo(schedule.day).color }]}>
            <Text style={styles.dayBadgeText}>
              {getDayInfo(schedule.day).short}
            </Text>
          </View>
          <View style={styles.timeContainer}>
            <Ionicons name="time-outline" size={16} color="#64748b" />
            <Text style={styles.time}>
              {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
            </Text>
          </View>
        </View>

        {/* Información principal */}
        <View style={styles.content}>
          <Text style={styles.subjectName}>
            {schedule.subjectName}
          </Text>

          <View style={styles.infoRowWithIcon}>
            <Ionicons name="person-outline" size={16} color="#64748b" />
            <Text style={styles.teacherName}>
              {schedule.teacherName}
            </Text>
          </View>
  
            {schedule.courseName && (
              <View style={styles.infoRowWithIcon}>
                <Ionicons name="school-outline" size={16} color="#64748b" />
                <Text style={styles.courseName}>
                  {schedule.courseName}
                </Text>
              </View>
            )}
        </View>

        {/* Información adicional para coordinadores */}
        <View style={styles.coordinatorInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID:</Text>
            <Text style={styles.infoValue}>#{schedule.id}</Text>
          </View>
        </View>

        {/* Footer con estado */}
        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getDayInfo(schedule.day).color }]} />
            <Text style={styles.statusText}>Activo</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
        </View>
      </TouchableOpacity>
    );
  }

  // Vista para profesores/estudiantes
  return (
    <TouchableOpacity
      style={[
        styles.card,
        styles.cardGlow,
        {
          borderLeftColor: getDayInfo(schedule.day).color,
          borderLeftWidth: 4,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header con día y hora */}
      <View style={styles.header}>
        <View style={[styles.dayBadge, { backgroundColor: getDayInfo(schedule.day).color }]}>
          <Text style={styles.dayBadgeText}>
            {getDayInfo(schedule.day).short}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={16} color="#64748b" />
          <Text style={styles.time}>
            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
          </Text>
        </View>
      </View>

      {/* Información principal */}
      <View style={styles.content}>
        <Text style={styles.subjectName}>
          {schedule.subjectName}
        </Text>

        <View style={styles.infoRowWithIcon}>
          <Ionicons name="person-outline" size={16} color="#64748b" />
          <Text style={styles.teacherName}>
            {schedule.teacherName}
          </Text>
        </View>

        {schedule.courseName && (
          <View style={styles.infoRowWithIcon}>
            <Ionicons name="school-outline" size={16} color="#64748b" />
            <Text style={styles.courseName}>
              {schedule.courseName}
            </Text>
          </View>
        )}
      </View>

      {/* Footer con estado */}
      <View style={styles.footer}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getDayInfo(schedule.day).color }]} />
          <Text style={styles.statusText}>Activo</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
      </View>
    </TouchableOpacity>
  );
}