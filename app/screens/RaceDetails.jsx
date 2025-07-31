// app/screens/RaceDetails.jsx
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import {
    optionsButton,
    optionsButtonText,
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
} from '../components/constants';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';


export default function RaceDetails({ navigation }) {
    const [running, setRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [entries, setEntries] = useState([]);
    const timerRef = useRef(null);

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

    const renderRow = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.id}</Text>
            <Text style={styles.cell}>{item.time}</Text>
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
                        <Text style={styles.headerCell}>ID</Text>
                        <Text style={styles.headerCell}>Time</Text>
                    </View>
                }
            />

            <TouchableOpacity style={primaryButton} onPress={toggleTimer}>
                <Text style={primaryButtonText}>{running ? 'Stop' : 'Start'}</Text>
            </TouchableOpacity>

            <View style={styles.controls}>
                <TouchableOpacity style={optionsButton} onPress={() => {}}>
                    <Text style={optionsButtonText}>Options</Text>
                </TouchableOpacity>
                <TouchableOpacity style={optionsButton} onPress={handlePrint}>
                    <Text style={optionsButtonText}>Print</Text>
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
        margin: 8,
    },
    timerDisplay: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 16,
        padding: 6,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    cell: {
        flex: 1,
        fontSize: 16,
        padding: 6,
        borderRightWidth: 1,
        borderColor: '#000',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#ddd',
        borderBottomWidth: 1,
        borderColor: '#000',
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 16,
        padding: 6,
        borderRightWidth: 1,
        borderColor: '#000',
    },
    controls: {
        marginVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
});
