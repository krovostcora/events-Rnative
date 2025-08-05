// app/screens/RaceDetails.jsx
import React, { useState, useRef } from 'react';
import { Platform, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal, Alert } from 'react-native';
import {
    primaryButton, primaryButtonText,
    secondaryButton, secondaryButtonText,
    editButton, editButtonText,
    saveButton, saveButtonText,
    deleteButton, deleteButtonText,
    cancelButton, cancelButtonText,
    optionsButton, optionsButtonText
} from "../../components/buttons_styles";
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
                const aId = parseInt(a.id.replace('#', ''), 10);
                const bId = parseInt(b.id.replace('#', ''), 10);
                return order === 'asc' ? aId - bId : bId - aId;
            } else if (column === 'time') {
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
            <html>
            <head>
            <style>
            @page { margin: 0; }
            body { margin: 0; padding: 0; }
            table {
                border: 1px solid #000;
                border-collapse: collapse;
                font-size: 16px;
                width: auto;
                margin: 0 auto;
            }
            th, td {
                border: 1px solid #000;
                padding: 5px 10px;
                text-align: center;
            }
            </style>
            </head>
            <body>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Time</th>
                </tr>
                ${entries.map(e => `
                <tr>
                    <td>${e.id}</td>
                    <td>${e.time}</td>
                </tr>
                `).join('')}
            </table>
            </body>
            </html>
        `;
        try {
            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const handlePrintWeb = () => {
        const popup = window.open('', '_blank', 'width=600,height=600');
        popup.document.write(`
            <html>
            <head>
            <style>
            @page { margin: 0; }
            body { margin: 0; padding: 0; font-family: monospace; }
            table {
                border: 1px solid #000;
                border-collapse: collapse;
                font-size: 12px;
                width: 200px;
                margin: 20px auto;
            }
            th, td {
                border: 1px solid #000;
                padding: 4px 6px;
                text-align: center;
            }
            </style>
            </head>
            <body>
            <table>
                <tr><th>ID</th><th>Time</th></tr>
                ${entries.map(e => `<tr><td>${e.id}</td><td>${e.time}</td></tr>`).join('')}
            </table>
            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() { window.close(); };
                };
            </script>
            </body>
            </html>
        `);
        popup.document.close();
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
                            style={saveButton}
                            onPress={handleSaveEdit}
                        >
                            <Text style={saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={cancelButton}
                            onPress={() => setEditIndex(null)}
                        >
                            <Text style={cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <>
                    <Text style={[styles.cellId, { flex: 0.6 }]}>{item.id}</Text>
                    <Text style={[styles.cellTime, { flex: 1.1 }]}>{item.time}</Text>
                    <View style={[styles.cellOptions, { flex: 2 }]}>
                        <TouchableOpacity
                            style={editButton}
                            onPress={() => handleEdit(index)}>
                            <Text style={editButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={deleteButton}
                            onPress={() => handleDelete(index)}>
                            <Text style={deleteButtonText}>Delete</Text>
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
                <TouchableOpacity
                    style={optionsButton}
                    onPress={() => {
                        Platform.OS === 'web' ? handlePrintWeb() : handlePrint();
                    }}>
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

            <TouchableOpacity style={[secondaryButton, {marginBottom: 20}]} onPress={() => navigation.goBack()}>
                <Text style={secondaryButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '95%',
        maxWidth: 900,
        alignSelf: 'center',
        marginTop: 16,
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
        textAlign: 'center',
        paddingVertical: 10,
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