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
} from '../../components/buttons_styles';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import {UNIFIED_STYLES} from "../../components/constants";


export default function RaceDetails({ navigation, route }) {
    const [running, setRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [entries, setEntries] = useState([]);
    const timerRef = useRef(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editEntry, setEditEntry] = useState({ id: '', time: '' });
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const eventId = route.params?.eventId;

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
                // Compare time strings as HH:MM:SS
                return order === 'asc'
                    ? a.time.localeCompare(b.time)
                    : b.time.localeCompare(a.time);
            }
            return 0;
        });
        setEntries(sorted);
    };

    const handleStartNewRace = () => {
        setEntries([]);
        setTime(0);
        setRunning(false);
        setEditIndex(null);
    };

    const formatTime = (t) => {
        const seconds = Math.floor(t / 1000) % 60;
        const minutes = Math.floor(t / 60000) % 60;
        const hours = Math.floor(t / 3600000);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handlePrint = async () => {
        let htmlContent = `
        <h1>Race Results</h1>
        <table border="1" cellspacing="0" cellpadding="5">
            <tr><th>ID</th><th>Time</th></tr>
            ${entries.map(e => `<tr><td>${e.id}</td><td>${e.time}</td></tr>`).join('')}
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

    const toggleTimer = () => {
        if (running) {
            clearInterval(timerRef.current);
            const newId = entries.length + 1;
            setEntries([...entries, { id: `${newId}`, time: formatTime(time) }]);
        } else {
            setTime(0);
            timerRef.current = setInterval(() => setTime((t) => t + 1000), 1000);
        }
        setRunning(!running);
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditEntry(entries[index]);
    };

    const handleSaveEdit = () => {
        const valid = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(editEntry.time);
        if (!valid) {
            Alert.alert('Error', 'Time must be in HH:MM:SS format');
            return;
        }
        const updated = [...entries];
        updated[editIndex] = { ...editEntry };
        setEntries(updated);
        setEditIndex(null);
    };

    const handleDelete = (index) => {
        const updated = entries.filter((_, i) => i !== index);
        setEntries(updated);
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
                        onChangeText={(time) => setEditEntry({ ...editEntry, time })}
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
                    <Text style={[styles.cellTime, { flex: 1.1 }]}>{item.time}</Text>
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

            <TouchableOpacity
                style={[primaryButton, { width: '80%', alignSelf: 'center' }]}
                onPress={toggleTimer}
            >
                <Text style={primaryButtonText}>{running ? 'Stop' : 'Start'}</Text>
            </TouchableOpacity>

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
                        maxWidth: '40%',
                        paddingHorizontal: 12,
                    }]}
                    onPress={handleStartNewRace}
                >
                    <Text style={optionsButtonText}>Start new race</Text>
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


