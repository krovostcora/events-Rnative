import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const FONT = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

const genderOptions = [
    { label: 'Gender', value: '' },
    { label: 'Female', value: 'female' },
    { label: 'Male', value: 'male' },
    { label: 'Other', value: 'other' },
];

function GenderSelect({ value, onChange, style }) {
    return (
        <Picker
            selectedValue={value}
            onValueChange={onChange}
            style={[style, { color: value ? '#222' : '#aaa' }]}
        >
            {genderOptions.map((option) => (
                <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                />
            ))}
        </Picker>
    );
}

export default function ParticipantCard({ navigation }) {
    const [form, setForm] = useState({
        name: '',
        surname: '',
        age: '',
        dni: '',
        email: '',
        phone: '',
        gender: '',
    });

    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });

        const errors = { ...validationErrors };

        if (name === 'name' || name === 'surname') {
            errors[name] = value.trim() === '' ? `${name} is required` : '';
        } else if (name === 'age') {
            errors[name] = !value || value <= 0 ? 'Age must be a positive number' : '';
        } else if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            errors[name] = value && !emailRegex.test(value) ? 'Invalid email format' : '';
        } else if (name === 'phone') {
            const phoneRegex = /^[0-9]*$/;
            errors[name] = value && !phoneRegex.test(value) ? 'Phone must contain only digits' : '';
        } else if (name === 'dni') {
            errors[name] = value.trim() === '' ? 'DNI is required' : '';
        }

        setValidationErrors(errors);
    };

    const handleSubmit = () => {
        let errors = {};
        if (!form.name.trim()) errors.name = 'Name is required';
        if (!form.surname.trim()) errors.surname = 'Surname is required';
        if (!form.age || form.age <= 0) errors.age = 'Age must be a positive number';
        if (!form.dni.trim()) errors.dni = 'DNI is required';

        setValidationErrors(errors);

        if (Object.values(errors).some(Boolean)) return;

        alert('Submitted! (not saved)');
    };

    const handleCancel = () => {
        navigation?.navigate('EventSelector');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register as a Participant</Text>
            <ScrollView contentContainerStyle={styles.formBody} keyboardShouldPersistTaps="handled">
                <TextInput
                    style={styles.input}
                    placeholder="Name *"
                    placeholderTextColor="#aaa"
                    value={form.name}
                    onChangeText={(v) => handleChange('name', v)}
                />
                {validationErrors.name ? <Text style={styles.error}>{validationErrors.name}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="Surname *"
                    placeholderTextColor="#aaa"
                    value={form.surname}
                    onChangeText={(v) => handleChange('surname', v)}
                />
                {validationErrors.surname ? <Text style={styles.error}>{validationErrors.surname}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="Age *"
                    placeholderTextColor="#aaa"
                    value={form.age}
                    onChangeText={(v) => handleChange('age', v.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                />
                {validationErrors.age ? <Text style={styles.error}>{validationErrors.age}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="DNI *"
                    placeholderTextColor="#aaa"
                    value={form.dni}
                    onChangeText={(v) => handleChange('dni', v)}
                />
                {validationErrors.dni ? <Text style={styles.error}>{validationErrors.dni}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={form.email}
                    onChangeText={(v) => handleChange('email', v)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                {validationErrors.email ? <Text style={styles.error}>{validationErrors.email}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    placeholderTextColor="#aaa"
                    value={form.phone}
                    onChangeText={(v) => handleChange('phone', v.replace(/[^0-9]/g, ''))}
                    keyboardType="phone-pad"
                />
                {validationErrors.phone ? <Text style={styles.error}>{validationErrors.phone}</Text> : null}

            </ScrollView>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton} onPress={handleSubmit}>
                    <Text style={styles.acceptButtonText}>Submit</Text>
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
    cancelButton: {
        backgroundColor: '#e0e0e0',
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 0,
        paddingVertical: 14,
        paddingHorizontal: 36,
        minWidth: 120,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#222',
        fontFamily: FONT,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    acceptButton: {
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#bbb',
        borderRadius: 0,
        paddingVertical: 14,
        paddingHorizontal: 36,
        minWidth: 120,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: '#fff',
        fontFamily: FONT,
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
});
