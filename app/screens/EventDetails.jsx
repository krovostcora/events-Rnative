import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Linking, Dimensions } from 'react-native';

const FONT = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

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
        const mockEvents = {
            '20250710_summerparty': {
                name: 'Summer Party',
                date: '2025-07-10',
                time: '18:00',
                place: 'Vilnius City Park',
                arrival: 'Arrive 15 min before start'
            },
            '20250901_birthdaybash': {
                name: 'Birthday Bash',
                date: '2025-09-01',
                time: '20:00',
                place: 'Downtown Lounge',
                arrival: 'Arrive 10 min before start'
            },
            '20251031_halloweennight': {
                name: 'Halloween Night',
                date: '2025-10-31',
                time: '21:30',
                place: 'Haunted House Club',
                arrival: 'Arrive 20 min before start'
            }
        };
        const data = mockEvents[eventName];
        if (data) setEvent(data);
        else setError('Event not found');
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

    // Dummy link for location
    const handleLocationPress = () => {
        Linking.openURL('https://maps.google.com');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{event.name}</Text>
            <View style={styles.topRow}>
                <View style={styles.logoBox}>
                    <Text style={styles.logoText}>LOGO</Text>
                </View>
                <View style={styles.detailsBox}>
                    <Text style={styles.detailText}>Date: {event.date}</Text>
                    <Text style={styles.detailText}>Time: {event.time}</Text>
                    <TouchableOpacity onPress={handleLocationPress} activeOpacity={0.7}>
                        <Text style={styles.linkText}>{event.place}</Text>
                    </TouchableOpacity>
                    <Text style={styles.detailText}>{event.arrival}</Text>
                </View>
            </View>
            <View style={styles.mapBox}>
                <Text style={styles.mapText}>MAP / ROUTE PREVIEW</Text>
            </View>
            {/* Manage registrations button centered above bottom */}
            <TouchableOpacity
                style={styles.manageButton}
                onPress={() => {}}
            >
                <Text style={styles.manageButtonText}>Manage registrations</Text>
            </TouchableOpacity>
            {/* Cancel bottom left */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.navigate('EventSelector')}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => navigation.navigate('ParticipantCard')}
                >
                    <Text style={styles.startButtonText}>Registrate</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        paddingTop: 36,
        alignItems: 'center',
    },
    title: {
        fontFamily: FONT,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111',
        letterSpacing: 1,
        marginBottom: 24,
        textAlign: 'center',
    },
    topRow: {
        flexDirection: 'row',
        width: 495,
        maxWidth: '95%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 24,
        gap: 24,
    },
    logoBox: {
        width: 122,
        height: 122,
        borderWidth: 1,
        borderColor: '#bbb',
        backgroundColor: '#fafafa',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0,
    },
    logoText: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#888',
        letterSpacing: 1,
    },
    detailsBox: {
        flex: 1,
        justifyContent: 'flex-start',
        gap: 8,
        marginLeft: 24,
    },
    detailText: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#222',
        marginBottom: 2,
        letterSpacing: 1,
    },
    linkText: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#1976d2',
        textDecorationLine: 'underline',
        marginBottom: 2,
        letterSpacing: 1,
    },
    mapBox: {
        width: 495,
        maxWidth: '95%',
        height: 120,
        borderWidth: 1,
        borderColor: '#bbb',
        backgroundColor: '#fafafa',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 36,
        borderRadius: 0,
    },
    mapText: {
        fontFamily: FONT,
        fontSize: 18,
        color: '#888',
        letterSpacing: 2,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 36,
        left: 0,
        right: 0,
        width: '100%',
        gap: 24,
    },
    manageButton: {
        position: 'static',
        left: 30,
        right: 30,
        bottom: 130, // adjust as needed to keep above the bottom buttons
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: '#444',
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 0,
        paddingVertical: 16,
        paddingHorizontal: 15,
        minWidth: 150,
        alignItems: 'center',
        alignSelf: 'center',
    },
    manageButtonText: {
        color: '#fff',
        fontFamily: FONT,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 0,
        paddingVertical: 16,
        paddingHorizontal: 28,
        minWidth: 110,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#222',
        fontFamily: FONT,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    startButton: {
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 0,
        paddingVertical: 16,
        paddingHorizontal: 28,
        minWidth: 120,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#fff',
        fontFamily: FONT,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    loading: {
        textAlign: 'center',
        fontStyle: 'italic',
        fontFamily: FONT,
        color: '#555',
        fontSize: 16,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        fontFamily: FONT,
        fontSize: 16,
    },
});