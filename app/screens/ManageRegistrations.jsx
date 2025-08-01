import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

export default function ManageRegistrations({ route }) {
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
        <FlatList
            data={participants}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
        />
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
        borderRadius: 6,
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