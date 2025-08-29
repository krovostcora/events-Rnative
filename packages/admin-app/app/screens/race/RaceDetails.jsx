// app/screens/RaceDetails.jsx
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import {
    primaryButton, primaryButtonText,
    secondaryButton, secondaryButtonText,
    editButton, editButtonText,
    saveButton, saveButtonText,
    deleteButton, deleteButtonText,
    cancelButton, cancelButtonText,
    optionsButton, optionsButtonText
} from '@events/shared/src//components/buttons_styles';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import {UNIFIED_STYLES} from "@events/shared/src/components/constants";


export default function RaceDetails({ navigation, route }) {
    const [entries, setEntries] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [editEntry, setEditEntry] = useState({ id: '', time: '' });
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const eventId = route.params?.eventId;
    const [running, setRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const timerRef = useRef(null);

    const sortEntries = (column) => {
        let order = sortOrder;
        if (sortBy === column) {
            order = sortOrder === 'asc' ? 'desc' : 'asc';
            setSortOrder(order);
        } else {
            setSortBy(column);
            setSortOrder('asc');
            order = 'asc';
        }
        const sorted = [...entries].sort((a, b) => {
            if (column === 'id') {
                // Remove '#' and compare as numbers
                const aId = parseInt(a.id.replace('#', ''), 10);
                const bId = parseInt(b.id.replace('#', ''), 10);
                return order === 'asc' ? aId - bId : bId - aId;
            } else if (column === 'time') {
                return order === 'asc' ? a.raceTime - b.raceTime : b.raceTime - a.raceTime;
            }
            return 0;
        });
        setEntries(sorted);
    };

    const handlePrint = async () => {
        let htmlContent = `
        <h1>Race Results</h1>
        <table border="1" cellspacing="0" cellpadding="5">
            <tr><th>ID</th><th>Time</th></tr>
            ${entries.map(e => `<tr><td>${e.id}</td><td>${formatRaceTime(e)}</td></tr>`).join('')}


        </table>
    `;

        try {
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                fileName: 'race results'
            });
            await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleEdit = (index) => {
        const entry = entries[index];
        const elapsed = entry.startTime && entry.finishTime
            ? Math.floor((entry.finishTime - entry.startTime) / 1000)
            : 0;
        const hrs = Math.floor(elapsed / 3600);
        const mins = Math.floor((elapsed % 3600) / 60);
        const secs = elapsed % 60;

        setEditIndex(index);
        setEditEntry({
            id: entry.id,
            // show time in format HH:MM:SS
            time: `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`,
        });
    };


    const handleSaveEdit = () => {
        const valid = /^([0-1]?\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(editEntry.time);
        if (!valid) {
            Alert.alert('Error', 'Time must be in HH:MM:SS format');
            return;
        }

        // break HH:MM:SS to seconds
        const [hrs, mins, secs] = editEntry.time.split(':').map(Number);
        const elapsedMs = (hrs * 3600 + mins * 60 + secs) * 1000;

        const updated = [...entries];
        const oldEntry = updated[editIndex];

        updated[editIndex] = {
            ...oldEntry,
            startTime: oldEntry.startTime || Date.now(),
            finishTime: (oldEntry.startTime || Date.now()) + elapsedMs,
            id: editEntry.id,
        };

        setEntries(updated);
        setEditIndex(null);
    };


    const handleDelete = (index) => {
        const updated = entries.filter((_, i) => i !== index);
        setEntries(updated);
    };

    React.useEffect(() => {
        if (running) {
            timerRef.current = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [running]);

    const handleStartNewRace = () => {
        setEntries([]);
        setEditIndex(null);
        setTime(0);
        const now = Date.now();
        setStartTime(now);
        setRunning(true);
    };

    const handleFinish = () => {
        if (!startTime) return;
        const newId = entries.length + 1;
        setEntries([
            ...entries,
            {
                id: `${newId}`,
                startTime: startTime,
                finishTime: Date.now(),
            }
        ]);
    };

    const formatRaceTime = (entry) => {
        if (!entry.startTime || !entry.finishTime) return '00:00:00';
        const elapsed = Math.floor((entry.finishTime - entry.startTime) / 1000);
        const hrs = Math.floor(elapsed / 3600);
        const mins = Math.floor((elapsed % 3600) / 60);
        const secs = elapsed % 60;
        return `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    };

    const renderRow = ({ item, index }) => (
        <View style={styles.row}>
            {editIndex === index ? (
                <>
                    <TextInput
                        value={editEntry.id}
                        style={[styles.cellId, { flex: 0.6 }]}
                        keyboardType="numeric"
                        onChangeText={(id) => setEditEntry({ ...editEntry, id: id.replace(/[^0-9]/g, '') })}
                    />
                    <TextInput
                        value={editEntry.time}
                        style={[styles.cellTime, { flex: 1.1 }]}
                        onChangeText={(text) => {
                            const cleaned = text.replace(/[^0-9]/g, '');
                            let formatted = '';
                            if (cleaned.length > 0) formatted += cleaned.slice(0,2);
                            if (cleaned.length > 2) formatted += ':' + cleaned.slice(2,4);
                            if (cleaned.length > 4) formatted += ':' + cleaned.slice(4,6);
                            setEditEntry({ ...editEntry, time: formatted });
                        }}
                        keyboardType="numeric"
                    />
                    <View style={[styles.cellOptions, { flex: 2 }]}>
                        <TouchableOpacity style={saveButton} onPress={handleSaveEdit}>
                            <Text style={saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={cancelButton} onPress={() => setEditIndex(null)}>
                            <Text style={cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <>
                    <Text style={[styles.cellId, { flex: 0.6 }]}>{item.id}</Text>
                    <Text style={[styles.cellTime, { flex: 1.1 }]}>{formatRaceTime(item)}</Text>

                    <View style={[styles.cellOptions, { flex: 2 }]}>
                        <TouchableOpacity style={editButton} onPress={() => handleEdit(index)}>
                            <Text style={editButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={deleteButton} onPress={() => handleDelete(index)}>
                            <Text style={deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );

    const handleSaveResults = async () => {
        try {
            const response = await fetch(`https://events-server-eu5z.onrender.com/api/events/${eventId}/results`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results: entries }),
            });
            if (!response.ok) throw new Error('Failed to save results');
            Alert.alert('Success', 'Results saved!');
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    return (
        <View style={UNIFIED_STYLES.container2}>

            <Text style={styles.timerDisplay}>{formatTime(time)}</Text>

            <FlatList
                data={entries}
                style={{ marginBottom: 20 }}
                renderItem={renderRow}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={[styles.headerCell, { flex: 0.6 }]}
                            onPress={() => sortEntries('id')}
                        >
                            <Text style={styles.headerText}>
                                <Text style={styles.headerBold}>ID</Text>
                                {' '}{sortBy === 'id' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.headerCell, { flex: 1.1 }]}
                            onPress={() => sortEntries('time')}
                        >
                            <Text style={styles.headerText}>
                                <Text style={styles.headerBold}>Time</Text>
                                {' '}{sortBy === 'time' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
                            </Text>
                        </TouchableOpacity>

                        <View style={[styles.headerCell, { flex: 2 }]}>
                            <Text style={styles.headerBold}>Options</Text>
                        </View>
                    </View>
                }
            />

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 16, gap: 16 }}>
                <TouchableOpacity
                    style={[
                        optionsButton,
                        {
                            width: 160,
                            alignSelf: 'center',
                            paddingVertical: 14,
                        }
                    ]}
                    onPress={handleStartNewRace}
                >
                    <Text style={optionsButtonText}>Start new race</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        primaryButton,
                        {
                            width: 160,
                            alignSelf: 'center',
                            paddingVertical: 14,
                        }
                    ]}
                    onPress={handleFinish}
                >
                    <Text style={primaryButtonText}>Finish</Text>
                </TouchableOpacity>

            </View>
            <View style={[styles.controls, { flexWrap: 'nowrap', marginVertical: 10 }]}>

                <TouchableOpacity
                    style={[optionsButton, { flex: 1, maxWidth: '25%', paddingHorizontal: 12 }]}
                    onPress={handleSaveResults}
                >
                    <Text style={optionsButtonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[optionsButton, {
                        flex: 1,
                        maxWidth: '25%',
                        paddingHorizontal: 12,
                    }]}
                    onPress={handlePrint}
                >
                    <Text style={optionsButtonText}>Print</Text>
                </TouchableOpacity>

            </View>

            <View style={[styles.controls, { marginBottom: 20, justifyContent: 'center' }]}>
            <TouchableOpacity style={secondaryButton}
                              onPress={() => navigation.goBack()}>
                <Text style={secondaryButtonText}>Back</Text>
            </TouchableOpacity>
                <TouchableOpacity
                    style={[primaryButton]}
                    onPress={() => navigation.navigate('PreviousResults', { eventId })}
                >
                    <Text style={primaryButtonText}>Previous results</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        padding: 12,
    },
    timerDisplay: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 16,
        backgroundColor: '#fff',
        padding: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        color: '#333',
        fontWeight: 'bold',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#ccc',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#888',
    },
    headerCell: {
        flex: 1,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: 'transparent',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        minHeight: 50,
        alignItems: 'center',
    },
    cellId: {
        flex: 1,
        paddingVertical: 10,
        textAlign: 'center',
        borderRightWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        paddingHorizontal: 0,
        borderWidth: 0,
        backgroundColor: 'transparent',
        minWidth: 0,
    },
    cellTime: {
        flex: 1,
        paddingVertical: 10,
        textAlign: 'center',
        borderRightWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        paddingHorizontal: 0,
        borderWidth: 0,
        backgroundColor: 'transparent',
        minWidth: 0,
    },
    cellOptions: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    controls: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: 12,
        rowGap: 12,
    },
    headerBold: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});


