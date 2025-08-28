import { View, Text, Image, StyleSheet, Platform, TouchableOpacity, useWindowDimensions } from "react-native";
import {
    primaryButton,
    primaryButtonText,
} from '@events/shared/src/components/buttons_styles';
import { getFolderName } from '@events/shared/src/utils/eventHelpers';
import React from "react";

const BASE_URL = "https://events-server-eu5z.onrender.com/api/events";

export default function EventCard({ event, eventRestrictions, navigation }) {
    const { width } = useWindowDimensions();
    const isPhone = width < 600;

    const handleRegister = () => {
        if (!event) return;
        navigation.navigate('Registration', {
            event: {
                ...event,
                folder: getFolderName(event),
            },
            eventRestrictions: {
                ageLimit: event.ageLimit,
                maxChildAge: event.maxChildAge,
                genderRestriction: event.genderRestriction,
                isRace: event.isRace === true || event.isRace === 'true',
            },
        });
    };

    return (
        <View style={styles.card}>
            <View style={[styles.row, isPhone && styles.column]}>
                {event.logo && <Image source={{ uri: event.logo }} style={styles.image} />}

                <View style={styles.textContainer}>
                    <View style={isPhone ? {} : styles.rowWithButton}>
                        <View style={styles.textBlock}>
                            <Text style={styles.title}>{event.name}</Text>
                            <Text style={styles.info}>Date: {event.date} {event.time}</Text>
                            <Text style={styles.info}>Place: {event.place}</Text>
                            {event.isRace && <Text style={styles.info}>Race Event</Text>}
                            {event.teamEvent && <Text style={styles.info}>Team Event</Text>}
                            {event.ageLimit && <Text style={styles.info}>Age Limit: {event.ageLimit}</Text>}
                            {event.maxChildAge && <Text style={styles.info}>Max Child Age: {event.maxChildAge}</Text>}
                            {event.medicalRequired && <Text style={styles.info}>Medical Required</Text>}
                            {event.genderRestriction && <Text style={styles.info}>Gender Restriction: {event.genderRestriction}</Text>}
                            <Text style={styles.description}>{event.description}</Text>
                        </View>

                        <View style={{ flexDirection: isPhone ? 'row' : 'column', marginLeft: isPhone ? 0 : 12 }}>
                            <TouchableOpacity
                                style={[styles.button, primaryButton]}
                                onPress={handleRegister}
                            >
                                <Text style={primaryButtonText}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );

}

const FONT = Platform.OS === "ios" ? "System" : "monospace";

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 6,
        backgroundColor: "#fff",
        shadowColor: "#fff",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    column: {
        flexDirection: "column",
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 6,
        marginRight: 12,
        marginBottom: 12,
    },
    title: {
        fontFamily: FONT,
        fontSize: 18,
        fontWeight: "600",
        color: "#222",
        marginBottom: 6,
    },
    info: {
        fontFamily: FONT,
        fontSize: 14,
        color: "#444",
        marginBottom: 2,
    },
    description: {
        fontFamily: FONT,
        fontSize: 14,
        color: "#555",
        lineHeight: 20,
        marginTop: 6,
    },
    textContainer: {
        flex: 1,
    },
    rowWithButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    textBlock: {
        flexShrink: 1,
        flex: 1,
    },
    button: {
        marginLeft: 12,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
});
