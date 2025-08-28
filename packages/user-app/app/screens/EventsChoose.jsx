import { useEffect, useState } from "react";
import { ScrollView, Text, ActivityIndicator, View, TouchableOpacity } from "react-native";
import EventCard from "../components/EventCard";
import {apiClient} from "@events/shared/src";
import { secondaryButton, secondaryButtonText } from '@events/shared/src/components/buttons_styles';

export default function EventsChoose({ navigation }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiClient.getEvents()
            .then(async list => {
                const fullEvents = await Promise.all(
                    list.map(event => apiClient.getEvent(event.id).catch(console.error))
                );
                setEvents(fullEvents.filter(Boolean));
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleRegister = (event) => {
        // Логіка реєстрації, наприклад, перехід на екран реєстрації
        console.log("Register for event:", event.name);
    };

    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    if (error) return <Text style={{ color: "red", textAlign: "center", marginTop: 50 }}>{error}</Text>;

    return (
        <ScrollView>
            {events.map(event => (
                <EventCard key={event.id} event={event} navigation={navigation} />
            ))}

            <View style={{ alignItems: "center", marginVertical: 20 }}>
                <TouchableOpacity style={secondaryButton} onPress={() => navigation.goBack()}>
                    <Text style={secondaryButtonText}>Back</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
