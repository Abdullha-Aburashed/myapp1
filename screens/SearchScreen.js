// screens/SearchScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_KEY = "QzHYE6swWu45ITYJAifAIA==S4Xf8p0o2hUqbVTz";

export default function SearchScreen({ navigation }) {

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  function searchFood() {
    fetch(`https://api.api-ninjas.com/v1/nutrition?query=${search}`, {
      headers: { "X-Api-Key": API_KEY }
    })
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => console.log(err));
  }

  return (
    <SafeAreaView  style={{ flex: 1, padding: 10 }}>
      <TextInput
        style={styles.input}
        placeholder="Search food (e.g. 1 apple)"
        onChangeText={setSearch}
      />
      <Button title="Search" onPress={searchFood} />

      <FlatList
        data={results}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Name: {item.name}</Text>
            <Text>Calories: {item.calories}</Text>
            <Button
              title="Log This Food"
              onPress={() => navigation.navigate("Log", { food: item })}
            />
          </View>
        )}
      />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, padding: 8, marginVertical: 10 },
  card: { borderWidth: 1, padding: 10, marginTop: 10 }
});
