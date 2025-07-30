import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
    toggleButton,
    toggleButtonActive,
    toggleButtonText,
} from '../components/constants'; // шлях залежить від твоєї структури

const FONT = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

export default function DateSearch({ navigation }) {
    const [mode, setMode] = useState('single');
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const formatDate = d =>
        `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1)
            .toString()
            .padStart(2, '0')}.${d.getFullYear()}`;

    const handleSearch = () => {
        navigation.navigate('EventResults', {
            start: startDate,
            end: mode === 'range' ? endDate : startDate,
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search Events by Date</Text>

            <View style={styles.toggleRow}>
                <TouchableOpacity
                    style={[toggleButton, mode === 'single' && toggleButtonActive]}
                    onPress={() => setMode('single')}
                >
                    <Text style={toggleButtonText}>Single Day</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[toggleButton, mode === 'range' && toggleButtonActive]}
                    onPress={() => setMode('range')}
                >
                    <Text style={toggleButtonText}>Date Range</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.input} onPress={() => setShowStart(true)}>
                <Text style={styles.inputText}>
                    {mode === 'single' ? 'Select day' : 'Start date'}: {formatDate(startDate)}
                </Text>
            </TouchableOpacity>
            {showStart && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={(_, date) => {
                        setShowStart(false);
                        if (date) setStartDate(date);
                    }}
                />
            )}

            {mode === 'range' && (
                <>
                    <TouchableOpacity style={styles.input} onPress={() => setShowEnd(true)}>
                        <Text style={styles.inputText}>End date: {formatDate(endDate)}</Text>
                    </TouchableOpacity>
                    {showEnd && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={(_, date) => {
                                setShowEnd(false);
                                if (date) setEndDate(date);
                            }}
                        />
                    )}
                </>
            )}

            <TouchableOpacity style={[primaryButton, { marginTop: 32, marginBottom: 16 }]} onPress={handleSearch}>
                <Text style={primaryButtonText}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity style={secondaryButton} onPress={() => navigation.goBack()}>
                <Text style={secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        alignItems: 'center',
        paddingTop: 80,
    },
    title: {
        fontFamily: FONT,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111',
        letterSpacing: 1,
        marginBottom: 24,
        textAlign: 'center',
    },
    toggleRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    input: {
        width: 280,
        height: 44,
        borderWidth: 1,
        borderColor: '#bbb',
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 12,
        borderRadius: 0,
        marginBottom: 16,
    },
    inputText: {
        color: '#222',
        fontFamily: FONT,
        fontSize: 16,
    },
});
