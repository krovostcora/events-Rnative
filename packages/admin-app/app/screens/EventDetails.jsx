import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Platform, Linking, Image, Alert } from 'react-native';
import {
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
    optionsButton, optionsButtonText,
} from '@events/shared/src/components/buttons_styles';
import { UNIFIED_STYLES } from '@events/shared/src/components/constants';
import Registration from "@events/shared/src/screens/Registration";

const FONT = Platform.OS === 'ios' ? 'System' : 'monospace';

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

    const handleDelete = () => {
        if (!event?.folder) {
            Alert.alert('Error', 'Folder not found, cannot delete event');
            return;
        }

        Alert.alert(
            'Delete Event',
            'Are you sure you want to delete this event?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const res = await fetch(`https://events-server-eu5z.onrender.com/api/events/${event.folder}`, {
                                method: 'DELETE',
                            });
                            if (!res.ok) {
                                const text = await res.text();
                                throw new Error(text || 'Failed to delete event');
                            }
                            navigation.navigate('EventSelector');
                        } catch (err) {
                            Alert.alert('Error', err.message);
                        }
                    }
                }
            ]
        );
    };


    const handleEdit = () => {
        navigation.navigate('EditEvent', { event }); // You need to create this screen
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
            <View style={UNIFIED_STYLES.container2}>
                <Text style={styles.error}>{error || 'Event not found'}</Text>
            </View>
        );
    }

    return (
        <View style={UNIFIED_STYLES.container2}>
            <ScrollView
                contentContainerStyle={{alignItems: 'center', paddingBottom: 24}}
                style={{width: '100%'}}
            >
                <Text style={UNIFIED_STYLES.title}>{event.name}</Text>

                <View style={styles.infoBox}>
                    <View style={styles.logoBox}>
                        {event.logo ? (
                            <Image
                                source={{uri: event.logo}}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        ) : (
                            <Text style={styles.logoText}>LOGO</Text>
                        )}
                    </View>

                    <View style={styles.detailsBox}>
                        <Text style={[styles.detailText, { fontWeight: 'bold' }]}>Date: </Text>
                        <Text style={styles.detailText}>{event.date}</Text>
                        <Text style={[styles.detailText, { fontWeight: 'bold' }]}>Time: </Text>
                        <Text style={styles.detailText}>{event.time}</Text>
                        <TouchableOpacity onPress={handleLocationPress} activeOpacity={0.7}>
                            <Text style={[styles.linkText, { fontWeight: 'bold', color: '#000' }]}>Place: </Text>
                            <Text style={styles.linkText}>{event.place}</Text>
                        </TouchableOpacity>
                        {event.arrival && (
                            <Text style={styles.detailText}>{event.arrival}</Text>
                        )}
                    </View>
                </View>

                {(event.ageLimit && event.ageLimit !== 'none' && event.ageLimit !== '0') ||
                (event.medicalRequired && event.medicalRequired !== 'no' && event.medicalRequired !== '0') ||
                (event.teamEvent && event.teamEvent !== 'no' && event.teamEvent !== '0') ||
                (event.genderRestriction && event.genderRestriction !== 'any' && event.genderRestriction !== 'no') ||
                (event.description && event.description.trim() !== '') ? (
                    <View style={styles.eventDetailsBox}>
                        <Text style={styles.sectionLabel}>Event details:</Text>
                        {event.ageLimit && event.ageLimit !== 'none' && event.ageLimit !== '0' && (
                            <Text style={styles.moreDetailText}>
                                <Text style={{ fontWeight: 'bold' }}>Age limit: </Text>
                                {event.ageLimit === '18+'
                                    ? '18+'
                                    : event.ageLimit === 'children'
                                        ? `For children only${
                                            event.maxChildAge && event.maxChildAge !== '0'
                                                ? ` (max age: ${event.maxChildAge})`
                                                : ''
                                        }`
                                        : event.ageLimit}
                            </Text>
                        )}
                        {event.teamEvent && event.teamEvent !== 'no' && event.teamEvent !== '0' && (
                            <Text style={styles.moreDetailText}>
                                <Text style={{ fontWeight: 'bold' }}>Team event: </Text>
                                Yes
                            </Text>
                        )}
                        {event.medicalRequired && event.medicalRequired !== 'no' && event.medicalRequired !== '0' && (
                            <Text style={styles.moreDetailText}>
                                <Text style={{ fontWeight: 'bold' }}>Medical certificate: </Text>
                                Required
                            </Text>
                        )}
                        {event.genderRestriction && event.genderRestriction !== 'any' && event.genderRestriction !== 'no' && (
                            <Text style={styles.moreDetailText}>
                                <Text style={{ fontWeight: 'bold' }}>Gender restriction: </Text>
                                {event.genderRestriction.charAt(0).toUpperCase() + event.genderRestriction.slice(1)}
                            </Text>
                        )}
                        {event.description && event.description.trim() !== '' && (
                            <Text style={styles.moreDetailText}>
                                <Text style={{ fontWeight: 'bold' }}>Description / Notes: </Text>
                                {event.description}
                            </Text>
                        )}
                    </View>
                ) : null}

                {event.isRace && (
                    <TouchableOpacity
                        style={[primaryButton, {marginTop: 24, marginBottom: 12}]}
                        onPress={() => navigation.navigate('RaceControls')}
                    >
                        <Text style={primaryButtonText}>Race Details</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[primaryButton, {marginBottom: 80, marginTop: 20}]}
                    onPress={() =>
                        navigation.navigate('ManageRegistrations', {folder: getFolderName(event)})
                    }
                >
                    <Text style={primaryButtonText}>Manage registrations</Text>
                </TouchableOpacity>
            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: -45 }}>
                <TouchableOpacity
                    style={[optionsButton, { marginRight: 12 }]}
                    onPress={handleEdit}
                >
                    <Text style={optionsButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={optionsButton}
                    onPress={handleDelete}
                >
                    <Text style={optionsButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>

            <View style={[UNIFIED_STYLES.buttonRow, {marginTop: 60}]}>
                <TouchableOpacity style={secondaryButton} onPress={() => navigation.navigate('EventSelector')}>
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
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#eee',
        padding: 10,
        width: '90%',
        alignItems: 'center',
    },
    logoBox: {
        width: 150,
        height: 150,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 18,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        borderRadius: 6,
    },
    detailsBox: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    detailText: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#222',
        marginBottom: 10,
        justifyContent: 'flex-start',
    },
    linkText: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#003399',
        fontWeight: 'semibold',
        justifyContent: 'flex-start',
    },
    eventDetailsBox: {
        backgroundColor: '#eee',
        width: '90%',
        padding: 16,
    },
    sectionLabel: {
        fontFamily: FONT,
        textShadowColor: '#fff',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
        fontWeight: 'bold',
        fontSize: 20,
        color: '#1c1c1c',
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: 'rgb(28,28,28)',
        paddingBottom: 5,
    },
    moreDetailText: {
        fontFamily: FONT,
        fontSize: 15,
        color: '#222',
        marginBottom: 20,
        fontWeight: '500',

    },
});
