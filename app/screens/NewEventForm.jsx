import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
} from '../../components/buttons_styles';
import { UNIFIED_STYLES } from '../../components/constants';

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
            <View style={UNIFIED_STYLES.container}>
                <ScrollView
                    style={{ alignSelf: 'stretch' }}
                    contentContainerStyle={{
                        alignSelf: 'center',
                        paddingBottom: 100,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                <TextInput
                    style={[UNIFIED_STYLES.input, { marginBottom: 20, fontSize: 20, fontFamily: FONT}]}
                    value={form.name}
                    onChangeText={text => setForm({ ...form, name: text })}
                    placeholder="Write the name of the event"
                    placeholderTextColor="#aaa"
                />

                <TouchableOpacity style={styles.logoBox} onPress={handlePickLogo} activeOpacity={0.7}>
                    <Text style={styles.logoText}>
                        {form.logo ? form.logo.name : 'Upload logo (.png)'}
                    </Text>
                </TouchableOpacity>

                {/* Date Picker */}
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
                            onPress={() =>
                                setShowDatePicker({ mode: 'date', visible: true })
                            }
                            style={UNIFIED_STYLES.input}
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

                {/* Time Picker */}
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
                            onPress={() =>
                                setShowDatePicker({ mode: 'time', visible: true })
                            }
                            style={UNIFIED_STYLES.input}
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

                {/* Place Input and Map Picker */}
                <TextInput
                    style={UNIFIED_STYLES.input}
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
                    style={[UNIFIED_STYLES.input, { opacity: typeof form.place === 'string' && form.place.length > 0 ? 0.5 : 1 }]}
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
                    <Text style={{ fontFamily: FONT, fontSize: 16, lineHeight: 44, color: form.place ? '#222' : '#aaa' }}>
                        {typeof form.place === 'object' ? 'Place selected on map' : (form.place || 'Choose place on map')}
                    </Text>
                </TouchableOpacity>
                {warning ? (
                    <Text style={{ color: 'red', marginBottom: 8, fontFamily: FONT }}>{warning}</Text>
                ) : null}

                {/* Race Toggle */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
                    <TouchableOpacity
                        onPress={() => setForm({ ...form, isRace: !form.isRace })}
                        style={styles.radioOuter}
                    >
                        {form.isRace && <View style={styles.radioInner} />}
                    </TouchableOpacity>
                    <Text style={{ fontFamily: FONT, fontSize: 20, color: '#222', marginTop: 20 }}>It's a race</Text>
                </View>

                {/* Age Limit Radio Buttons */}
                <View style={{ marginBottom: 14 }}>
                    <Text style={styles.sectionLabel}>Age limit</Text>
                    {['none', '18+', 'children'].map(option => (
                        <TouchableOpacity
                            key={option}
                            onPress={() => setForm({ ...form, ageLimit: option })}
                            style={styles.radioRow}
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
                            style={[UNIFIED_STYLES.input, { width: 120 }]}
                            placeholder="Max age"
                            keyboardType="numeric"
                            value={form.maxChildAge}
                            onChangeText={text => setForm({ ...form, maxChildAge: text })}
                        />
                    )}
                </View>

                {/* Other Dynamic Fields */}
                <View style={{ marginBottom: 14 }}>
                    <TouchableOpacity
                        onPress={() => setForm({ ...form, medicalRequired: !form.medicalRequired })}
                        style={styles.radioRow}
                    >
                        <View style={styles.radioOuter}>
                            {form.medicalRequired && <View style={styles.radioInnerBlue} />}
                        </View>
                        <Text style={styles.radioLabel}>Requires medical certificate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setForm({ ...form, teamEvent: !form.teamEvent })}
                        style={styles.radioRow}
                    >
                        <View style={styles.radioOuter}>
                            {form.teamEvent && <View style={styles.radioInnerBlue} />}
                        </View>
                        <Text style={styles.radioLabel}>Team event</Text>
                    </TouchableOpacity>
                </View>

                {/* Gender Restriction Radio Buttons */}
                <View style={{ marginBottom: 14 }}>
                    <Text style={styles.sectionLabel}>Gender restriction</Text>
                    {['any', 'male', 'female'].map(option => (
                        <TouchableOpacity
                            key={option}
                            onPress={() => setForm({ ...form, genderRestriction: option })}
                            style={styles.radioRow}
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

                {/* Description Input */}
                <TextInput
                    style={[UNIFIED_STYLES.input, { height: 150, maxHeight: 150, textAlignVertical: 'top', marginBottom: 24 }]}
                    value={form.description}
                    onChangeText={text => setForm({ ...form, description: text })}
                    placeholder="Event description"
                    placeholderTextColor="#aaa"
                    multiline
                    numberOfLines={4}
                />
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
        </View>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    logoBox: {
        width: 150,
        height: 150,
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
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
    },
    webInputDate: {
        width: 300,
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
    },
    radioOuter: {
        marginTop: 20,
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
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    radioLabel: {
        fontFamily: FONT,
        fontSize: 18,
        color: '#222',
        marginTop: 20
    },
    sectionLabel: {
        fontWeight: 'bold',
        fontFamily: FONT,
        fontSize: 18,
        color: '#222',
        marginBottom: 6,
    },
});