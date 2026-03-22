import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import { dailyContent } from '../data/dailyContent';

const LANG_CODES: Record<string, string> = {
  english: "en-US",
  hindi: "hi",
  kannada: "kn",
  telugu: "te",
};

function speak(text: string, lang: string) {
  Speech.stop();
  Speech.speak(text, { language: LANG_CODES[lang] ?? "en", rate: 0.85 });
}

function speakSequence(items: { text: string; lang: string }[], index = 0) {
  if (index >= items.length) return;
  const { text, lang } = items[index];
  Speech.speak(text, {
    language: LANG_CODES[lang] ?? "en",
    rate: 0.85,
    onDone: () => speakSequence(items, index + 1),
  });
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
  const [lang, setLang] = useState<"english" | "hindi" | "kannada" | "telugu">("english");
  const [wordOffset, setWordOffset] = useState(0);
  const [phraseOffset, setPhraseOffset] = useState(0);

  const today = new Date();
  const dayOfYear =
    Math.floor(
      (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
        Date.UTC(today.getFullYear(), 0, 0)) /
        (1000 * 60 * 60 * 24)
    );

  const wordIndex = (dayOfYear + wordOffset) % dailyContent.length;
  const phraseIndex = (dayOfYear + phraseOffset) % dailyContent.length;
  const wordContent = dailyContent[wordIndex][lang];
  const phraseContent = dailyContent[phraseIndex][lang];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Daily Lingo</Text>

      <View style={styles.tabs}>
        {(["english", "hindi", "kannada", "telugu"] as const).map(l => (
          <TouchableOpacity key={l} onPress={() => setLang(l)}>
            <Text style={[styles.tab, lang === l && styles.activeTab]}>
              {l.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Word</Text>
          <TouchableOpacity
            onPress={() => {
              Speech.stop();
              const items: { text: string; lang: string }[] = [
                { text: wordContent.word, lang },
                { text: wordContent.meaning, lang },
              ];
              if (lang !== "english" && wordContent.meaningInEnglish)
                items.push({ text: wordContent.meaningInEnglish, lang: "english" });
              items.push({ text: wordContent.example, lang });
              speakSequence(items);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.readAllIcon}>📖</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.wordRow}>
          <Text style={styles.word}>{wordContent.word}</Text>
          <SpeakerButton text={wordContent.word} lang={lang} />
        </View>
        <Text style={styles.pronunciation}>/{wordContent.pronunciation}/</Text>
        <Text>{wordContent.meaning}</Text>
        {lang !== "english" && wordContent.meaningInEnglish ? (
          <Text style={styles.englishMeaning}>{wordContent.meaningInEnglish}</Text>
        ) : null}
        <Text style={styles.example}>{wordContent.example}</Text>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => { Speech.stop(); setWordOffset(o => o + 1); }}
        >
          <Text style={styles.skipText}>Know this? Next word →</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.title}>Phrase</Text>
          <TouchableOpacity
            onPress={() => {
              Speech.stop();
              const items: { text: string; lang: string }[] = [
                { text: phraseContent.phrase, lang },
                { text: phraseContent.phraseMeaning, lang },
              ];
              if (lang !== "english" && phraseContent.phraseMeaningInEnglish)
                items.push({ text: phraseContent.phraseMeaningInEnglish, lang: "english" });
              items.push({ text: phraseContent.phraseExample, lang });
              speakSequence(items);
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.readAllIcon}>📖</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.wordRow}>
          <Text style={[styles.word, styles.phraseText]}>{phraseContent.phrase}</Text>
          <SpeakerButton text={phraseContent.phrase} lang={lang} />
        </View>
        <Text style={styles.pronunciation}>/{phraseContent.phrasePronunciation}/</Text>
        <Text>{phraseContent.phraseMeaning}</Text>
        {lang !== "english" && phraseContent.phraseMeaningInEnglish ? (
          <Text style={styles.englishMeaning}>{phraseContent.phraseMeaningInEnglish}</Text>
        ) : null}
        <Text style={styles.example}>{phraseContent.phraseExample}</Text>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => { Speech.stop(); setPhraseOffset(o => o + 1); }}
        >
          <Text style={styles.skipText}>Know this? Next phrase →</Text>
        </TouchableOpacity>
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  title: {
    fontWeight: "bold",
  },
  readAllIcon: {
    fontSize: 18,
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
  englishMeaning: {
    color: "#4F46E5",
    fontSize: 13,
    marginTop: 2,
  },
  example: {
    fontStyle: "italic",
    marginBottom: 10,
  },
  skipBtn: {
    alignSelf: "center",
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
  },
  skipText: {
    color: "#4F46E5",
    fontWeight: "600",
    fontSize: 14,
  },
});