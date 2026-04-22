import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { PrimaryButton, LoadingView } from '../components';
import { useCreateSession, useVenuesList } from '../hooks/useSession';
import { SKILL_LEVELS } from '@sport-match/shared';

export function CreateSessionScreen({ navigation }: any) {
  const [title, setTitle] = React.useState('');
  const [venueId, setVenueId] = React.useState('');
  const [date, setDate] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [skillLevel, setSkillLevel] = React.useState('beginner');
  const [maxPlayers, setMaxPlayers] = React.useState('16');
  const [description, setDescription] = React.useState('');
  const [priceLabel, setPriceLabel] = React.useState('');

  const createSession = useCreateSession();
  const { data: venuesData, isLoading: venuesLoading } = useVenuesList();

  const handleCreate = async () => {
    if (!title.trim() || !venueId || !date || !startTime || !endTime) {
      alert('Please fill in all required fields');
      return;
    }

    createSession.mutate(
      {
        venueId,
        title,
        date,
        startTime,
        endTime,
        skillLevel,
        maxPlayers: parseInt(maxPlayers, 10),
        description,
        priceLabel,
      },
      {
        onSuccess: () => {
          alert('Session created successfully!');
          navigation.goBack();
        },
        onError: (error: any) => {
          alert(error?.response?.data?.message || 'Failed to create session');
        },
      },
    );
  };

  if (venuesLoading) {
    return <LoadingView message="Loading venues..." />;
  }

  const venues = venuesData?.venues || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Session</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Session Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Monday Evening Badminton"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Venue *</Text>
          <View style={styles.selectContainer}>
            <Text style={styles.selectLabel}>
              {venues.find((v) => v.id === venueId)?.name || 'Select venue'}
            </Text>
          </View>

          <Text style={styles.label}>Date (YYYY-MM-DD) *</Text>
          <TextInput
            style={styles.input}
            placeholder="2024-01-15"
            value={date}
            onChangeText={setDate}
          />

          <Text style={styles.label}>Start Time (HH:mm) *</Text>
          <TextInput
            style={styles.input}
            placeholder="18:00"
            value={startTime}
            onChangeText={setStartTime}
          />

          <Text style={styles.label}>End Time (HH:mm) *</Text>
          <TextInput
            style={styles.input}
            placeholder="20:00"
            value={endTime}
            onChangeText={setEndTime}
          />

          <Text style={styles.label}>Skill Level *</Text>
          <View style={styles.chipsContainer}>
            {Object.values(SKILL_LEVELS).map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.chip,
                  skillLevel === level && styles.chipSelected,
                ]}
                onPress={() => setSkillLevel(level)}
              >
                <Text
                  style={[
                    styles.chipText,
                    skillLevel === level && styles.chipTextSelected,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Max Players *</Text>
          <TextInput
            style={styles.input}
            placeholder="16"
            value={maxPlayers}
            onChangeText={setMaxPlayers}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add any details about the session"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Price Label</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 50,000 VND"
            value={priceLabel}
            onChangeText={setPriceLabel}
          />

          <PrimaryButton
            title="Create Session"
            onPress={handleCreate}
            loading={createSession.isPending}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  selectLabel: {
    fontSize: 14,
    color: '#333',
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  chipSelected: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  chipText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#fff',
  },
  button: {
    marginTop: 24,
    marginBottom: 8,
  },
});
