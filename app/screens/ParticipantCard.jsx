import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';

const MOCK_EVENT = {
    name: 'Sample Event',
    date: '2024-07-01',
    time: '10:00',
    place: 'Central Park',
    logo: 'https://www.google.com/search?sca_esv=c11b94e477694cad&sxsrf=AE3TifOONMEqy0kJH0y2LsGBa0WNOcJp-w:1753700910455&q=logo&udm=2&fbs=AIIjpHxU7SXXniUZfeShr2fp4giZ1Y6MJ25_tmWITc7uy4KIemkjk18Cn72Gp24fGkjjh6xW3zC71_lUWsj1x5Nnf4FS5n8M000dpyx2jf8TsQyVuB7zbnTp8WVXermLKucHpGgeehX1z8wrN6J6U78wiDjeS87vQfLVo1IV99NK66u6R2aU1qFFm81I5ycxUKmgCmUug4ar&sa=X&ved=2ahUKEwjqg73-tN-OAxXSUaQEHWTEOkUQtKgLKAF6BAgkEAE&biw=1600&bih=1000&dpr=1.8#vhid=tpE61O7FAdRiVM&vssid=mosaic'
};

export default function ParticipantCard({ navigation }) {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setEvent(MOCK_EVENT);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading || error || !event) {
        return (
            <View style={styles.window}>
                <View style={styles.body}>
                    {loading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <Text style={styles.error}>{error || 'Loading event details...'}</Text>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.window}>
            <View style={styles.body}>
                <Text style={styles.eventName}>{event.name}</Text>
                <View style={styles.topRow}>
                    <Image
                        source={{ uri: event.logo }}
                        style={styles.logo}
                        onError={({ nativeEvent }) => {
                            nativeEvent.target.src = 'https://www.google.com/search?sca_esv=c11b94e477694cad&sxsrf=AE3TifOONMEqy0kJH0y2LsGBa0WNOcJp-w:1753700910455&q=logo&udm=2&fbs=AIIjpHxU7SXXniUZfeShr2fp4giZ1Y6MJ25_tmWITc7uy4KIemkjk18Cn72Gp24fGkjjh6xW3zC71_lUWsj1x5Nnf4FS5n8M000dpyx2jf8TsQyVuB7zbnTp8WVXermLKucHpGgeehX1z8wrN6J6U78wiDjeS87vQfLVo1IV99NK66u6R2aU1qFFm81I5ycxUKmgCmUug4ar&sa=X&ved=2ahUKEwjqg73-tN-OAxXSUaQEHWTEOkUQtKgLKAF6BAgkEAE&biw=1600&bih=1000&dpr=1.8#vhid=tpE61O7FAdRiVM&vssid=mosaic';
                        }}
                    />
                    <View style={styles.eventData}>
                        <View style={styles.dataSection}>
                            <View>
                                <Text style={styles.bold}>START</Text>
                                <Text>Date: {event.date}</Text>
                                <Text>Time: {event.time}</Text>
                                <Text>Location: {event.place}</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.bold}>FINISH</Text>
                                <Text>Start and finish at the same location</Text>
                                <Text>Additional info</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.buttonsRow}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation?.navigate('EventSelector')}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Manage Registrations</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation?.navigate('ParticipantCard')}>
                        <Text style={styles.buttonText}>Registrate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    window: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    body: {
        width: '90%',
        padding: 20,
        backgroundColor: '#f7f7f7',
        borderRadius: 12,
        elevation: 2
    },
    eventName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center'
    },
    topRow: {
        flexDirection: 'row',
        marginBottom: 20
    },
    logo: {
        width: 100,
        height: 100,
        marginRight: 20,
        borderRadius: 8,
        backgroundColor: '#eee'
    },
    eventData: {
        flex: 1,
        justifyContent: 'center'
    },
    dataSection: {
        flexDirection: 'column'
    },
    bold: {
        fontWeight: 'bold',
        marginBottom: 4
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 6,
        marginHorizontal: 4
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    error: {
        color: 'red',
        textAlign: 'center'
    }
});