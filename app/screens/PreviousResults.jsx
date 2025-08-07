import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, StyleSheet, ActivityIndicator, Alert,
    TouchableOpacity, ScrollView
} from 'react-native';
import { UNIFIED_STYLES } from '../../components/constants';
import {
    secondaryButton, secondaryButtonText,
    deleteButtonText, deleteButton, editButtonText, editButton
} from '../../components/buttons_styles';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

export default function PreviousResults({ navigation, route }) {
    const eventId = route.params?.eventId;
    const [groupedResults, setGroupedResults] = useState({});
    const [expandedDates, setExpandedDates] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://events-server-eu5z.onrender.com/api/events/${eventId}/results`)
            .then(res => res.json())
            .then(data => {
                const grouped = {};
                data.forEach(item => {
                    const key = `${item.date}__${item.raceId}`;
                    if (!grouped[key]) grouped[key] = { date: item.date, raceId: item.raceId, entries: [] };
                    grouped[key].entries.push(item);
                });

                setGroupedResults(grouped);
                const defaultExpanded = Object.fromEntries(Object.keys(grouped).map(d => [d, true]));
                setExpandedDates(defaultExpanded);
            })
            .catch(err => Alert.alert('Error', err.message))
            .finally(() => setLoading(false));
    }, [eventId]);

    const handlePrintGroup = async (group) => {
        let htmlContent = `
        <h1>Race Results</h1>
        <h2>Date: ${formatDate(group.date)}, Race ID: ${group.raceId}</h2>
        <table border="1" cellspacing="0" cellpadding="5">
            <tr><th>ID</th><th>Time</th></tr>
            ${group.entries.map(e => `<tr><td>${e.id}</td><td>${e.time}</td></tr>`).join('')}
        </table>
    `;
        try {
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                fileName: 'race_results'
            });
            await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const toggleDate = (date) => {
        setExpandedDates(prev => ({
            ...prev,
            [date]: !prev[date]
        }));
    };

    const handleDeleteGroup = async (groupKey) => {
        try {
            const group = groupedResults[groupKey];
            const response = await fetch(
                `https://events-server-eu5z.onrender.com/api/events/${eventId}/results/${group.date}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                setGroupedResults(prev => {
                    const newData = { ...prev };
                    delete newData[groupKey];
                    return newData;
                });
            }
        } catch (err) {
            console.error('Error deleting group:', err);
        }
    };

    const formatDate = (dateStr) => {
        return `${dateStr.slice(0, 2)} ${dateStr.slice(2, 4)} ${dateStr.slice(4)}`;
    };

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} />;
    }

    return (
        <View style={UNIFIED_STYLES.container2}>
        <ScrollView>
            <Text style={styles.title}>Previous Results</Text>

            {Object.entries(groupedResults).map(([date, group]) => (
                <View key={date} style={styles.dateBlock}>
                    <TouchableOpacity onPress={() => toggleDate(date)}>
                        <Text style={styles.dateHeader}>
                            {formatDate(group.date)} {expandedDates[date]}
                        </Text>
                    </TouchableOpacity>

                    {expandedDates[date] && (
                        <View style={styles.table}>
                            <View style={styles.headerRow}>
                                <Text style={[styles.headerCell, { flex: 1 }]}>ID</Text>
                                <Text style={[styles.headerCell, { flex: 2 }]}>Time</Text>
                            </View>
                            {group.entries.map((item, idx) => (
                                <View key={idx} style={styles.row}>
                                    <Text style={[styles.cell, { flex: 1 }]}>{item.id}</Text>
                                    <Text style={[styles.cell, { flex: 2 }]}>{item.time}</Text>


                                </View>
                            ))}
                           <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginVertical: 8 }}>
                               <TouchableOpacity
                                   style={editButton}
                                   onPress={() => handlePrintGroup(group)}
                               >
                                   <Text style={editButtonText}>Print Results</Text>
                               </TouchableOpacity>
                               <TouchableOpacity
                                   style={deleteButton}
                                   onPress={() => handleDeleteGroup(date)}
                               >
                                   <Text style={deleteButtonText}>Delete</Text>
                               </TouchableOpacity>
                           </View>

                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    <TouchableOpacity style={[secondaryButton, {marginBottom : 20}]}
                      onPress={() => navigation.goBack()}>
        <Text style={secondaryButtonText}>Back</Text>
    </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    dateBlock: {
        marginBottom: 24,
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    table: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#aaa',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#ddd',
        paddingVertical: 6,
    },
    headerCell: {
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#eee',
        minHeight: 40,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    cell: {
        fontSize: 16,
        textAlign: 'center',
        paddingVertical: 6,
    },
});
