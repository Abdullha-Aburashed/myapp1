// screens/SettingsScreen.js
import React, { useContext } from "react";
import { View, Text, StyleSheet, Button, Switch } from "react-native";
import { MyContext } from "../MyContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen({ navigation }) {
  const { isDarkTheme, setIsDarkTheme } = useContext(MyContext);

  return (
    <SafeAreaView  style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Dark Theme</Text>
        <Switch
          value={isDarkTheme}
          onValueChange={(val) => setIsDarkTheme(val)}
        />
      </View>

      <Button title="Set Daily Goal" onPress={() => navigation.navigate("Goal")} />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between"
  },
  label: { fontSize: 18 }
});
