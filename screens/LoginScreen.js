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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import PrimaryButton from '../components/PrimaryButton';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      Alert.alert('Login failed', e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>&lt;</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Log In</Text>
      <Text style={styles.subtitle}>Welcome back! Stay on track.</Text>

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

      <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
        <Text style={{ color: '#22d3b6', fontSize: 12 }}>Forgot password?</Text>
      </View>

      <PrimaryButton title="Sign In" onPress={handleLogin} />
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

export default LoginScreen;
