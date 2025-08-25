import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { primaryButton, primaryButtonText, secondaryButton, secondaryButtonText } from '../../components/buttons_styles';
import { UNIFIED_STYLES } from '../../components/constants';

export default function EditEvent({ route, navigation }) {
    const { event } = route.params;

    const [name, setName] = useState(event.name);
    const [date, setDate] = useState(event.date);
    const [time, setTime] = useState(event.time);
    const [place, setPlace] = useState(event.place);
    const [description, setDescription] = useState(event.description);

    const handleSave = async () => {
        try {
            const response = await fetch(`https://events-server-eu5z.onrender.com/api/events/${event.folder}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, date, time, place, description }),
            });

            if (!response.ok) {
                throw new Error('Failed to update event');
            }

            Alert.alert('Success', 'Event updated successfully');
            navigation.navigate('EventDetails', { eventId: event.id });
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={UNIFIED_STYLES.container2}>
            <Text style={styles.title}>Edit Event</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Event Name"
            />

            <Text style={styles.label}>Date</Text>
            <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>Time</Text>
            <TextInput
                style={styles.input}
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM"
            />

            <Text style={styles.label}>Place</Text>
            <TextInput
                style={styles.input}
                value={place}
                onChangeText={setPlace}
                placeholder="Event Location"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Event Description"
                multiline
            />

            <View style={styles.buttonRow}>
                <TouchableOpacity style={secondaryButton} onPress={() => navigation.goBack()}>
                    <Text style={secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={primaryButton} onPress={handleSave}>
                    <Text style={primaryButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        marginBottom: 16,
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});