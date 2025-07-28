import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

export default function EventDetails({ route, navigation }) {
    const eventName = typeof route.params?.event === 'string' ? route.params.event : null;

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!eventName) {
            setError('No event selected');
            setLoading(false);
            return;
        }

        // Mocked data for the selected event
        const mockEvents = {
            '20250710_summerparty': {
                name: 'Summer Party',
                date: '2025-07-10',
                time: '18:00',
                place: 'Vilnius City Park'
            },
            '20250901_birthdaybash': {
                name: 'Birthday Bash',
                date: '2025-09-01',
                time: '20:00',
                place: 'Downtown Lounge'
            },
            '20251031_halloweennight': {
                name: 'Halloween Night',
                date: '2025-10-31',
                time: '21:30',
                place: 'Haunted House Club'
            }
        };

        const data = mockEvents[eventName];
        if (data) {
            setEvent(data);
        } else {
            setError('Event not found');
        }
        setLoading(false);
    }, [eventName]);

    if (loading || error || !event) {
        return (
            <View style={styles.container}>
                <Text style={error ? styles.error : styles.loading}>
                    {error || 'Loading event details...'}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{event.name}</Text>

            <View style={styles.row}>
                <Image
                    source={require('../../assets/placeholder-logo.png')}
                    style={styles.logo}
                />
                <View style={styles.details}>
                    <Text style={styles.sectionTitle}>START</Text>
                    <Text>Date: {event.date}</Text>
                    <Text>Time: {event.time}</Text>
                    <Text>Location: {event.place}</Text>

                    <Text style={[styles.sectionTitle, { marginTop: 16 }]}>FINISH</Text>
                    <Text>Start and finish at the same location</Text>
                    <Text>Additional info</Text>
                </View>
            </View>

            <View style={styles.buttonRow}>
                <Button title="Cancel" onPress={() => navigation.navigate('EventSelector')} />
                <Button title="Manage Registrations" onPress={() => {}} />
                <Button title="Registrate" onPress={() => navigation.navigate('ParticipantCard')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        gap: 12
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginRight: 12
    },
    details: {
        flex: 1,
        justifyContent: 'space-around'
    },
    sectionTitle: {
        fontWeight: 'bold'
    },
    buttonRow: {
        marginTop: 24,
        gap: 12
    },
    loading: {
        textAlign: 'center',
        fontStyle: 'italic'
    },
    error: {
        color: 'red',
        textAlign: 'center'
    }
});
