import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

interface CustomTimePickerProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  accessibilityHint?: string;
}

export default function CustomTimePicker({
  label,
  value,
  onChange,
  accessibilityHint,
}: CustomTimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) onChange(selectedDate);
  };

  const formattedTime = value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.inputWrapper}
        onPress={() => setShowPicker(true)}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={
          accessibilityHint || `Selecciona la hora para ${label.toLowerCase()}`
        }
      >
        <Text style={styles.timeText}>{formattedTime}</Text>
        <MaterialIcons
          name="access-time"
          size={24}
          color="#000000"
          style={styles.iconWrapper}
          accessible={false}
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 16,
    color: Colors.text,
  },
  iconWrapper: {
    marginLeft: 8,
  },
});
