import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
}from '../components/constants';

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
    const [showDatePicker, setShowDatePicker] = useState({ mode: null, visible: false });



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

            {/*Date input*/}
            {Platform.OS === 'web' ? (
                <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    style={styles.webInputDate}
                />
            ) : (
                <>
                    <TouchableOpacity
                        onPress={() =>
                            setShowDatePicker(prev => ({
                                mode: 'date',
                                visible: prev.visible && prev.mode === 'date' ? false : true
                            }))
                        }
                        style={styles.input}
                    >
                        <Text style={{ fontFamily: FONT, fontSize: 16, lineHeight: 44, color: form.date ? '#222' : '#aaa' }}>
                            {form.date || 'Date (YYYY-MM-DD)'}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker.visible && showDatePicker.mode === 'date' && (
                        <DateTimePicker
                            value={form.date ? new Date(form.date) : new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                            onChange={(event, selectedDate) => {
                                setShowDatePicker({ mode: null, visible: false });
                                if (selectedDate) {
                                    setForm({ ...form, date: selectedDate.toISOString().slice(0, 10) });
                                }
                            }}
                        />
                    )}
                </>
            )}

            {/*Time input*/}
            {Platform.OS === 'web' ? (
                <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    style={styles.webInputDate}
                />
            ) : (
                <>
                    <TouchableOpacity
                        onPress={() =>
                            setShowDatePicker(prev => ({
                                mode: 'time',
                                visible: prev.visible && prev.mode === 'time' ? false : true
                            }))
                        }
                        style={styles.input}
                    >
                        <Text style={{ fontFamily: FONT, fontSize: 16, lineHeight: 44, color: form.time ? '#222' : '#aaa' }}>
                            {form.time || 'Time (HH:MM)'}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker.visible && showDatePicker.mode === 'time' && (
                        <DateTimePicker
                            value={new Date()}
                            mode="time"
                            display="spinner"
                            is24Hour={true}
                            onChange={(event, selectedTime) => {
                                setShowDatePicker({ mode: null, visible: false });
                                if (selectedTime) {
                                    const hours = selectedTime.getHours().toString().padStart(2, '0');
                                    const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
                                    setForm({ ...form, time: `${hours}:${minutes}` });
                                }
                            }}
                        />
                    )}
                </>
            )}


            {/*<TextInput*/}
            {/*    style={styles.input}*/}
            {/*    placeholder="Place"*/}
            {/*    placeholderTextColor="#aaa"*/}
            {/*    value={form.place}*/}
            {/*    onChangeText={(text) => setForm({ ...form, place: text })}*/}
            {/*/>*/}
            <TouchableOpacity
                style={styles.input}
                onPress={() => navigation.navigate('MapScreen', {
                    onSelect: (coords) => {
                        setForm({ ...form, place: coords });
                    }
                })}
            >
                <Text style={{ fontFamily: FONT, fontSize: 16, lineHeight: 44, color: form.place ? '#222' : '#aaa' }}>
                    {form.place || 'Choose place on map'}
                </Text>
            </TouchableOpacity>


            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={secondaryButton}
                    onPress={() => navigation.navigate('EventSelector')}
                >
                    <Text style={secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={primaryButton}
                    onPress={handleAccept}
                >
                    <Text style={primaryButtonText}>Accept</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 200,
        position: 'relative',
        bottom: 36,
        left: 0,
        right: 0,
        width: '100%',
        gap: 24,
    },
    webInputDate: {
        width: 289,
        height: 44,
        borderWidth: 1,
        borderColor: '#bbb',
        backgroundColor: '#fff',
        fontFamily: FONT,
        fontSize: 16,
        color: '#222',
        marginBottom: 14,
        borderRadius: 0,
        paddingLeft: 15,
        paddingRight: 15,
    }
});