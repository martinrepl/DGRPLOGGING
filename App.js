import React, { useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';

const STORAGE_KEY = 'PAM_STYLE_APP_DATA';
const Tab = createBottomTabNavigator();
const THEME = '#FFC7C6';

const LANGS = [
  { code: 'en', label: 'English', icon: 'alphabet-latin' },
  { code: 'de', label: 'Deutsch', icon: 'chat' },
  { code: 'ru', label: 'Русский', icon: 'translate' },
  { code: 'bg', label: 'Български', icon: 'comment-text' },
];

const I18N = {
  en: {
    chooseLanguage: 'Which language do you speak?',
    continue: 'Continue',
    profileSetup: 'Profile setup',
    firstName: 'First name',
    firstNameRequired: 'First name is required',
    uploadPhoto: 'Upload profile picture (optional)',
    greet: (name) => `Hello ${name}!`,
    bodyData: 'Your body data',
    currentWeight: 'Current weight (kg)',
    height: 'Height (cm)',
    targetWeight: 'Target weight (kg)',
    next: 'Next',
    home: 'Home',
    progress: 'Progress',
    recipes: 'Recipes',
    experiences: 'Experiences',
    about: 'About us',
    profile: 'Profile',
    bmi: 'BMI',
    comingSoon: 'Coming Soon',
    save: 'Save changes',
    motivation: 'Motivation',
    goals: 'Goals',
    activityLevel: 'Activity level',
    logout: 'Logout',
    dashboardTitle: 'Today dashboard',
  },
  de: {
    chooseLanguage: 'Welche Sprache sprichst du?',
    continue: 'Weiter',
    profileSetup: 'Profil einrichten',
    firstName: 'Vorname',
    firstNameRequired: 'Vorname ist erforderlich',
    uploadPhoto: 'Profilbild hochladen (optional)',
    greet: (name) => `Hallo ${name}!`,
    bodyData: 'Deine Körperdaten',
    currentWeight: 'Aktuelles Gewicht (kg)',
    height: 'Körpergröße (cm)',
    targetWeight: 'Zielgewicht (kg)',
    next: 'Weiter',
    home: 'Home',
    progress: 'Fortschritte',
    recipes: 'Rezepte',
    experiences: 'Erfahrungen',
    about: 'Über uns',
    profile: 'Profil',
    bmi: 'BMI',
    comingSoon: 'Bald verfügbar',
    save: 'Änderungen speichern',
    motivation: 'Motivation',
    goals: 'Ziele',
    activityLevel: 'Aktivitätslevel',
    logout: 'Abmelden',
    dashboardTitle: 'Dein Dashboard',
  },
  ru: {
    chooseLanguage: 'На каком языке вы говорите?',
    continue: 'Продолжить',
    profileSetup: 'Настройка профиля',
    firstName: 'Имя',
    firstNameRequired: 'Имя обязательно',
    uploadPhoto: 'Загрузить фото профиля (необязательно)',
    greet: (name) => `Привет, ${name}!`,
    bodyData: 'Данные тела',
    currentWeight: 'Текущий вес (кг)',
    height: 'Рост (см)',
    targetWeight: 'Целевой вес (кг)',
    next: 'Далее',
    home: 'Главная',
    progress: 'Прогресс',
    recipes: 'Рецепты',
    experiences: 'Опыт',
    about: 'О нас',
    profile: 'Профиль',
    bmi: 'ИМТ',
    comingSoon: 'Скоро будет',
    save: 'Сохранить изменения',
    motivation: 'Мотивация',
    goals: 'Цели',
    activityLevel: 'Уровень активности',
    logout: 'Выйти',
    dashboardTitle: 'Панель на сегодня',
  },
  bg: {
    chooseLanguage: 'Какъв език говорите?',
    continue: 'Продължи',
    profileSetup: 'Настройка на профил',
    firstName: 'Име',
    firstNameRequired: 'Името е задължително',
    uploadPhoto: 'Качи профилна снимка (по желание)',
    greet: (name) => `Здравей, ${name}!`,
    bodyData: 'Телесни данни',
    currentWeight: 'Текущо тегло (кг)',
    height: 'Ръст (см)',
    targetWeight: 'Целево тегло (кг)',
    next: 'Напред',
    home: 'Начало',
    progress: 'Напредък',
    recipes: 'Рецепти',
    experiences: 'Истории',
    about: 'За нас',
    profile: 'Профил',
    bmi: 'ИТМ',
    comingSoon: 'Очаквайте скоро',
    save: 'Запази промените',
    motivation: 'Мотивация',
    goals: 'Цели',
    activityLevel: 'Ниво на активност',
    logout: 'Изход',
    dashboardTitle: 'Твоето табло днес',
  },
};

const defaultState = {
  language: null,
  firstName: '',
  profileImage: null,
  weight: 70,
  height: 170,
  targetWeight: 65,
  goals: '',
  motivation: '',
  activityLevel: '',
};

const spacing = Platform.select({
  ios: { page: 24, card: 20, radius: 24 },
  android: { page: 16, card: 14, radius: 16 },
  default: { page: 18, card: 16, radius: 18 },
});

const animationConfig = Platform.OS === 'ios'
  ? { toValue: 1, friction: 8, tension: 45, useNativeDriver: true }
  : { toValue: 1, friction: 9, tension: 70, useNativeDriver: true };

function BubbleButton({ icon, label, onPress }) {
  const scale = useMemo(() => new Animated.Value(0.9), []);

  useEffect(() => {
    Animated.spring(scale, animationConfig).start();
  }, [scale]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.languageButton, pressed && { transform: [{ scale: 0.96 }] }]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <MaterialCommunityIcons name={icon} size={34} color="#222" />
      </Animated.View>
      <Text style={styles.languageButtonText}>{label}</Text>
    </Pressable>
  );
}

