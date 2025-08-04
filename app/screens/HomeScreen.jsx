import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
}from '../../components/constants';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
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
            <View style={styles.buttonRow}>
                <TouchableOpacity style={secondaryButton}>
                    <Text style={secondaryButtonText}>EXIT</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={primaryButton}
                    onPress={() => navigation.navigate('EventSelector')}
                >
                    <Text style={primaryButtonText}>START</Text>
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
});