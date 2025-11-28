// screens/MainScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '@rneui/themed';

import HomeScreen from './HomeScreen';
import AddFoodScreen from './AddFoodScreen';
import ProgressScreen from './ProgressScreen';
import ProfileScreen from './ProfileScreen';

const primary = '#22d3b6';

const MainScreen = ({ navigation }) => {
  const [tab, setTab] = useState('home');

  let content = <HomeScreen navigation={navigation} />;
  if (tab === 'add') content = <AddFoodScreen />;
  if (tab === 'progress') content = <ProgressScreen />;
  if (tab === 'profile') content = <ProfileScreen navigation={navigation} />;

  const makeColor = (which) => (tab === which ? primary : '#9ca3af');

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>{content}</View>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tab} onPress={() => setTab('home')}>
          <Icon
            name="home-outline"
            type="ionicon"
            size={22}
            color={makeColor('home')}
          />
          <Text style={[styles.tabText, tab === 'home' && styles.activeTab]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={() => setTab('add')}>
          <View style={styles.centerButton}>
            <Icon name="add" type="ionicon" color="white" size={26} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setTab('progress')}
        >
          <Icon
            name="bar-chart-outline"
            type="ionicon"
            size={22}
            color={makeColor('progress')}
          />
          <Text
            style={[styles.tabText, tab === 'progress' && styles.activeTab]}
          >
            Progress
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setTab('profile')}
        >
          <Icon
            name="person-outline"
            type="ionicon"
            size={22}
            color={makeColor('profile')}
          />
          <Text
            style={[styles.tabText, tab === 'profile' && styles.activeTab]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  activeTab: {
    color: primary,
    fontWeight: '600',
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    shadowColor: primary,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.5,
    elevation: 4,
  },
});

export default MainScreen;
