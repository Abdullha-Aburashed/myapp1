// screens/EditProfileScreen.js
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { MyContext } from '../MyContext';
import PrimaryButton from '../components/PrimaryButton';

const EditProfileScreen = ({ navigation }) => {
  const { user, setUser } = useContext(MyContext);
  const [name, setName] = useState(user?.displayName || '');

  const save = async () => {
    try {
      if (!auth.currentUser) return;
      await updateProfile(auth.currentUser, { displayName: name });
      // refresh in context so UI updates
      setUser({ ...auth.currentUser });
      Alert.alert('Profile updated', 'Your name has been saved.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        style={styles.input}
      />

      <Text style={[styles.label, { marginTop: 16 }]}>Email</Text>
      <TextInput
        value={user?.email || ''}
        editable={false}
        style={[styles.input, { backgroundColor: '#e5e7eb' }]}
      />

      <PrimaryButton title="Save" onPress={save} style={{ marginTop: 24 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24 },
  label: { fontSize: 13, color: '#6b7280', marginBottom: 4 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9fafb',
  },
});

export default EditProfileScreen;
