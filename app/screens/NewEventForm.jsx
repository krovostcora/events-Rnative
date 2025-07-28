import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function NewEventForm({ navigation }) {
    const [form, setForm] = useState({
        name: '',
        date: '',
        time: '',
        place: '',
        logo: null
    });

    function formatFolderName(name, date) {
        const cleaned = name.toLowerCase().replace(/\s+/g, '');
        const formattedDate = date.replaceAll('-', '');
        return `${formattedDate}_${cleaned}`;
    }

    const handlePickLogo = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'image/png'
        });
        if (!result.canceled) {
            setForm({ ...form, logo: result.assets[0] });
        }
    };

    const handleAccept = () => {
        // Тут буде логіка збереження, коли додамо сховище (наприклад, async-storage або fs)
        navigation.navigate('EventSelector');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Write the name of the event"
                value={form.name}
                onChangeText={(text) => setForm({ ...form, name: text })}
            />

            <Button title="Upload logo (.png)" onPress={handlePickLogo} />
            {form.logo && <Text style={{ marginTop: 8 }}>{form.logo.name}</Text>}

            <TextInput
                style={styles.input}
                placeholder="Date (YYYY-MM-DD)"
                value={form.date}
                onChangeText={(text) => setForm({ ...form, date: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Time (HH:MM)"
                value={form.time}
                onChangeText={(text) => setForm({ ...form, time: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Place"
                value={form.place}
                onChangeText={(text) => setForm({ ...form, place: text })}
            />

            <View style={styles.buttonRow}>
                <Button title="Cancel" onPress={() => navigation.navigate('EventSelector')} />
                <Button title="Accept" onPress={handleAccept} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    input: {
        borderBottomWidth: 1,
        borderColor: '#999',
        padding: 8,
        marginBottom: 12
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24
    }
});
