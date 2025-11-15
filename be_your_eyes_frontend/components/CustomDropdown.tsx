import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface DropdownProps {
    label: string;
    value: string;
    onSelect: (value: string) => void;
    options: string[];
    placeholder?: string;
    accessibilityHint?: string;
}

export default function CustomDropdown({
    label,
    value,
    onSelect,
    options,
    placeholder,
    accessibilityHint,
}: DropdownProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (option: string) => {
        onSelect(option);
        setOpen(false);
    };

    return (
        <View style={styles.container}>
            {/* Botón del dropdown */}
            <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setOpen(!open)}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityHint={
                    accessibilityHint ||
                    `${open ? "Cerrar" : "Abrir"} el menú de ${label.toLowerCase()}`
                }
                accessibilityState={{ expanded: open }}
            >
                <Text
                    style={styles.input}
                >
                    {value || placeholder || ""}
                </Text>
                <MaterialIcons
                    name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                    size={24}
                    color="#000000"
                    style={styles.iconWrapper}
                    accessible={false}
                />
            </TouchableOpacity>

            {/* Lista desplegable */}
            {open && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => handleSelect(item)}
                                accessibilityRole="button"
                                accessibilityLabel={item}
                                accessibilityHint={`Selecciona ${item}`}
                            >
                                <Text style={styles.optionText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: Colors.secondary,
    },
    input: {
        fontSize: 16,
        color: Colors.text,
    },
    iconWrapper: {
        marginLeft: 8,
    },
    dropdown: {
        backgroundColor: Colors.secondary,
        borderRadius: 8,
        marginTop: 4,
        maxHeight: 150,
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    optionText: {
        fontSize: 16,
        color: Colors.text,
    },
});
