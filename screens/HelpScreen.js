// screens/HelpScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const primary = "#22d3b6";

const HelpScreen = () => {
  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="help-circle-outline" size={60} color="white" />
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>
          We're here to assist you anytime.
        </Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Contact Information</Text>

        <TouchableOpacity
          style={styles.row}
         
        >
          <Ionicons name="mail-outline" size={22} color={primary} />
          <Text style={styles.rowText}>support@nutritrack.com</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
         
        >
          <Ionicons name="call-outline" size={22} color={primary} />
          <Text style={styles.rowText}>+974 5555 5555</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.row}
        >
          <Ionicons name="globe-outline" size={22} color={primary} />
          <Text style={styles.rowText}>www.nutritrack.com</Text>
        </TouchableOpacity>
      </View>

      {/* FAQ */}
      <View style={styles.card}>
        <Text style={styles.title}>Frequently Asked Questions</Text>

        <View style={styles.faqItem}>
          <Text style={styles.question}>How do I add food?</Text>
          <Text style={styles.answer}>
            Go to the Add tab (+), search for a food, choose quantity or grams,
            then press “Add to Log”.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>How do I edit or delete food?</Text>
          <Text style={styles.answer}>
            Tap on any food in Today’s Foods to edit values. or choose delete to remove the log
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>How do I update my goals?</Text>
          <Text style={styles.answer}>
            Open Profile → Goals. Set your daily calorie and macro targets.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>Is my data saved?</Text>
          <Text style={styles.answer}>
            Yes, NutriTrack securely stores your food logs and profile data in
            Firebase Cloud Firestore.
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>NutriTrack © 2025</Text>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  header: {
    backgroundColor: primary,
    paddingVertical: 40,
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 20,
    shadowColor: primary,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginTop: 10,
  },
  headerSubtitle: {
    color: "#e0fdfa",
    marginTop: 4,
    fontSize: 13,
  },

  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 18,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
    color: "#111827",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  rowText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#111827",
  },

  faqItem: {
    marginBottom: 12,
  },
  question: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  answer: {
    fontSize: 13,
    color: "#6b7280",
    lineHeight: 18,
  },

  footer: {
    textAlign: "center",
    color: "#9ca3af",
    marginVertical: 20,
    fontSize: 12,
  },
});

export default HelpScreen;
