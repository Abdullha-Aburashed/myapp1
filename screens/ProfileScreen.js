// screens/ProfileScreen.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { MyContext } from '../MyContext';
import PrimaryButton from '../components/PrimaryButton';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, profilePhoto, setProfilePhoto } = useContext(MyContext);

  const pickImage = async () => {
    // Ask for permission
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
setProfilePhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatar} onPress={pickImage}>
          {profilePhoto ? (
            <Image
              source={{ uri: profilePhoto }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          ) : (
            <Text style={{ fontSize: 32 }}>🙂</Text>
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={16} color="white" />
          </View>
        </TouchableOpacity>

        <Text style={styles.name}>{user?.displayName || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.link}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('Goals')}
        >
          <Text style={styles.rowText}>Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('Help')}
        >
          <Text style={styles.rowText}>Help & Contact Us</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 24 }}>
        <PrimaryButton title="Log Out" onPress={logout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    backgroundColor: '#22d3b6',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0f766e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { color: 'white', fontWeight: '700', fontSize: 18 },
  email: { color: 'white', opacity: 0.9, marginBottom: 8 },
  link: { color: 'white', textDecorationLine: 'underline', fontSize: 12 },
  section: {
    marginTop: 24,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  rowText: { fontSize: 15 },
});

export default ProfileScreen;
