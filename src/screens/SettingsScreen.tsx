import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, Switch, ScrollView, Platform, TouchableOpacity } from "react-native"
import { Picker } from "@react-native-picker/picker"
import Slider from "@react-native-community/slider"
import { SafeAreaView } from "react-native-safe-area-context"
import type { ConfigSettings } from "../../types/types"
import { useAuthStore } from "../store/authStore"
import { Ionicons } from "@expo/vector-icons"

export const SettingsScreen: React.FC = ({ navigation }) => {
  const { logout } = useAuthStore()
  const [settings, setSettings] = useState<ConfigSettings>({
    workingHoursPerDay: 8,
    defaultTaskPriority: 2,
    notificationEnabled: true,
    theme: "light",
    language: "es",
    dependencyAlertEnabled: true,
  })

  const updateSetting = <K extends keyof ConfigSettings>(key: K, value: ConfigSettings[K]) => {
    setSettings((prevSettings) => ({ ...prevSettings, [key]: value }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.settingGroup}>
          <Text style={styles.settingTitle}>Working Hours Per Day</Text>
          <Text style={styles.settingValue}>{settings.workingHoursPerDay} hours</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={24}
            step={0.5}
            value={settings.workingHoursPerDay}
            onValueChange={(value) => updateSetting("workingHoursPerDay", Number(value))}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#DEDEDE"
            thumbTintColor="#007AFF"
          />
        </View>

        <View style={styles.settingGroup}>
          <Text style={styles.settingTitle}>Default Task Priority</Text>
          <Text style={styles.settingValue}>{settings.defaultTaskPriority}</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={settings.defaultTaskPriority}
            onValueChange={(value) => updateSetting("defaultTaskPriority", Number(value))}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#DEDEDE"
            thumbTintColor="#007AFF"
          />
        </View>

        <View style={styles.settingGroup}>
          <View style={styles.settingRow}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Switch
              value={settings.notificationEnabled}
              onValueChange={(value) => updateSetting("notificationEnabled", value)}
              trackColor={{ false: "#DEDEDE", true: "#007AFF" }}
              thumbColor={settings.notificationEnabled ? "#FFFFFF" : "#F4F3F4"}
            />
          </View>
        </View>

        {Platform.OS !== "windows" && (
          <>
            <View style={styles.settingGroup}>
              <Text style={styles.settingTitle}>Theme</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={settings.theme}
                  style={styles.picker}
                  onValueChange={(itemValue) => updateSetting("theme", itemValue)}
                >
                  <Picker.Item label="Light" value="light" />
                  <Picker.Item label="Dark" value="dark" />
                </Picker>
              </View>
            </View>

            <View style={styles.settingGroup}>
              <Text style={styles.settingTitle}>Language</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={settings.language}
                  style={styles.picker}
                  onValueChange={(itemValue) => updateSetting("language", itemValue)}
                >
                  <Picker.Item label="English" value="en" />
                  <Picker.Item label="Español" value="es" />
                </Picker>
              </View>
            </View>
          </>
        )}

        <View style={styles.settingGroup}>
          <View style={styles.settingRow}>
            <Text style={styles.settingTitle}>Dependency Alerts</Text>
            <Switch
              value={settings.dependencyAlertEnabled}
              onValueChange={(value) => updateSetting("dependencyAlertEnabled", value)}
              trackColor={{ false: "#DEDEDE", true: "#007AFF" }}
              thumbColor={settings.dependencyAlertEnabled ? "#FFFFFF" : "#F4F3F4"}
            />
          </View>
        </View>

        <TouchableOpacity onPress={() => logout(navigation)} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#1A1A1A",
  },
  settingGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1A1A1A",
  },
  settingValue: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#DEDEDE",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 40,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  versionText: {
    textAlign: "center",
    marginTop: 24,
    color: "#666",
    fontSize: 14,
  },
})

