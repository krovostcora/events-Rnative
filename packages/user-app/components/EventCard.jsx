import { View, Text, Image, StyleSheet } from "react-native";

export default function EventCard({ event }) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: event.logo }} style={styles.image} />
            <Text style={styles.title}>{event.name}</Text>
            <Text style={styles.description}>{event.description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    image: { width: "100%", height: 150, borderRadius: 10 },
    title: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
    description: { marginTop: 5, color: "#666" },
});
