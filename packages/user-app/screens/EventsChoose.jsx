import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import EventCard from "../components/EventCard";
import { apiClient } from "@events/shared";

export default function EventsChoose() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        apiClient.getEvents()
            .then(setEvents)
            .catch(console.error);
    }, []);

    return (
        <ScrollView>
            {events.map(event => (
                <EventCard key={event.id} event={event} />
            ))}
        </ScrollView>
    );
}
