import React, { useEffect, useState } from 'react';
import {
    View, Text, Alert, TextInput, ActivityIndicator, StyleSheet,
    TouchableOpacity, ScrollView, Platform
} from 'react-native';
import {
    editButton, editButtonText,
    saveButton, saveButtonText,
    deleteButton, deleteButtonText,
    cancelButton, cancelButtonText,
    secondaryButton, secondaryButtonText
} from "../../components/buttons_styles";
import { UNIFIED_STYLES } from '../../components/constants';
import { validateParticipant } from '../../utils/validateParticipant';

const FONT = Platform.OS === 'ios' ? 'System' : 'monospace';
const roles = ['spectator', 'runner'];

export default function ManageRegistrations({navigation, route }) {
    const folder = route.params?.folder;
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editParticipant, setEditParticipant] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [eventRestrictions, setEventRestrictions] = useState(null);
    const [expandedCards, setExpandedCards] = useState({}); // tracks which cards are expanded

    useEffect(() => {
        if (!folder) return;
        fetch(`https://events-server-eu5z.onrender.com/api/events/${folder}`)
            .then(res => res.json())
            .then(event => {
                setEventRestrictions({
                    isRace: event.isRace,
                    ageLimit: event.ageLimit,
                    maxChildAge: event.maxChildAge,
                    genderRestriction: event.genderRestriction,
                });
            })
            .catch(() => setError('Failed to load event restrictions'));
    }, [folder]);

    useEffect(() => {
        if (!folder) return;
        setLoading(true);
        fetch(`https://events-server-eu5z.onrender.com/api/events/${folder}/participants`)
            .then(res => res.json())
            .then(data => {
                setParticipants(data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load participants');
                setLoading(false);
            });
    }, [folder]);

    const handleDeleteParticipant = (id) => {
        Alert.alert(
            'Delete participant',
            'Are you sure you want to delete this participant?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await fetch(`https://events-server-eu5z.onrender.com/api/events/${folder}/participants/${id}`, {
                                method: 'DELETE'
                            });
                            setParticipants(prev => prev.filter(p => p.id !== id));
                        } catch {
                            setError('Failed to delete participant');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" /></View>;
    }

    if (error) {
        return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;
    }

    if (!participants.length) {
        return <View style={styles.center}><Text>No registrations yet.</Text></View>;
    }

    const toggleCard = (idx) => {
        setExpandedCards(prev => ({
            ...prev,
            [idx]: !prev[idx],
        }));
    };

    return (
        <View style={[{ flex: 1 }, UNIFIED_STYLES.container2]}>
            <Text style={UNIFIED_STYLES.title}>Participants</Text>
            <ScrollView contentContainerStyle={styles.list}>
                {participants.map((item, idx) =>
                    editIndex === idx ? (
                        <View style={styles.card} key={idx}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={UNIFIED_STYLES.input}
                                value={editParticipant.name}
                                onChangeText={name => setEditParticipant({ ...editParticipant, name })}
                                placeholder="Name"
                            />
                            {validationErrors.name && <Text style={styles.error}>{validationErrors.name}</Text>}

                            <Text style={styles.label}>Surname</Text>
                            <TextInput
                                style={UNIFIED_STYLES.input}
                                value={editParticipant.surname}
                                onChangeText={surname => setEditParticipant({ ...editParticipant, surname })}
                                placeholder="Surname"
                            />
                            {validationErrors.surname && <Text style={styles.error}>{validationErrors.surname}</Text>}

                            <Text style={styles.label}>Age</Text>
                            <TextInput
                                style={UNIFIED_STYLES.input}
                                value={editParticipant.age?.toString()}
                                onChangeText={age => setEditParticipant({ ...editParticipant, age })}
                                keyboardType="numeric"
                                placeholder="Age"
                            />
                            {validationErrors.age && <Text style={styles.error}>{validationErrors.age}</Text>}

                            <Text style={styles.label}>Gender</Text>
                            <TextInput
                                style={UNIFIED_STYLES.input}
                                value={editParticipant.gender}
                                onChangeText={gender => setEditParticipant({ ...editParticipant, gender })}
                                placeholder="Gender"
                            />
                            {validationErrors.gender && <Text style={styles.error}>{validationErrors.gender}</Text>}

                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={UNIFIED_STYLES.input}
                                value={editParticipant.email}
                                onChangeText={email => setEditParticipant({ ...editParticipant, email })}
                                placeholder="Email"
                            />
                            {validationErrors.email && <Text style={styles.error}>{validationErrors.email}</Text>}

                            <Text style={styles.label}>Phone</Text>
                            <TextInput
                                style={UNIFIED_STYLES.input}
                                value={editParticipant.phone}
                                onChangeText={phone => setEditParticipant({ ...editParticipant, phone })}
                                placeholder="Phone"
                                keyboardType="phone-pad"
                            />
                            {validationErrors.phone && <Text style={styles.error}>{validationErrors.phone}</Text>}

                            {eventRestrictions?.isRace && (
                                <>
                                    <Text style={styles.label}>Race Role</Text>
                                    <View style={styles.roleRow}>
                                        {roles.map(role => (
                                            <TouchableOpacity
                                                key={role}
                                                style={[
                                                    styles.roleButton,
                                                    editParticipant.raceRole === role && styles.selectedRole
                                                ]}
                                                onPress={() => setEditParticipant({ ...editParticipant, raceRole: role })}
                                            >
                                                <Text
                                                    style={[
                                                        styles.roleText,
                                                        editParticipant.raceRole !== role && { color: '#222' }
                                                    ]}
                                                >
                                                    {role}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    {validationErrors.raceRole && <Text style={styles.error}>{validationErrors.raceRole}</Text>}
                                </>
                            )}

                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={saveButton}
                                    onPress={async () => {
                                        const { isValid, errors } = validateParticipant(editParticipant, eventRestrictions);
                                        if (!isValid) {
                                            setValidationErrors(errors);
                                            return;
                                        }
                                        setValidationErrors({});
                                        try {
                                            await fetch(`https://events-server-eu5z.onrender.com/api/events/${folder}/participants/${editParticipant.id}`, {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify(editParticipant)
                                            });
                                            const updated = [...participants];
                                            updated[idx] = editParticipant;
                                            setParticipants(updated);
                                            setEditIndex(null);
                                        } catch {
                                            setError('Failed to update participant');
                                        }
                                    }}
                                >
                                    <Text style={saveButtonText}>Save</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={cancelButton}
                                    onPress={() => setEditIndex(null)}
                                >
                                    <Text style={cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            key={idx}
                            style={styles.card}
                            onPress={() => toggleCard(idx)}
                            activeOpacity={0.8}
                        >
                            {expandedCards[idx] ? (
                                <>
                                    {[
                                      { label: 'Name', value: item.name },
                                      { label: 'Surname', value: item.surname },
                                      { label: 'Age', value: item.age },
                                      { label: 'Gender', value: item.gender },
                                      { label: 'Email', value: item.email },
                                      { label: 'Phone', value: item.phone },
                                    ].map(({ label, value }) => (
                                      <React.Fragment key={label}>
                                        <Text style={styles.label}>{label}</Text>
                                        <Text style={styles.value}>{value}</Text>
                                      </React.Fragment>
                                    ))}
                                    {eventRestrictions?.isRace && item.raceRole && (
                                        <>
                                            <Text style={styles.label}>Race Role</Text>
                                            <Text style={styles.value}>{item.raceRole}</Text>
                                        </>
                                    )}
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                                        <TouchableOpacity
                                            style={editButton}
                                            onPress={() => {
                                                setEditIndex(idx);
                                                setEditParticipant({
                                                    ...item,
                                                    raceRole: eventRestrictions?.isRace ? (item.raceRole || '') : undefined
                                                });
                                            }}
                                        >
                                            <Text style={editButtonText}>Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={deleteButton}
                                            onPress={() => handleDeleteParticipant(item.id)}
                                        >
                                            <Text style={deleteButtonText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                <Text style={styles.summary}>{item.name} {item.surname}</Text>
                            )}
                        </TouchableOpacity>
                    )
                )}
            </ScrollView>
            <TouchableOpacity style={[secondaryButton, {marginBottom : 20}]}
                              onPress={() => navigation.goBack()}>
                <Text style={secondaryButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        padding: 10,
        paddingBottom: 40,
    },
    card: {
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 4,
        padding: 8,
        marginBottom: 10,
        backgroundColor: '#f8f8f8'
    },
    summary: {
        fontFamily: FONT,
        fontSize: 16,
        paddingVertical: 10,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 6,
        fontFamily: FONT,
    },
    value: {
        fontFamily: FONT,
        fontSize: 15,
        marginBottom: 4,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    roleRow: {
        flexDirection: 'row',
        marginTop: 6,
        marginBottom: 4,
    },
    roleButton: {
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 3,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 8,
    },
    selectedRole: {
        backgroundColor: '#555',
    },
    roleText: {
        color: '#fff',
    },
    error: {
        color: 'red',
        fontSize: 13,
        marginTop: 2,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