function LanguageScreen({ setLanguage }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.centeredWrap}>
        <Text style={styles.heroTitle}>Pam Style</Text>
        <Text style={styles.heroSubtitle}>Which language do you speak?</Text>
        <View style={styles.languageGrid}>
          {LANGS.map((lang) => (
            <BubbleButton
              key={lang.code}
              icon={lang.icon}
              label={`${lang.code.toUpperCase()} · ${lang.label}`}
              onPress={() => setLanguage(lang.code)}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function SetupScreen({ appData, setAppData }) {
  const t = I18N[appData.language];
  const [nameError, setNameError] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAppData((prev) => ({ ...prev, profileImage: result.assets[0].uri }));
    }
  };

  const readyForNext = appData.firstName.trim().length > 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.cardTitle}>{t.profileSetup}</Text>
      <TextInput
        style={[styles.input, nameError && styles.inputError]}
        value={appData.firstName}
        placeholder={t.firstName}
        onChangeText={(value) => {
          setNameError(false);
          setAppData((prev) => ({ ...prev, firstName: value }));
        }}
      />
      {nameError && <Text style={styles.errorText}>{t.firstNameRequired}</Text>}
      <Pressable style={styles.actionButton} onPress={pickImage}>
        <MaterialCommunityIcons name="account-circle" size={24} color="#222" />
        <Text style={styles.actionLabel}>{t.uploadPhoto}</Text>
      </Pressable>
      {appData.profileImage ? (
        <Image source={{ uri: appData.profileImage }} style={styles.avatarLarge} />
      ) : null}
      <Text style={styles.greeting}>{t.greet(appData.firstName || '...')}</Text>

      <Text style={styles.cardTitle}>{t.bodyData}</Text>
      <SliderField
        icon="weight-kilogram"
        label={t.currentWeight}
        min={35}
        max={220}
        value={appData.weight}
        onChange={(weight) => setAppData((prev) => ({ ...prev, weight }))}
      />
      <SliderField
        icon="human-male-height"
        label={t.height}
        min={120}
        max={230}
        value={appData.height}
        onChange={(height) => setAppData((prev) => ({ ...prev, height }))}
      />
      <SliderField
        icon="target"
        label={t.targetWeight}
        min={35}
        max={220}
        value={appData.targetWeight}
        onChange={(targetWeight) => setAppData((prev) => ({ ...prev, targetWeight }))}
      />

      <Pressable
        style={styles.primaryButton}
        onPress={() => {
          if (!readyForNext) {
            setNameError(true);
          } else {
            setAppData((prev) => ({ ...prev, onboardingDone: true }));
          }
        }}
      >
        <Text style={styles.primaryLabel}>{t.continue}</Text>
      </Pressable>
    </ScrollView>
  );
}

