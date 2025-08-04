import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import {
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
} from '../../components/constants';
import { validateParticipant } from '../../utils/validateParticipant';


const FONT = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

function GenderRadio({ value, onChange }) {
    const options = [
        { label: 'M', value: 'male' },
        { label: 'F', value: 'female' },
        { label: 'Other', value: 'other' },
    ];
    return (
        <View style={styles.genderRow}>
            {options.map(opt => (
                <TouchableOpacity
                    key={opt.value}
                    style={[
                        styles.radioButton,
                        value === opt.value && styles.radioSelected
                    ]}
                    onPress={() => onChange(opt.value)}
                    activeOpacity={0.7}
                >
                    <View style={[
                        styles.radioCircle,
                        value === opt.value && styles.radioCircleSelected
                    ]}/>
                    <Text style={styles.radioLabel}>{opt.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

function RaceRoleRadio({ value, onChange }) {
    const options = [
        { label: 'Spectator', value: 'spectator' },
        { label: 'Participant', value: 'participant' },
    ];
    return (
        <View style={styles.genderRow}>
            {options.map(opt => (
                <TouchableOpacity
                    key={opt.value}
                    style={[
                        styles.radioButton,
                        value === opt.value && styles.radioSelected
                    ]}
                    onPress={() => onChange(opt.value)}
                    activeOpacity={0.7}
                >
                    <View style={[
                        styles.radioCircle,
                        value === opt.value && styles.radioCircleSelected
                    ]}/>
                    <Text style={styles.radioLabel}>{opt.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

export default function Registration({ navigation, route }) {
    const eventRestrictions = {
        ...route.params?.eventRestrictions,
        isRace: route.params?.eventRestrictions?.isRace === true || route.params?.eventRestrictions?.isRace === 'true'
    };
    const [form, setForm] = useState({
        name: '',
        surname: '',
        age: '',
        email: '',
        phone: '',
        gender: '',
        raceRole: 'spectator',
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));

        // Clear error when field changes
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        const { isValid, errors, normalizedForm } = validateParticipant(form, eventRestrictions);
        setValidationErrors(errors);

        if (!isValid) return;

        setIsSubmitting(true);

        try {
            const event = route.params?.event;

            if (!event) {
                throw new Error('Event data is missing');
            }

            const folderName = `${event.date.replace(/-/g, '')}_${event.name.toLowerCase().replace(/\s+/g, '')}`;

            const payload = {
                name: normalizedForm.name,
                surname: normalizedForm.surname,
                gender: normalizedForm.gender,
                age: normalizedForm.age,
                email: normalizedForm.email,
                phone: normalizedForm.phone,
            };

            if (event.isRace) {
                payload.raceRole = normalizedForm.raceRole || 'spectator';
            }

            console.log('Submitting to folder:', folderName);
            console.log('Payload:', JSON.stringify(payload, null, 2));

            const response = await fetch(
                `https://events-server-eu5z.onrender.com/api/events/${folderName}/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to register participant');
            }

            const data = await response.json();
            Alert.alert('Success', data.message || 'Registration successful!', [
                { text: 'OK', onPress: () => navigation.navigate('EventSelector') },
            ]);
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Error', error.message || 'Failed to register. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigation.navigate('EventSelector');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register as a Participant</Text>

            <ScrollView
                contentContainerStyle={styles.formBody}
                keyboardShouldPersistTaps="handled"
            >
                {/* Name Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Name *"
                    placeholderTextColor="#aaa"
                    value={form.name}
                    onChangeText={(v) => handleChange('name', v)}
                />
                {validationErrors.name && <Text style={styles.error}>{validationErrors.name}</Text>}

                {/* Surname Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Surname *"
                    placeholderTextColor="#aaa"
                    value={form.surname}
                    onChangeText={(v) => handleChange('surname', v)}
                />
                {validationErrors.surname && <Text style={styles.error}>{validationErrors.surname}</Text>}

                {/* Gender Selection */}
                <View style={styles.genderRow}>
                    <Text style={styles.genderLabel}>Gender:</Text>
                    <GenderRadio
                        value={form.gender}
                        onChange={(v) => handleChange('gender', v)}
                    />
                </View>
                {validationErrors.gender && <Text style={styles.error}>{validationErrors.gender}</Text>}

                {/* Age Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Age *"
                    placeholderTextColor="#aaa"
                    value={form.age}
                    onChangeText={(v) => handleChange('age', v.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                />
                {validationErrors.age && <Text style={styles.error}>{validationErrors.age}</Text>}

                {/* Email Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={form.email}
                    onChangeText={(v) => handleChange('email', v)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {validationErrors.email && <Text style={styles.error}>{validationErrors.email}</Text>}

                {/* Phone Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    placeholderTextColor="#aaa"
                    value={form.phone}
                    onChangeText={(v) => handleChange('phone', v.replace(/[^0-9+]/g, ''))}
                    keyboardType="phone-pad"
                />
                {validationErrors.phone && <Text style={styles.error}>{validationErrors.phone}</Text>}

                {/* Race Role (if event is race) */}
                {eventRestrictions.isRace && (
                    <>
                        <Text style={styles.genderLabel}>Race role:</Text>
                        <RaceRoleRadio
                            value={form.raceRole}
                            onChange={(v) => handleChange('raceRole', v)}
                        />
                        {validationErrors.raceRole && (
                            <Text style={styles.error}>{validationErrors.raceRole}</Text>
                        )}
                    </>
                )}
            </ScrollView>

            {/* Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={secondaryButton}
                    onPress={handleCancel}
                    disabled={isSubmitting}
                >
                    <Text style={secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[primaryButton, isSubmitting && { opacity: 0.7 }]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <Text style={primaryButtonText}>
                        {isSubmitting ? 'Processing...' : 'Submit'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        alignItems: 'center',
        paddingTop: 48,
    },
    title: {
        fontFamily: FONT,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111',
        letterSpacing: 1,
        marginBottom: 18,
        textAlign: 'center',
    },
    formBody: {
        width: 320,
        alignItems: 'stretch',
        paddingBottom: 120,
    },
    input: {
        width: '100%',
        height: 44,
        borderWidth: 1,
        borderColor: '#bbb',
        backgroundColor: '#fff',
        fontFamily: FONT,
        fontSize: 16,
        color: '#222',
        marginBottom: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginVertical: 12,
        borderRadius: 0,
    },
    error: {
        color: 'red',
        fontFamily: FONT,
        fontSize: 13,
        marginBottom: 6,
        marginLeft: 2,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 320,
        position: 'absolute',
        bottom: 36,
        left: 24,
    },
    genderRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 12,
        marginTop: 12,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    radioCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#bbb',
        backgroundColor: '#fff',
        marginRight: 6,
    },
    radioCircleSelected: {
        borderColor: '#000000',
        backgroundColor: '#1c1c1c',
    },
    genderLabel: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#222',
        marginRight: 18,
        alignSelf: 'center',
    },
    radioLabel: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#222',
    },
    radioSelected: {},
});
