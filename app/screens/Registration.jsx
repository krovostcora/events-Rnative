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
} from '../../components/buttons_styles';
import { UNIFIED_STYLES } from '../../components/constants';
import { validateParticipant } from '../../utils/validateParticipant';

const FONT = Platform.OS === 'ios' ? 'System' : 'monospace';

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
            Alert.alert('Error', error.message || 'Failed to register. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigation.navigate('EventSelector');
    };

    return (
        <View style={UNIFIED_STYLES.container}>
            <Text style={styles.title}>Register as a Participant</Text>

            <ScrollView
                contentContainerStyle={styles.formBody}
                keyboardShouldPersistTaps="handled"
            >
                <TextInput
                    style={[UNIFIED_STYLES.input, { marginBottom: 20, marginTop: 20 }]}
                    placeholder="Name *"
                    placeholderTextColor="#aaa"
                    value={form.name}
                    onChangeText={(v) => handleChange('name', v)}
                />
                {validationErrors.name && <Text style={styles.error}>{validationErrors.name}</Text>}

                <TextInput
                    style={[UNIFIED_STYLES.input, { marginBottom: 20 }]}
                    placeholder="Surname *"
                    placeholderTextColor="#aaa"
                    value={form.surname}
                    onChangeText={(v) => handleChange('surname', v)}
                />
                {validationErrors.surname && <Text style={styles.error}>{validationErrors.surname}</Text>}

                <View style={styles.genderRow}>
                    <Text style={styles.genderLabel}>Gender:</Text>
                    <GenderRadio
                        value={form.gender}
                        onChange={(v) => handleChange('gender', v)}
                    />
                </View>
                {validationErrors.gender && <Text style={styles.error}>{validationErrors.gender}</Text>}

                <TextInput
                    style={[UNIFIED_STYLES.input, { marginBottom: 20 }]}
                    placeholder="Age *"
                    placeholderTextColor="#aaa"
                    value={form.age}
                    onChangeText={(v) => handleChange('age', v.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                />
                {validationErrors.age && <Text style={styles.error}>{validationErrors.age}</Text>}

                <TextInput
                    style={[UNIFIED_STYLES.input, { marginBottom: 20 }]}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={form.email}
                    onChangeText={(v) => handleChange('email', v)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {validationErrors.email && <Text style={styles.error}>{validationErrors.email}</Text>}

                <TextInput
                    style={[UNIFIED_STYLES.input, { marginBottom: 20 }]}
                    placeholder="Phone"
                    placeholderTextColor="#aaa"
                    value={form.phone}
                    onChangeText={(v) => handleChange('phone', v.replace(/[^0-9+]/g, ''))}
                    keyboardType="phone-pad"
                />
                {validationErrors.phone && <Text style={styles.error}>{validationErrors.phone}</Text>}

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

            <View style={UNIFIED_STYLES.buttonRow}>
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
    error: {
        color: 'red',
        fontFamily: FONT,
        fontSize: 13,
        marginBottom: 6,
        marginLeft: 2,
    },
    genderRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
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
        marginTop: 10,
        marginBottom: 20,
    },
    radioLabel: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#222',
    },
    radioSelected: {},
});