function SliderField({ icon, label, min, max, value, onChange }) {
  return (
    <View style={styles.sliderCard}>
      <View style={styles.sliderTopRow}>
        <MaterialCommunityIcons name={icon} size={22} color="#222" />
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>{Math.round(value)}</Text>
      </View>
      <Slider
        minimumValue={min}
        maximumValue={max}
        value={value}
        minimumTrackTintColor="#222"
        maximumTrackTintColor="#e7a5a4"
        thumbTintColor="#222"
        onValueChange={(v) => onChange(Math.round(v))}
      />
    </View>
  );
}

function HomeScreen({ appData }) {
  const t = I18N[appData.language];
  const bmi = (appData.weight / ((appData.height / 100) ** 2)).toFixed(1);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.cardTitle}>{t.dashboardTitle}</Text>
      <View style={styles.homeHeroCard}>
        {appData.profileImage ? (
          <Image source={{ uri: appData.profileImage }} style={styles.avatarMedium} />
        ) : (
          <MaterialCommunityIcons name="account-heart" size={58} color="#222" />
        )}
        <Text style={styles.greeting}>{t.greet(appData.firstName)}</Text>
      </View>

      <MetricCard icon="weight-kilogram" label={t.currentWeight} value={`${appData.weight} kg`} />
      <MetricCard icon="target" label={t.targetWeight} value={`${appData.targetWeight} kg`} />
      <MetricCard icon="human-male-height" label={t.height} value={`${appData.height} cm`} />
      <MetricCard icon="calculator" label={t.bmi} value={bmi} />
    </ScrollView>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <View style={styles.metricCard}>
      <MaterialCommunityIcons name={icon} size={24} color="#222" />
      <View style={{ flex: 1 }}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
    </View>
  );
}

function ComingSoonScreen({ text }) {
  return (
    <View style={styles.comingWrap}>
      <MaterialCommunityIcons name="clock-time-four" size={80} color="#222" />
      <Text style={styles.comingText}>{text}</Text>
    </View>
  );
}

function ProfileScreen({ appData, setAppData, logout }) {
  const t = I18N[appData.language];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.cardTitle}>{t.profile}</Text>
      <TextInput
        style={styles.input}
        value={appData.firstName}
        placeholder={t.firstName}
        onChangeText={(firstName) => setAppData((prev) => ({ ...prev, firstName }))}
      />
      <SliderField
        icon="weight-kilogram"
        label={t.currentWeight}
        min={35}
        max={220}
        value={appData.weight}
        onChange={(weight) => setAppData((prev) => ({ ...prev, weight }))}
      />
      <SliderField
        icon="human-male-height"
        label={t.height}
        min={120}
        max={230}
        value={appData.height}
        onChange={(height) => setAppData((prev) => ({ ...prev, height }))}
      />
      <SliderField
        icon="target"
        label={t.targetWeight}
        min={35}
        max={220}
        value={appData.targetWeight}
        onChange={(targetWeight) => setAppData((prev) => ({ ...prev, targetWeight }))}
      />
      <TextInput
        style={styles.input}
        value={appData.goals}
        placeholder={t.goals}
        onChangeText={(goals) => setAppData((prev) => ({ ...prev, goals }))}
      />
      <TextInput
        style={styles.input}
        value={appData.motivation}
        placeholder={t.motivation}
        onChangeText={(motivation) => setAppData((prev) => ({ ...prev, motivation }))}
      />
      <TextInput
        style={styles.input}
        value={appData.activityLevel}
        placeholder={t.activityLevel}
        onChangeText={(activityLevel) => setAppData((prev) => ({ ...prev, activityLevel }))}
      />
      <Pressable style={styles.logoutButton} onPress={logout}>
        <MaterialCommunityIcons name="logout" size={22} color="#222" />
        <Text style={styles.logoutLabel}>{t.logout}</Text>
      </Pressable>
    </ScrollView>
  );
}

