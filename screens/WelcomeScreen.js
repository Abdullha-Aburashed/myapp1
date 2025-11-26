import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }} />

      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🍏</Text>
        </View>
      </View>

      <Text style={styles.title}>
        Welcome to <Text style={styles.titleAccent}>NutriTrack</Text>
      </Text>
      <Text style={styles.subtitle}>
        Track food, calories, and health goals easily. Start your journey today.
      </Text>

      <View style={{ flex: 1 }} />

      <PrimaryButton
        title="Get Started"
        onPress={() => navigation.navigate('Signup')}
        style={{ marginHorizontal: 24 }}
      />

      <Text style={styles.footerText}>
        Already have an account?{' '}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Login')}
        >
          Log In
        </Text>
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#e0fdf7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#111827',
  },
  titleAccent: {
    color: '#22d3b6',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    paddingHorizontal: 8,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    color: '#6b7280',
  },
  link: {
    color: '#22d3b6',
    fontWeight: '600',
  },
});

export default WelcomeScreen;
