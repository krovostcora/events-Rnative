import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import {
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
} from '../components/buttons_styles';
import { UNIFIED_STYLES } from '../components/constants';

export default function HomeScreenAdmin({ navigation }) {

    return (
        <View style={UNIFIED_STYLES.container}>
            {/* Pixel-art logo */}
            <View style={styles.logoContainer}>
                {/* 5x5 grid */}
                {[
                    [0, 1, 0, 1, 0],
                    [1, 0, 0, 0, 1],
                    [1, 0, 1, 0, 1],
                    [1, 0, 0, 2, 1],
                    [0, 1, 1, 1, 0],
                ].map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.logoRow}>
                        {row.map((cell, colIndex) => (
                            <View
                                key={colIndex}
                                style={[
                                    styles.logoPixel,
                                    cell === 1 && styles.logoPixelBlack,
                                    cell === 2 && styles.logoPixelRed,
                                ]}
                            />
                        ))}
                    </View>
                ))}
            </View>
            {/* Buttons */}

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Welcome Admin</Text>
                <View style={UNIFIED_STYLES.buttonRow}>
                <TouchableOpacity
                    style={secondaryButton}
                    onPress={() => BackHandler.exitApp()}
                >
                    <Text style={secondaryButtonText}>EXIT</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={primaryButton}
                    onPress={() => navigation.navigate("EventSelector")}
                >
                    <Text style={primaryButtonText}>START</Text>
                </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const PIXEL_SIZE = 24;

const styles = StyleSheet.create({
    logoContainer: {
        marginTop: 100,
        alignItems: 'center',
    },
    logoRow: {
        flexDirection: 'row',
    },
    logoPixel: {
        width: PIXEL_SIZE*1.5,
        height: PIXEL_SIZE*1.5,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#bbb',
    },
    logoPixelBlack: {
        backgroundColor: '#111',
    },
    logoPixelRed: {
        backgroundColor: '#d00',
    },
});