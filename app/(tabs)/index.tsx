import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import { dailyContent } from '../data/dailyContent';

const LANG_CODES: Record<string, string> = {
  english: "en",
  hindi: "hi",
  kannada: "kn",
};

function speak(text: string, lang: string) {
  Speech.stop();
  Speech.speak(text, { language: LANG_CODES[lang] ?? "en", rate: 0.85 });
}

function SpeakerButton({ text, lang }: { text: string; lang: string }) {
  return (
    <TouchableOpacity
      onPress={() => speak(text, lang)}
      style={styles.speakerBtn}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={styles.speakerIcon}>🔊</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const [lang, setLang] = useState<"english" | "hindi" | "kannada">("english");

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
        <View style={styles.wordRow}>
          <Text style={styles.word}>{content.word}</Text>
          <SpeakerButton text={content.word} lang={lang} />
        </View>
        <Text style={styles.pronunciation}>/{content.pronunciation}/</Text>
        <Text>{content.meaning}</Text>
        <Text style={styles.example}>{content.example}</Text>

        <Text style={styles.title}>Phrase</Text>
        <View style={styles.wordRow}>
          <Text style={[styles.word, styles.phraseText]}>{content.phrase}</Text>
          <SpeakerButton text={content.phrase} lang={lang} />
        </View>
        <Text style={styles.pronunciation}>/{content.phrasePronunciation}/</Text>
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
    paddingTop: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tab: {
    padding: 10,
    color: "#6B7280",
  },
  activeTab: {
    color: "#4F46E5",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
  },
  title: {
    marginTop: 10,
    fontWeight: "bold",
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  word: {
    fontSize: 20,
    fontWeight: "600",
  },
  phraseText: {
    fontSize: 18,
    flexShrink: 1,
  },
  speakerBtn: {
    padding: 4,
  },
  speakerIcon: {
    fontSize: 20,
  },
  pronunciation: {
    color: "#6B7280",
    marginBottom: 5,
    fontStyle: "italic",
  },
  example: {
    fontStyle: "italic",
    marginBottom: 10,
  },
});