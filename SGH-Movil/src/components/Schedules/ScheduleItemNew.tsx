import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScheduleDTO } from '../../api/types/schedules';
import { styles } from '../../styles/schedulesStyles';

interface Props {
  schedule: ScheduleDTO;
  isCoordinatorView?: boolean;
  onPress?: () => void;
}

export default function ScheduleItemNew({ schedule, isCoordinatorView = false, onPress }: Props) {
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
    if (time.includes(':')) {
      return time;
    }
    return `${time}:00`;
  };

  const dayInfo = getDayInfo(schedule.day);

  return (
    <TouchableOpacity
      style={[styles.scheduleItemCard, { borderLeftColor: dayInfo.color }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Header con día y hora */}
      <View style={styles.scheduleItemHeader}>
        <View style={[styles.scheduleItemDayBadge, { backgroundColor: dayInfo.color }]}>
          <Text style={styles.scheduleItemDayBadgeText}>{dayInfo.short}</Text>
        </View>
        <View style={styles.scheduleItemTimeContainer}>
          <Ionicons name="time-outline" size={14} color={dayInfo.color} />
          <Text style={[styles.scheduleItemTime, { color: dayInfo.color }]}>
            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
          </Text>
        </View>
      </View>

      {/* Contenido principal */}
      <View style={styles.scheduleItemContent}>
        <Text style={styles.scheduleItemSubjectName}>{schedule.subjectName}</Text>

        <View style={styles.scheduleItemInfoRow}>
          <Ionicons name="person-outline" size={14} color="#64748b" />
          <Text style={styles.scheduleItemTeacherName}>{schedule.teacherName}</Text>
        </View>

        {schedule.courseName && (
          <View style={styles.scheduleItemInfoRow}>
            <Ionicons name="school-outline" size={14} color="#64748b" />
            <Text style={styles.scheduleItemCourseName}>{schedule.courseName}</Text>
          </View>
        )}
      </View>

      {/* Footer con estado */}
      <View style={styles.scheduleItemFooter}>
        <View style={styles.scheduleItemStatusContainer}>
          <View style={[styles.scheduleItemStatusDot, { backgroundColor: dayInfo.color }]} />
          <Text style={styles.scheduleItemStatusText}>Activo</Text>
        </View>
        {isCoordinatorView && (
          <Text style={[styles.scheduleItemId, { color: dayInfo.color }]}>
            #{schedule.id}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}