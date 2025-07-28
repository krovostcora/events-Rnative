import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export default function EventSelector({ navigation }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data instead of API call
        const mockEvents = [
            { id: '1', name: 'Summer Party', folder: '20250710_summerparty' },
            { id: '2', name: 'Birthday Bash', folder: '20250901_birthdaybash' },
            { id: '3', name: 'Halloween Night', folder: '20251031_halloweennight' }
        ];

        setTimeout(() => {
            setEvents(mockEvents);
            setLoading(false);
        }, 500);
    }, []);

    const handleAccept = () => {
        if (selectedEvent) {
            navigation.navigate('EventDetails', { event: selectedEvent.folder });
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.dropdown} onPress={() => setDropdownOpen(prev => !prev)}>
                <Text style={styles.dropdownText}>{selectedEvent?.name || 'Select Event'}</Text>
            </TouchableOpacity>

            {dropdownOpen && (
                <FlatList
                    data={events}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.item,
                                selectedEvent?.id === item.id && styles.selectedItem
                            ]}
                            onPress={() => {
                                setSelectedEvent(item);
                                setDropdownOpen(false);
                            }}
                        >
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            <TouchableOpacity
                style={[styles.button, !selectedEvent && styles.disabled]}
                onPress={handleAccept}
                disabled={!selectedEvent}
            >
                <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>

            {loading && <Text style={styles.status}>Loading events...</Text>}

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NewEventForm')}>
                    <Text style={styles.buttonText}>New party</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    dropdown: {
        padding: 12,
        backgroundColor: '#eaeaea',
        marginBottom: 12
    },
    dropdownText: { fontSize: 16 },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    selectedItem: { backgroundColor: '#d0f0c0' },
    button: {
        backgroundColor: '#007AFF',
        padding: 12,
        marginTop: 12,
        alignItems: 'center'
    },
    disabled: { backgroundColor: '#aaa' },
    buttonText: { color: '#fff' },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 16
    },
    status: {
        marginTop: 10,
        fontStyle: 'italic',
        color: '#555'
    }
});
