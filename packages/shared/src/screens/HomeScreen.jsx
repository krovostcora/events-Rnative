import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, TextInput } from 'react-native';
import {
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
} from '../components/buttons_styles';
import { UNIFIED_STYLES } from '../components/constants';

export default function HomeScreen({ navigation }) {
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [checked, setChecked] = useState(false);

    const handleCheckPassword = () => {
        if (password === 'admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
        setChecked(true);
    };

    return (
        <View style={UNIFIED_STYLES.container}>
            {/* Pixel-art logo */}
            <View style={styles.logoContainer}>
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

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                {!checked ? (
                    <>
                        <Text>Enter password to enter as admin</Text>
                        <TextInput
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                        />
                        <TouchableOpacity style={primaryButton} onPress={handleCheckPassword}>
                            <Text style={primaryButtonText}>LOGIN</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text>{isAdmin ? "Welcome Admin" : "Welcome User"}</Text>
                        <View style={UNIFIED_STYLES.buttonRow}>
                            <TouchableOpacity
                                style={secondaryButton}
                                onPress={() => BackHandler.exitApp()}
                            >
                                <Text style={secondaryButtonText}>EXIT</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={primaryButton}
                                onPress={() => navigation.navigate(
                                    isAdmin ? "EventSelector" : "EventsChoose"
                                )}
                            >
                                <Text style={primaryButtonText}>START</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
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
    input: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 8,
        padding: 8,
        marginVertical: 10,
        width: 200,
        textAlign: 'center',
    }
});
