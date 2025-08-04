import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Platform, Linking, Image } from 'react-native';
import {
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
} from '../../components/buttons_styles';
import { UNIFIED_STYLES } from '../../components/constants';

const FONT = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

export default function EventDetails({ route, navigation }) {
    const eventId = route.params?.event;
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getFolderName = (event) => {
        if (!event) return '';
        if (event.folder) return event.folder;
        return `${event.date.replace(/-/g, '')}_${event.name.toLowerCase().replace(/\s+/g, '')}`;
    };

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
            <View style={UNIFIED_STYLES.container}>
                <Text style={styles.loading}>Loading event details...</Text>
            </View>
        );
    }

    if (error || !event) {
        return (
            <View style={UNIFIED_STYLES.container}>
                <Text style={styles.error}>{error || 'Event not found'}</Text>
            </View>
        );
    }

    return (
        <View style={UNIFIED_STYLES.container}>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 24 }} style={{ width: '100%' }}>
                <Text style={UNIFIED_STYLES.title}>{event.name}</Text>

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

                {event.isRace && (
                    <TouchableOpacity
                        style={[primaryButton, { marginTop: 24, marginBottom: 12 }]}
                        onPress={() => navigation.navigate('RaceControls')}
                    >
                        <Text style={primaryButtonText}>Race Details</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[primaryButton, { marginBottom: 80 }]}
                    onPress={() => navigation.navigate('ManageRegistrations', { folder: getFolderName(event) })}
                >
                    <Text style={primaryButtonText}>Manage registrations</Text>
                </TouchableOpacity>

                {(event.ageLimit && event.ageLimit !== 'none' && event.ageLimit !== '0') ||
                (event.medicalRequired && event.medicalRequired !== 'no' && event.medicalRequired !== '0') ||
                (event.teamEvent && event.teamEvent !== 'no' && event.teamEvent !== '0') ||
                (event.genderRestriction && event.genderRestriction !== 'any' && event.genderRestriction !== 'no') ||
                (event.description && event.description.trim() !== '') ? (
                        <View style={{ alignSelf: 'stretch' }}>
                    <View style={styles.moreDetailsBox}>
                        <Text style={styles.sectionLabel}>Event details:</Text>
                        {event.ageLimit && event.ageLimit !== 'none' && event.ageLimit !== '0' && (
                            <Text style={styles.moreDetailText}>
                                Age limit: {event.ageLimit === '18+' ? '18+' :
                                event.ageLimit === 'children'
                                    ? `For children only${event.maxChildAge && event.maxChildAge !== '0' ? ` (max age: ${event.maxChildAge})` : ''}`
                                    : event.ageLimit}
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
                        {event.description && event.description.trim() !== '' && (
                            <>
                                <Text style={styles.moreDetailText}>Description / Notes: {event.description}</Text>
                            </>
                        )}
                    </View>
                </View>
                ) : null}
            </ScrollView>

            <View style={[UNIFIED_STYLES.buttonRow, { marginTop: 60 }]}>
                <TouchableOpacity
                    style={secondaryButton}
                    onPress={() => navigation.navigate('EventSelector')}
                >
                    <Text style={secondaryButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={primaryButton}
                    onPress={() => {
                        if (!event) return;
                        navigation.navigate('Registration', {
                            event: {
                                ...event,
                                folder: getFolderName(event),
                            },
                            eventRestrictions: {
                                ageLimit: event.ageLimit,
                                maxChildAge: event.maxChildAge,
                                genderRestriction: event.genderRestriction,
                                isRace: event.isRace === true || event.isRace === 'true',
                            },
                        });
                    }}
                >
                    <Text style={primaryButtonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topRow: {
        flexDirection: 'row',
        marginBottom: 18,
        backgroundColor: '#f0f0f0',
        alignSelf: 'center',
        padding: 8,
        paddingInline: 60,
    },
    logoBox: {
        width: 150,
        height: 150,
        borderWidth: 2,
        borderColor: '#b0b0b0',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18,
        shadowColor: '#fff',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    logoText: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
        fontSize: 13,
        color: '#888',
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    detailsBox: {
        justifyContent: 'center',
        paddingInline: 10,
    },
    detailText: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
        fontSize: 18,
        color: '#222',
        marginBottom: 10,

    },
    sectionLabel: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003399',
        marginBottom: 15,
        textShadowColor: '#fff',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
    },
    moreDetailsBox: {
        marginHorizontal: 40, // instead of paddingInline
        marginTop: 12,
        padding: 10,
        backgroundColor: '#f0f0f0',
        shadowRadius: 0,
        marginBottom: 6,
        alignSelf: 'center',
        minWidth: 260, // optional, for better look on wide screens
        maxWidth: 600, // optional, to prevent stretching on web
    },
    moreDetailText: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
        fontSize: 15,
        color: '#222',
        marginBottom: 10,
        fontWeight: '500',
    },
    linkText: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
        fontSize: 15,
        color: '#003399',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    error: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
        fontSize: 15,
        color: '#b22222',
        backgroundColor: '#fff8f8',
        borderWidth: 2,
        borderColor: '#b0b0b0',
        padding: 8,
        margin: 8,
        alignSelf: 'stretch',
        textAlign: 'center',
    },
    loading: {
        fontFamily: Platform.OS === 'ios' ? 'System' : 'monospace',
        fontSize: 15,
        color: '#555',
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        borderColor: '#b0b0b0',
        padding: 8,
        margin: 8,
        alignSelf: 'stretch',
        textAlign: 'center',
    },
});