function MainTabs({ appData, setAppData, logout }) {
  const t = I18N[appData.language];

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#222',
          tabBarInactiveTintColor: '#555',
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            const icons = {
              [t.home]: 'home-variant',
              [t.progress]: 'chart-line',
              [t.recipes]: 'food-apple',
              [t.experiences]: 'account-group',
              [t.about]: 'information',
              [t.profile]: 'account-circle',
            };
            return <MaterialCommunityIcons name={icons[route.name]} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name={t.home}>{() => <HomeScreen appData={appData} />}</Tab.Screen>
        <Tab.Screen name={t.progress}>{() => <ComingSoonScreen text={t.comingSoon} />}</Tab.Screen>
        <Tab.Screen name={t.recipes}>{() => <ComingSoonScreen text={t.comingSoon} />}</Tab.Screen>
        <Tab.Screen name={t.experiences}>{() => <ComingSoonScreen text={t.comingSoon} />}</Tab.Screen>
        <Tab.Screen name={t.about}>{() => <ComingSoonScreen text={t.comingSoon} />}</Tab.Screen>
        <Tab.Screen name={t.profile}>
          {() => <ProfileScreen appData={appData} setAppData={setAppData} logout={logout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [appData, setAppData] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setAppData(JSON.parse(raw));
      }
      setLoaded(true);
    };

    load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  }, [appData, loaded]);

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setAppData(defaultState);
  };

  if (!loaded) {
    return <SafeAreaView style={styles.container} />;
  }

  if (!appData.language) {
    return <LanguageScreen setLanguage={(language) => setAppData((prev) => ({ ...prev, language }))} />;
  }

  if (!appData.onboardingDone) {
    return <SetupScreen appData={appData} setAppData={setAppData} />;
  }

  return <MainTabs appData={appData} setAppData={setAppData} logout={logout} />;
}

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  android: { elevation: 3 },
  default: {},
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff4f4',
  },
  centeredWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.page,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#222',
  },
  heroSubtitle: {
    marginTop: 6,
    marginBottom: 24,
    fontSize: 18,
    color: '#444',
  },
  languageGrid: {
    width: '100%',
    gap: 12,
  },
  languageButton: {
    backgroundColor: THEME,
    borderRadius: 999,
    paddingVertical: Platform.OS === 'ios' ? 18 : 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...shadow,
  },
  languageButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  scrollContent: {
    padding: spacing.page,
    gap: 14,
    paddingBottom: 32,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#222',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: spacing.radius,
    padding: 14,
    borderWidth: 2,
    borderColor: '#f6b0af',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#d3312b',
  },
  errorText: {
    color: '#d3312b',
    marginTop: -6,
  },
  actionButton: {
    backgroundColor: THEME,
    borderRadius: spacing.radius,
    padding: spacing.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...shadow,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  avatarLarge: {
    height: 130,
    width: 130,
    borderRadius: 65,
    alignSelf: 'center',
  },
  avatarMedium: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },
  sliderCard: {
    backgroundColor: '#fff',
    borderRadius: spacing.radius,
    padding: spacing.card,
    ...shadow,
  },
  sliderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sliderLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  primaryButton: {
    backgroundColor: THEME,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#222',
  },
  homeHeroCard: {
    backgroundColor: THEME,
    borderRadius: spacing.radius,
    padding: spacing.card,
    alignItems: 'center',
    gap: 8,
    ...shadow,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: spacing.radius,
    padding: spacing.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    ...shadow,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 21,
    fontWeight: '700',
    color: '#222',
  },
  tabBar: {
    backgroundColor: '#ffe0df',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
  },
  comingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff4f4',
    gap: 20,
  },
  comingText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
  },
  logoutButton: {
    marginTop: 12,
    backgroundColor: THEME,
    borderRadius: spacing.radius,
    padding: spacing.card,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
});
