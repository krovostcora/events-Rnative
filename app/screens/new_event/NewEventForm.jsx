import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
} from '../../../components/buttons_styles';
import { UNIFIED_STYLES } from '../../../components/constants';

const FONT = Platform.OS === 'ios' ? 'System' : 'monospace';

async function sendEventToServer(form) {
    const generateId = () => Math.random().toString(36).substring(2, 10) + Date.now();
    const id = generateId();
    const csvLine = [
        id,
        form.name,
        form.date,
        form.time,
        typeof form.place === 'string' ? form.place : JSON.stringify(form.place),
        form.isRace,
        form.ageLimit,
        form.maxChildAge,
        form.medicalRequired,
        form.teamEvent,
        form.genderRestriction,
        form.description
    ].join(';') + '\n';

    const response = await fetch('https://events-server-eu5z.onrender.com/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id,
            csvLine,
            date: form.date,
            name: form.name,
            time: form.time,
            place: form.place,
            isRace: form.isRace,
            ageLimit: form.ageLimit,
            maxChildAge: form.maxChildAge,
            medicalRequired: form.medicalRequired,
            teamEvent: form.teamEvent,
            genderRestriction: form.genderRestriction,
            description: form.description,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to save event');
    }
}

export default function NewEventForm({ navigation }) {
    const [form, setForm] = useState({
        name: '',
        date: '',
        time: '',
        place: '',
        logo: null,
        isRace: false,
        ageLimit: 'none',
        maxChildAge: '',
        medicalRequired: false,
        teamEvent: false,
        genderRestriction: 'any',
        description: '',
    });

    const [warning, setWarning] = useState('');
    const [showDatePicker, setShowDatePicker] = useState({ mode: null, visible: false });

    const handlePickLogo = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: 'image/png' });
        if (!result.canceled) {
            setForm({ ...form, logo: result.assets[0] });
        }
    };

    const handleAccept = async () => {
        try {
            await sendEventToServer(form);
            navigation.navigate('EventSelector');
        } catch (err) {
            alert('Error saving event');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <Text style={UNIFIED_STYLES.title}>New Event</Text>

                    <View style={styles.field}>
                        <Text style={styles.label}>Event name</Text>
                        <TextInput
                            style={styles.input}
                            value={form.name}
                            onChangeText={text => setForm({ ...form, name: text })}
                        />
                    </View>

                    <View style={styles.centerAligned}>
                        <TouchableOpacity style={styles.logoBox} onPress={handlePickLogo} activeOpacity={0.7}>
                            <Text style={styles.logoText}>
                                {form.logo ? form.logo.name : 'Upload logo (.png)'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Date & Time</Text>
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.label}>Date</Text>
                                {Platform.OS === 'web' ? (
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={e => setForm({ ...form, date: e.target.value })}
                                        style={styles.webInputDate}
                                    />
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => setShowDatePicker({ mode: 'date', visible: true })}
                                            style={styles.input}
                                        >
                                            <Text style={styles.inputText}>
                                                {form.date || 'YYYY-MM-DD'}
                                            </Text>
                                        </TouchableOpacity>
                                        {showDatePicker.visible && showDatePicker.mode === 'date' && (
                                            <View style={{ marginLeft: -12 }}>
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
                                            </View>
                                        )}
                                    </>
                                )}
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.label}>Time</Text>
                                {Platform.OS === 'web' ? (
                                    <input
                                        type="time"
                                        value={form.time}
                                        onChange={e => setForm({ ...form, time: e.target.value })}
                                        style={styles.webInputDate}
                                    />
                                ) : (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => setShowDatePicker({ mode: 'time', visible: true })}
                                            style={styles.input}
                                        >
                                            <Text style={styles.inputText}>
                                                {form.time || 'HH:MM'}
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
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Place</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Place"
                            placeholderTextColor="#aaa"
                            value={typeof form.place === 'string' ? form.place : ''}
                            editable={typeof form.place === 'string'}
                            onChangeText={text => {
                                if (typeof form.place !== 'string' && form.place) {
                                    setWarning('Clear map selection to type a place.');
                                } else {
                                    setWarning('');
                                    setForm({ ...form, place: text });
                                }
                            }}
                        />
                        <TouchableOpacity
                            style={[
                                styles.input,
                                { opacity: typeof form.place === 'string' && form.place.length > 0 ? 0.5 : 1 },
                            ]}
                            disabled={typeof form.place === 'string' && form.place.length > 0}
                            onPress={() => {
                                if (typeof form.place === 'string' && form.place.length > 0) {
                                    setWarning('Clear text input to choose a place on the map.');
                                } else {
                                    setWarning('');
                                    navigation.navigate('MapScreen', {
                                        onSelect: coords => setForm({ ...form, place: coords }),
                                    });
                                }
                            }}
                        >
                            <Text style={styles.inputText}>
                                {typeof form.place === 'object' ? 'Place selected on map' : (form.place || 'Choose place on map')}
                            </Text>
                        </TouchableOpacity>
                        {warning ? (
                            <Text style={styles.warning}>{warning}</Text>
                        ) : null}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Is it a race?</Text>
                        <TouchableOpacity
                            onPress={() => setForm({ ...form, isRace: !form.isRace })}
                            style={styles.radioRowTight}
                        >
                            <View style={styles.radioOuter}>
                                {form.isRace && <View style={styles.radioInner} />}
                            </View>
                            <Text style={styles.radioLabel}>Yes, it's a race</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Age limit</Text>
                        {['none', '18+', 'children'].map(option => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => setForm({ ...form, ageLimit: option })}
                                style={styles.radioRowTight}
                            >
                                <View style={styles.radioOuter}>
                                    {form.ageLimit === option && <View style={styles.radioInnerBlue} />}
                                </View>
                                <Text style={styles.radioLabel}>
                                    {option === 'none' ? 'No limit' : option === '18+' ? '18+' : 'For children only'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        {form.ageLimit === 'children' && (
                            <TextInput
                                style={[styles.input, { width: 120, marginTop: 8 }]}
                                placeholder="Max age"
                                keyboardType="numeric"
                                value={form.maxChildAge}
                                onChangeText={text => setForm({ ...form, maxChildAge: text })}
                            />
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Other</Text>
                        <TouchableOpacity
                            onPress={() => setForm({ ...form, medicalRequired: !form.medicalRequired })}
                            style={styles.radioRowTight}
                        >
                            <View style={styles.radioOuter}>
                                {form.medicalRequired && <View style={styles.radioInnerBlue} />}
                            </View>
                            <Text style={styles.radioLabel}>Requires medical certificate</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setForm({ ...form, teamEvent: !form.teamEvent })}
                            style={styles.radioRowTight}
                        >
                            <View style={styles.radioOuter}>
                                {form.teamEvent && <View style={styles.radioInnerBlue} />}
                            </View>
                            <Text style={styles.radioLabel}>Team event</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Gender restriction</Text>
                        {['any', 'male', 'female'].map(option => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => setForm({ ...form, genderRestriction: option })}
                                style={styles.radioRowTight}
                            >
                                <View style={styles.radioOuter}>
                                    {form.genderRestriction === option && <View style={styles.radioInnerBlue} />}
                                </View>
                                <Text style={styles.radioLabel}>
                                    {option === 'any' ? 'Any' : option.charAt(0).toUpperCase() + option.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        style={[styles.descriptionInput]}
                        value={form.description}
                        onChangeText={text => setForm({ ...form, description: text })}
                        placeholder="Event description"
                        placeholderTextColor="#aaa"
                        multiline
                        numberOfLines={4}
                    />
                </View>
            </ScrollView>
            <View style={[UNIFIED_STYLES.buttonRow, { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#f5f5f5' }]}>
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
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 30,
    },
    container: {
        flex: 1,
        width: '95%',
        maxWidth: 900,
        alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 20,
    },
    field: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
    },
    input: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#b0b0b0',
        borderRadius: 0,
        padding: 6,
        marginBottom: 4,
        fontFamily: 'System',
        fontSize: 15,
        color: '#222',
        shadowColor: '#fff',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    inputText: {
        fontSize: 16,
        fontFamily: FONT,
    },
    centerAligned: {
        alignItems: 'center',
        marginVertical: 10,
    },
    logoBox: {
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 3,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    logoText: {
        fontSize: 16,
        fontFamily: FONT,
    },
    section: {
        marginVertical: 12,
        padding: 8,
    },
    sectionLabel: {
        fontFamily: FONT,
        fontWeight: 'bold',
        fontSize: 16,
        color: '#1c1c1c',
        marginBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'rgb(28,28,28)',
        paddingBottom: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
        marginRight: 12,
    },
    webInputDate: {
        fontSize: 16,
        padding: 6,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 3,
    },
    warning: {
        color: 'red',
        marginTop: 5,
    },
    radioRowTight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 4,
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#1c1c1c',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#1c1c1c',
    },
    radioInnerBlue: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#1c1c1c',
    },
    radioLabel: {
        fontSize: 16,
    },
    descriptionInput: {
        marginTop: 24,
        height: 150,
        maxHeight: 150,
        textAlignVertical: 'top',
        marginBottom: 100,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#b0b0b0',
        borderRadius: 0,
        fontFamily: 'System',
        fontSize: 15,
        color: '#222',
    }
});
