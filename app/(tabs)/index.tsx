import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { dailyContent } from '../data/dailyContent';

export default function HomeScreen() {
  const [lang, setLang] = useState<"english" | "hindi" | "kannada">("english");

  // Get today's index
  const today = new Date();
  const dayOfYear =
    Math.floor(
      (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
        Date.UTC(today.getFullYear(), 0, 0)) /
        (1000 * 60 * 60 * 24)
    );

  const index = dayOfYear % dailyContent.length;

  const content = dailyContent[index][lang];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Lingo</Text>

      <View style={styles.tabs}>
        {(["english", "hindi", "kannada"] as const).map(l => (
          <TouchableOpacity key={l} onPress={() => setLang(l)}>
            <Text style={[styles.tab, lang === l && styles.activeTab]}>
              {l.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Word</Text>
        <Text style={styles.word}>{content.word}</Text>
        <Text style={styles.pronunciation}>{content.pronunciation}</Text>
        <Text>{content.meaning}</Text>
        <Text style={styles.example}>{content.example}</Text>

        <Text style={styles.title}>Phrase</Text>
        <Text style={styles.word}>{content.phrase}</Text>
        <Text style={styles.pronunciation}>{content.phrasePronunciation}</Text>
        <Text>{content.phraseMeaning}</Text>
        <Text style={styles.example}>{content.phraseExample}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
    paddingTop: 60
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20
  },
  tab: {
    padding: 10,
    color: "#6B7280"
  },
  activeTab: {
    color: "#4F46E5",
    fontWeight: "bold"
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16
  },
  title: {
    marginTop: 10,
    fontWeight: "bold"
  },
  word: {
    fontSize: 20,
    fontWeight: "600"
  },
  pronunciation: {
    color: "#6B7280",
    marginBottom: 5
  },
  example: {
    fontStyle: "italic",
    marginBottom: 10
  }
});