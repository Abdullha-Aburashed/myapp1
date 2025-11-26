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

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      if (fullName) {
        await updateProfile(cred.user, { displayName: fullName });
      }
      // user is automatically logged in by Firebase
    } catch (e) {
      Alert.alert('Sign up failed', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>&lt;</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Create Your Account</Text>
      <Text style={styles.subtitle}>Sign up to start your healthy journey.</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <PrimaryButton title="Sign Up" onPress={handleSignup} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: 'white',
  },
  back: {
    fontSize: 24,
    color: '#111827',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 4,
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: 24,
  },
  inputWrapper: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  input: { fontSize: 15 },
});

export default SignupScreen;
