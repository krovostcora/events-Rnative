import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const FONT = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

export default function NewEventForm({ navigation }) {
    const [form, setForm] = useState({
        name: '',
        date: '',
        time: '',
        place: '',
        logo: null
    });

    const handlePickLogo = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'image/png'
        });
        if (!result.canceled) {
            setForm({ ...form, logo: result.assets[0] });
        }
    };

    const handleAccept = () => {
        navigation.navigate('EventSelector');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
                placeholder="Write the name of the event"
                placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.logoBox} onPress={handlePickLogo} activeOpacity={0.7}>
                {form.logo ? (
                    <Text style={styles.logoText}>{form.logo.name}</Text>
                ) : (
                    <Text style={styles.logoText}>Upload logo (.png)</Text>
                )}
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                placeholder="Date (YYYY-MM-DD)"
                placeholderTextColor="#aaa"
                value={form.date}
                onChangeText={(text) => setForm({ ...form, date: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Time (HH:MM)"
                placeholderTextColor="#aaa"
                value={form.time}
                onChangeText={(text) => setForm({ ...form, time: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Place"
                placeholderTextColor="#aaa"
                value={form.place}
                onChangeText={(text) => setForm({ ...form, place: text })}
            />

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.navigate('EventSelector')}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={handleAccept}
                >
                    <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        paddingHorizontal: 24,
        paddingTop: 48,
        alignItems: 'center',
    },
    label: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#222',
        alignSelf: 'flex-start',
        marginBottom: 6,
        letterSpacing: 1,
    },
    input: {
        width: 320,
        height: 44,
        borderWidth: 1,
        borderColor: '#bbb',
        backgroundColor: '#fff',
        fontFamily: FONT,
        fontSize: 16,
        color: '#222',
        marginBottom: 14,
        paddingHorizontal: 12,
        borderRadius: 0,
    },
    logoBox: {
        width: 122,
        height: 122,
        borderWidth: 1,
        borderColor: '#bbb',
        backgroundColor: '#fafafa',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
        marginTop: 2,
        borderRadius: 0,
    },
    logoText: {
        fontFamily: FONT,
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 320,
        position: 'absolute',
        bottom: 36,
        left: 24,
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 0,
        paddingVertical: 14,
        paddingHorizontal: 36,
        minWidth: 120,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#222',
        fontFamily: FONT,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    acceptButton: {
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 0,
        paddingVertical: 14,
        paddingHorizontal: 36,
        minWidth: 120,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: '#fff',
        fontFamily: FONT,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
});