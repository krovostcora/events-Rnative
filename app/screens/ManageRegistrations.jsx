import React, { useEffect, useState } from 'react';
import {
    View, Text, Alert, TextInput, ActivityIndicator, StyleSheet,
    TouchableOpacity, ScrollView, Platform
} from 'react-native';
import {
    primaryButton, primaryButtonText,
    secondaryButton, secondaryButtonText
} from "../../components/constants";
import { validateParticipant } from '../../utils/validateParticipant';

const FONT = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

const roles = ['spectator', 'participant', 'runner'];

export default function ManageRegistrations({ route, navigation }) {
    const folder = route.params?.folder;
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editParticipant, setEditParticipant] = useState({});
    const [validationErrors, setValidationErrors] = useState({});

    const eventRestrictions = {
        ...route.params?.eventRestrictions,
        isRace:
            route.params?.eventRestrictions?.isRace === true ||
            route.params?.eventRestrictions?.isRace === 'true'
    };

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
                {participants.map((item, idx) => (
                    <View style={styles.row} key={idx}>
                        {editIndex === idx ? (
                            <>
                                <TextInput
                                    style={styles.input}
                                    value={editParticipant.name}
                                    onChangeText={name => setEditParticipant({ ...editParticipant, name })}
                                    placeholder="Name"
                                />
                                {validationErrors.name && <Text style={styles.error}>{validationErrors.name}</Text>}

                                <TextInput
                                    style={styles.input}
                                    value={editParticipant.surname}
                                    onChangeText={surname => setEditParticipant({ ...editParticipant, surname })}
                                    placeholder="Surname"
                                />
                                {validationErrors.surname && <Text style={styles.error}>{validationErrors.surname}</Text>}

                                <TextInput
                                    style={styles.input}
                                    value={editParticipant.age?.toString()}
                                    onChangeText={age => setEditParticipant({ ...editParticipant, age })}
                                    keyboardType="numeric"
                                    placeholder="Age"
                                />
                                {validationErrors.age && <Text style={styles.error}>{validationErrors.age}</Text>}

                                <TextInput
                                    style={styles.input}
                                    value={editParticipant.gender}
                                    onChangeText={gender => setEditParticipant({ ...editParticipant, gender })}
                                    placeholder="Gender"
                                />
                                {validationErrors.gender && <Text style={styles.error}>{validationErrors.gender}</Text>}

                                <TextInput
                                    style={styles.input}
                                    value={editParticipant.email}
                                    onChangeText={email => setEditParticipant({ ...editParticipant, email })}
                                    placeholder="Email"
                                />
                                {validationErrors.email && <Text style={styles.error}>{validationErrors.email}</Text>}

                                <TextInput
                                    style={styles.input}
                                    value={editParticipant.phone}
                                    onChangeText={phone => setEditParticipant({ ...editParticipant, phone })}
                                    placeholder="Phone"
                                    keyboardType="phone-pad"
                                />
                                {validationErrors.phone && <Text style={styles.error}>{validationErrors.phone}</Text>}

                                {eventRestrictions.isRace && (
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
                                        style={styles.editButton}
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
                                        <Text style={styles.editButtonText}>Save</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => setEditIndex(null)}
                                    >
                                        <Text style={styles.deleteButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                <Text style={styles.name}>{item.name} {item.surname}</Text>
                                <Text style={styles.details}>Age: {item.age} | Gender: {item.gender} | Email: {item.email}</Text>
                                <Text style={styles.details}>
                                    Phone: {item.phone}
                                    {eventRestrictions.isRace && item.raceRole ? ` | Role: ${item.raceRole}` : ''}
                                </Text>
                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() => {
                                            setEditIndex(idx);
                                            setEditParticipant({
                                                ...item,
                                                raceRole: eventRestrictions.isRace ? (item.raceRole || '') : undefined
                                            });
                                        }}
                                    >
                                        <Text style={styles.editButtonText}>Edit</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeleteParticipant(item.id)}
                                    >
                                        <Text style={styles.deleteButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                ))}
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
    },
    error: {
        color: 'red',
        fontSize: 16,
    },
    list: {
        padding: 16,
    },
    row: {
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        elevation: 1,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    details: {
        color: '#555',
        fontSize: 14,
        marginTop: 4,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
        gap: 12,
    },
    editButton: {
        backgroundColor: '#e0e0e0',
        borderColor: '#b0b0b0',
        borderWidth: 1,
        borderRadius: 3,
        paddingVertical: 5,
        paddingHorizontal: 16,
        marginLeft: 8,
        shadowColor: '#fff',
        shadowOffset: { width: -1, height: -1 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    deleteButton: {
        backgroundColor: '#e0e0e0',
        borderColor: '#b0b0b0',
        borderWidth: 1,
        borderRadius: 3,
        paddingVertical: 5,
        paddingHorizontal: 16,
        marginLeft: 8,
        shadowColor: '#fff',
        shadowOffset: { width: -1, height: -1 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
    },
    editButtonText: {
        color: '#0033cc',
        fontWeight: 'bold',
        fontSize: 15,
        textShadowColor: '#fff',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
    },
    deleteButtonText: {
        color: '#cc0000',
        fontWeight: 'bold',
        fontSize: 15,
        textShadowColor: '#fff',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 0,
    },
});