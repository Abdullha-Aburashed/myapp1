// screens/SignupScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import PrimaryButton from '../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const onSignup = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(cred.user, { displayName: fullName });

      // Automatically signed in → Next screen will load because App.js will detect completedProfile=false
      navigation.replace("SignupDetails");

    } catch (e) {
      Alert.alert("Signup Failed", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={26} color="#111" />
      </TouchableOpacity>

      <Text style={styles.title}>Create Your Account</Text>

      <TextInput style={styles.inp} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.inp} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={styles.inp} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

      <PrimaryButton title="Next" onPress={onSignup} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  title: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
  inp: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
});

export default SignupScreen;
