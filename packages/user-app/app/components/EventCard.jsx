import { View, Text, Image, StyleSheet, Platform, TouchableOpacity, useWindowDimensions } from "react-native";
import {
    primaryButton,
    primaryButtonText,
} from '@events/shared/src/components/buttons_styles';

export default function EventCard({ event, navigation, onRegister }) {
    const { width } = useWindowDimensions();
    const isPhone = width < 600; // якщо екран менше 600px, вважаємо це телефоном

    return (
        <View style={styles.card}>
            <View style={[styles.row, isPhone && styles.column]}>
                {event.logo && <Image source={{ uri: event.logo }} style={styles.image} />}

                <View style={styles.textContainer}>
                    {isPhone ? (
                        <>
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
                            <TouchableOpacity
                                style={[styles.button, primaryButton]}
                                onPress={() => {
                                    navigation.navigate('Registration');
                                }}>
                                <Text style={primaryButtonText}>
                                    Register
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={styles.rowWithButton}>
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
                              <TouchableOpacity
                                  style={[styles.button, primaryButton]}
                                  onPress={() => {
                                      navigation.navigate('Registration');
                                  }}>
                                  <Text style={primaryButtonText}>
                                      Register
                                  </Text>
                              </TouchableOpacity>
                        </View>
                    )}
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
