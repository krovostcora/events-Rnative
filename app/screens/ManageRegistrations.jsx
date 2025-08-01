import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {primaryButton, primaryButtonText, secondaryButton, secondaryButtonText} from "../components/constants";

export default function ManageRegistrations({ route, navigation }) {
    const folder = route.params?.folder;
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!folder) return;
        setLoading(true);
        fetch(`https://events-server-eu5z.onrender.com/api/events/${folder}/participants`)
            .then(res => res.json())
            .then(data => {
                setParticipants(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load participants');
                setLoading(false);
            });
    }, [folder]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    if (!participants.length) {
        return (
            <View style={styles.center}>
                <Text>No registrations yet.</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.name}>{item.name} {item.surname}</Text>
            <Text style={styles.details}>Age: {item.age} | Gender: {item.gender} | Email: {item.email}</Text>
        </View>
    );

    return (
        <View style={{flex: 1}}>
            <ScrollView contentContainerStyle={styles.list}>
                {participants.map((item, idx) => (
                    <View style={styles.row} key={idx}>
                        <Text style={styles.name}>{item.name} {item.surname}</Text>
                        <Text style={styles.details}>Age: {item.age} | Gender: {item.gender} | Email: {item.email}</Text>
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
});