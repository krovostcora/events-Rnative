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
                        <Image source={{uri: event.logo}} style={styles.logoImage} resizeMode="contain"/>
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

            {event.isRace && (
                <TouchableOpacity
                    style={[primaryButton, {marginTop: 24, marginBottom: 12}]}
                    onPress={() => navigation.navigate('RaceControls')}
                >
                    <Text style={primaryButtonText}>Race Details</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity
                style={[primaryButton, {marginBottom: 80}]}
                onPress={() => {}}
            >
                <Text style={primaryButtonText}>Manage registrations</Text>
            </TouchableOpacity>

            <View style={styles.moreDetailsBox}>
                <Text style={styles.sectionLabel}>Event details:</Text>
                {event.ageLimit && event.ageLimit !== 'none' && event.ageLimit !== '0' && (
                    <Text style={styles.moreDetailText}>
                        Age limit: {event.ageLimit === '18+' ? '18+' :
                        event.ageLimit === 'children' ? `For children only${event.maxChildAge && event.maxChildAge !== '0' ? ` (max age: ${event.maxChildAge})` : ''}` :
                            event.ageLimit}
                    </Text>
                )}
                {event.medicalRequired && event.medicalRequired !== 'no' && event.medicalRequired !== '0' && (
                    <Text style={styles.moreDetailText}>
                        Medical certificate: Required
                    </Text>
                )}
                {event.teamEvent && event.teamEvent !== 'no' && event.teamEvent !== '0' && (
                    <Text style={styles.moreDetailText}>
                        Team event: Yes
                    </Text>
                )}
                {event.genderRestriction && event.genderRestriction !== 'any' && event.genderRestriction !== 'no' && (
                    <Text style={styles.moreDetailText}>
                        Gender restriction: {event.genderRestriction.charAt(0).toUpperCase() + event.genderRestriction.slice(1)}
                    </Text>
                )}
            </View>

            {event.description && event.description.trim() !== '' && (
                <View style={styles.descriptionBox}>
                    <Text style={styles.descriptionLabel}>Event description:</Text>
                    <Text style={styles.descriptionText}>{event.description}</Text>
                </View>
            )}

            <View style={[styles.buttonRow, { marginTop: 60 }]}>
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
    sectionLabel: {
        fontFamily: FONT,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
    },
    moreDetailsBox: {
        width: '100%',
        marginTop: 18,
        padding: 14,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        marginBottom: 8,
    },
    moreDetailText: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#222',
        marginBottom: 10,
        fontWeight: '500',
    },
    linkText: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#007AFF',
        textDecorationLine: 'underline',
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
    descriptionBox: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 14,
        marginTop: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
    },
    descriptionLabel: {
        fontFamily: FONT,
        fontSize: 15,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 6,
    },
    descriptionText: {
        fontFamily: FONT,
        fontSize: 15,
        color: '#222',
    },
});