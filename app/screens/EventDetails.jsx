import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Linking, Image } from 'react-native';
import {
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
} from '../components/constants';

const FONT = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

export default function EventDetails({ route, navigation }) {
    const eventId = route.params?.event;
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!eventId) {
            setError('No event selected');
            setLoading(false);
            return;
        }

        fetch(`https://events-server-eu5z.onrender.com/api/events/${eventId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Event not found');
                return res.json();
            })
            .then((data) => {
                setEvent(data);
            })
            .catch((err) => {
                setError(err.message || 'Failed to load event');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [eventId]);

    const handleLocationPress = () => {
        if (event?.place) {
            const url = `https://maps.google.com/?q=${encodeURIComponent(event.place)}`;
            Linking.openURL(url);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loading}>Loading event details...</Text>
            </View>
        );
    }

    if (error || !event) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>{error || 'Event not found'}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{event.name}</Text>

            <View style={styles.topRow}>
                <View style={styles.logoBox}>
                    {event.logo ? (
                        <Image source={{ uri: event.logo }} style={styles.logoImage} resizeMode="contain" />
                    ) : (
                        <Text style={styles.logoText}>LOGO</Text>
                    )}

                </View>

                <View style={styles.detailsBox}>
                    <Text style={styles.detailText}>Date: {event.date}</Text>
                    <Text style={styles.detailText}>Time: {event.time}</Text>
                    <TouchableOpacity onPress={handleLocationPress} activeOpacity={0.7}>
                        <Text style={styles.linkText}>{event.place}</Text>
                    </TouchableOpacity>
                    {event.arrival && (
                        <Text style={styles.detailText}>{event.arrival}</Text>
                    )}
                </View>
            </View>

            {/*<View style={styles.mapBox}>*/}
            {/*    <Text style={styles.mapText}>MAP / ROUTE PREVIEW</Text>*/}
            {/*</View>*/}

            <TouchableOpacity
                style={[primaryButton, { marginBottom: 80 }]}
                onPress={() => {}}
            >
                <Text style={primaryButtonText}>Manage registrations</Text>
            </TouchableOpacity>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={secondaryButton}
                    onPress={() => navigation.navigate('EventSelector')}
                >
                    <Text style={secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={primaryButton}
                    onPress={() => navigation.navigate('ParticipantCard')}
                >
                    <Text style={primaryButtonText}>Registrate</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        paddingHorizontal: 24,
        paddingTop: 48,
        alignItems: 'center',
    },
    title: {
        fontFamily: FONT,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#222',
    },
    topRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    logoBox: {
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: '#bbb',
        backgroundColor: '#fafafa',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 24,
    },
    logoText: {
        fontFamily: FONT,
        fontSize: 14,
        color: '#888',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },

    detailsBox: {
        justifyContent: 'center',
    },
    detailText: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#222',
        marginBottom: 6,
    },
    linkText: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
    mapBox: {
        width: '100%',
        height: 150,
        backgroundColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    mapText: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#444',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
    },
    error: {
        fontFamily: FONT,
        fontSize: 16,
        color: 'red',
    },
    loading: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#555',
    },
});
