import React, { useEffect, useState } from 'react';
import {
    View, Text, Alert, TextInput, ActivityIndicator, StyleSheet,
    TouchableOpacity, ScrollView, Platform
} from 'react-native';
import {
    primaryButton, primaryButtonText,
    secondaryButton, secondaryButtonText,
    editButton, editButtonText,
    saveButton, saveButtonText,
    deleteButton, deleteButtonText,
    cancelButton, cancelButtonText
} from "../../components/constants";
import { validateParticipant } from '../../utils/validateParticipant';

const FONT = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

const roles = ['spectator', 'runner']; // spectator = глядач, runner = учасник

export default function ManageRegistrations({ route, navigation }) {
    const folder = route.params?.folder;
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editParticipant, setEditParticipant] = useState({});
    const [validationErrors, setValidationErrors] = useState({});
    const [eventRestrictions, setEventRestrictions] = useState(null);


    // const eventRestrictions = {
    //     ...route.params?.eventRestrictions,
    //     isRace:
    //         route.params?.eventRestrictions?.isRace === true ||
    //         route.params?.eventRestrictions?.isRace === 'true'
    // };

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

    // Fetch participants
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

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.list}>
                {participants.map((item, idx) =>
                    editIndex === idx ? (
                        <View style={styles.card} key={idx}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={editParticipant.name}
                                onChangeText={name => setEditParticipant({ ...editParticipant, name })}
                                placeholder="Name"
                            />
                            {validationErrors.name && <Text style={styles.error}>{validationErrors.name}</Text>}

                            <Text style={styles.label}>Surname</Text>
                            <TextInput
                                style={styles.input}
                                value={editParticipant.surname}
                                onChangeText={surname => setEditParticipant({ ...editParticipant, surname })}
                                placeholder="Surname"
                            />
                            {validationErrors.surname && <Text style={styles.error}>{validationErrors.surname}</Text>}

                            <Text style={styles.label}>Age</Text>
                            <TextInput
                                style={styles.input}
                                value={editParticipant.age?.toString()}
                                onChangeText={age => setEditParticipant({ ...editParticipant, age })}
                                keyboardType="numeric"
                                placeholder="Age"
                            />
                            {validationErrors.age && <Text style={styles.error}>{validationErrors.age}</Text>}

                            <Text style={styles.label}>Gender</Text>
                            <TextInput
                                style={styles.input}
                                value={editParticipant.gender}
                                onChangeText={gender => setEditParticipant({ ...editParticipant, gender })}
                                placeholder="Gender"
                            />
                            {validationErrors.gender && <Text style={styles.error}>{validationErrors.gender}</Text>}

                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={editParticipant.email}
                                onChangeText={email => setEditParticipant({ ...editParticipant, email })}
                                placeholder="Email"
                            />
                            {validationErrors.email && <Text style={styles.error}>{validationErrors.email}</Text>}

                            <Text style={styles.label}>Phone</Text>
                            <TextInput
                                style={styles.input}
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
                                                <Text style={styles.roleText}>{role}</Text>
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
                        <View style={styles.card} key={idx}>
                            <Text style={styles.label}>Name</Text>
                            <Text style={styles.value}>{item.name}</Text>
                            <Text style={styles.label}>Surname</Text>
                            <Text style={styles.value}>{item.surname}</Text>
                            <Text style={styles.label}>Age</Text>
                            <Text style={styles.value}>{item.age}</Text>
                            <Text style={styles.label}>Gender</Text>
                            <Text style={styles.value}>{item.gender}</Text>
                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.value}>{item.email}</Text>
                            <Text style={styles.label}>Phone</Text>
                            <Text style={styles.value}>{item.phone}</Text>
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
                        </View>
                    )
                )}
            </ScrollView>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={secondaryButton}
                    onPress={() => navigation.navigate('EventSelector')}
                >
                    <Text style={secondaryButtonText}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
    },
    error: {
        color: '#b22222',
        fontSize: 16,
        fontFamily: 'System',
        borderWidth: 1,
        borderColor: '#808080',
        backgroundColor: '#fff8f8',
        padding: 8,
        margin: 8,
    },
    list: {
        padding: 16,
        backgroundColor: '#e0e0e0',
    },
    card: {
        backgroundColor: '#f0f0f0',
        borderRadius: 0,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        flexDirection: 'column',
        alignItems: 'flex-start',
        minWidth: 0,
    },
    label: {
        color: '#003399',
        fontSize: 13,
        marginTop: 4,
        fontFamily: 'System',
        fontWeight: 'bold',
        textShadowColor: '#fff',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
    },
    value: {
        color: '#222',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 2,
        fontFamily: 'System',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#b0b0b0',
        borderRadius: 0,
        padding: 6,
        marginBottom: 4,
        fontFamily: 'System',
        fontSize: 15,
        color: '#222',
        shadowColor: '#fff',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
        gap: 12,
    },
    roleRow: {
        flexDirection: 'row',
        marginTop: 4,
        marginBottom: 4,
    },
    roleButton: {
        backgroundColor: '#e0e0e0',
        borderWidth: 2,
        borderColor: '#b0b0b0',
        borderRadius: 0,
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginRight: 8,
        minWidth: 60,
        alignItems: 'center',
    },
    selectedRole: {
        backgroundColor: '#c0d8ff',
        borderColor: '#003399',
    },
    roleText: {
        color: '#003399',
        fontWeight: 'bold',
        fontFamily: 'System',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 16,
        backgroundColor: '#e0e0e0',
        borderTopWidth: 2,
        borderColor: '#b0b0b0',
    },
});