// app/screens/RaceDetails.jsx
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import {
    optionsButton,
    optionsButtonText,
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
} from '../../components/constants';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';


export default function RaceDetails({ navigation }) {
    const [running, setRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [entries, setEntries] = useState([]);
    const timerRef = useRef(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editEntry, setEditEntry] = useState({ id: '', time: '' });
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const handleStartNewRace = () => {
        setEntries([]);
        setTime(0);
        setRunning(false);
        setEditIndex(null);
    };

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
            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };


    const toggleTimer = () => {
        if (running) {
            clearInterval(timerRef.current);
            const newId = entries.length + 1;
            setEntries([...entries, { id: `#${newId}`, time: formatTime(time) }]);
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
                        onChangeText={(id) => setEditEntry({ ...editEntry, id })}
                    />
                    <TextInput
                        value={editEntry.time}
                        style={[styles.cellTime, { flex: 1.1 }]}
                        onChangeText={(time) => setEditEntry({ ...editEntry, time })}
                    />
                    <View style={[styles.cellOptions, { flex: 2 }]}>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSaveEdit}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setEditIndex(null)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <>
                    <Text style={[styles.cellId, { flex: 0.6 }]}>{item.id}</Text>
                    <Text style={[styles.cellTime, { flex: 1.1 }]}>{item.time}</Text>
                    <View style={[styles.cellOptions, { flex: 2 }]}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEdit(index)}>
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDelete(index)}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );




    return (
        <View style={styles.container}>

            <Text style={styles.timerDisplay}>{formatTime(time)}</Text>

            <FlatList
                data={entries}
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

            <TouchableOpacity style={primaryButton} onPress={toggleTimer}>
                <Text style={primaryButtonText}>{running ? 'Stop' : 'Start'}</Text>
            </TouchableOpacity>

            <View style={styles.controls}>
                <TouchableOpacity style={optionsButton} onPress={handlePrint}>
                    <Text style={optionsButtonText}>Print</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[optionsButton, { minWidth: 130, paddingHorizontal: 22 }]}
                    onPress={handleStartNewRace}
                >
                    <Text style={optionsButtonText}>Start new race</Text>
                </TouchableOpacity>
                <TouchableOpacity style={optionsButton} onPress={() => {}}>
                    <Text style={optionsButtonText}>Save</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={secondaryButton} onPress={() => navigation.goBack()}>
                <Text style={secondaryButtonText}>Back</Text>
            </TouchableOpacity>
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
        borderRadius: 6,
        elevation: 2,
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
    },
    cellTime: {
        flex: 1,
        paddingVertical: 10,
        textAlign: 'center',
        borderRightWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
    },
    cellOptions: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    editButton: {
        backgroundColor: '#e0e0e0',
        borderColor: '#b0b0b0',
        borderWidth: 1,
        borderRadius: 3,
        paddingVertical: 5,
        paddingHorizontal: 16,
        marginLeft: 8,
        shadowColor: '#fff',
        shadowOffset: { width: -1, height: -1 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    deleteButton: {
        backgroundColor: '#e0e0e0',
        borderColor: '#b0b0b0',
        borderWidth: 1,
        borderRadius: 3,
        paddingVertical: 5,
        paddingHorizontal: 16,
        marginLeft: 8,
        shadowColor: '#fff',
        shadowOffset: { width: -1, height: -1 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    editButtonText: {
        color: '#0033cc',
        fontWeight: 'bold',
        fontSize: 15,
        textShadowColor: '#fff',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
        borderColor: '#888',
        borderWidth: 1,
        borderRadius: 3,
        paddingVertical: 5,
        paddingHorizontal: 16,
        marginLeft: 8,
        shadowColor: '#fff',
        shadowOffset: { width: -1, height: -1 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: 'bold',
        fontSize: 15,
        textShadowColor: '#fff',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
    },
    deleteButtonText: {
        color: '#cc0000',
        fontWeight: 'bold',
        fontSize: 15,
        textShadowColor: '#fff',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
    },
    saveButton: {
        backgroundColor: '#e0e0e0',
        borderColor: '#888',
        borderWidth: 1,
        borderRadius: 3,
        paddingVertical: 5,
        paddingHorizontal: 16,
        marginLeft: 8,
        shadowColor: '#fff',
        shadowOffset: { width: -1, height: -1 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    saveButtonText: {
        color: '#009900',
        fontWeight: 'bold',
        fontSize: 15,
        textShadowColor: '#fff',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
    },
    controls: {
        marginVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    headerBold: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});


