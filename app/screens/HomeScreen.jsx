import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            {/* Pixel-art logo */}
            <View style={styles.logoContainer}>
                {/* 5x5 grid, center square is red */}
                {[
                    [1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 1],
                    [1, 0, 2, 0, 1],
                    [1, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1],
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
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.exitButton}>
                    <Text style={styles.exitButtonText}>EXIT</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => navigation.navigate('EventSelector')}
                >
                    <Text style={styles.startButtonText}>START</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const PIXEL_SIZE = 24;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        marginBottom: 100,
        alignItems: 'center',
    },
    logoRow: {
        flexDirection: 'row',
    },
    logoPixel: {
        width: PIXEL_SIZE,
        height: PIXEL_SIZE,
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
    buttonRow: {
        flexDirection: 'row',
        gap: 24,
    },
    exitButton: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 0,
        borderWidth: 2,
        borderColor: '#bbb',
        marginRight: 12,
        minWidth: 120,
        alignItems: 'center',
    },
    exitButtonText: {
        color: '#222',
        fontFamily: 'Menlo', // fallback to monospace
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 2,
    },
    startButton: {
        backgroundColor: '#111',
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 0,
        borderWidth: 2,
        borderColor: '#bbb',
        minWidth: 120,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#fff',
        fontFamily: 'Menlo',
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 2,
    },
});