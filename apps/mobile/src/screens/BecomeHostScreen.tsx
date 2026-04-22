import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { PrimaryButton, LoadingView } from '../components';
import { useCreateHostProfile } from '../hooks/useAuth';

export function BecomeHostScreen({ navigation }: any) {
  const [displayName, setDisplayName] = React.useState('');
  const [bio, setBio] = React.useState('');
  const createProfile = useCreateHostProfile();

  const handleCreateProfile = () => {
    if (!displayName.trim()) {
      alert('Please enter your display name');
      return;
    }

    createProfile.mutate(
      { displayName, bio },
      {
        onSuccess: () => {
          alert('Welcome to the host community!');
          navigation.navigate('HostDashboard');
        },
        onError: (error: any) => {
          alert(error?.response?.data?.message || 'Failed to create profile');
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Become a Host</Text>
          <Text style={styles.subtitle}>Share your passion for badminton</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Display Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., John's Badminton"
            value={displayName}
            onChangeText={setDisplayName}
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about yourself and your badminton passion"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
          />

          <PrimaryButton
            title="Create Host Profile"
            onPress={handleCreateProfile}
            loading={createProfile.isPending}
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
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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
  button: {
    marginTop: 24,
  },
});
