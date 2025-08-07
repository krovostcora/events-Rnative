import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, Dimensions } from 'react-native';
import {
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
} from '../../components/buttons_styles';
import { UNIFIED_STYLES } from '../../components/constants';

export default function EventSelector({ navigation }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);
    const [dropdownTop, setDropdownTop] = useState(0);

    useEffect(() => {
        fetch('https://events-server-eu5z.onrender.com/api/events')
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch events:', err);
                setLoading(false);
            });
    }, []);

    const handleAccept = () => {
        if (selectedEvent) {
            navigation.navigate('EventDetails', { event: selectedEvent.folder });
        }
    };

    const onDropdownLayout = (e) => {
        const { y, height } = e.nativeEvent.layout;
        setDropdownTop(y + height);
    };

    const isDesktop = Dimensions.get('window').width > 768;

    return (
        <View style={UNIFIED_STYLES.container}>
            <Text style={UNIFIED_STYLES.title}>Select event</Text>

            <View ref={dropdownRef} onLayout={onDropdownLayout}>
                <TouchableOpacity
                    style={[styles.dropdown, isDesktop && styles.dropdownDesktop]}
                    onPress={() => setDropdownOpen(prev => !prev)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.dropdownText}>
                        {selectedEvent?.name || '-- Choose --'}
                    </Text>
                </TouchableOpacity>
            </View>

            {dropdownOpen && (
                <View style={[
                    styles.dropdownList,
                    isDesktop ? {
                        position: 'absolute',
                        top: dropdownTop,
                        left: (Dimensions.get('window').width - 320) / 2,
                        width: 320,
                        maxHeight: 250,
                        zIndex: 10,
                    } : {
                        // Для телефону залишаємо як було
                        position: 'absolute',
                        top: dropdownTop,
                        left: (Dimensions.get('window').width - 280) / 2,
                        width: 280,
                        maxHeight: 180,
                        zIndex: 10,
                    }
                ]}>
                    <FlatList
                        data={events}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.item,
                                    selectedEvent?.id === item.id && styles.selectedItem,
                                    isDesktop && { paddingVertical: 12, paddingHorizontal: 20 }
                                ]}
                                onPress={() => {
                                    setSelectedEvent(item);
                                    setDropdownOpen(false);
                                }}
                            >
                                <Text style={styles.itemText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            <TouchableOpacity
                style={[
                    primaryButton,
                    !selectedEvent && { opacity: 0.5 }
                ]}
                onPress={handleAccept}
                disabled={!selectedEvent}
                activeOpacity={selectedEvent ? 0.7 : 1}
            >
                <Text style={primaryButtonText}>Accept</Text>
            </TouchableOpacity>

            {loading && <Text style={styles.status}>Loading events...</Text>}

            <View style={[UNIFIED_STYLES.buttonRow, { marginTop: 300 }]}>
                <TouchableOpacity
                    style={secondaryButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={secondaryButtonText}>Back</Text>
                </TouchableOpacity>

                <View>
                    <TouchableOpacity
                        style={[primaryButton]}
                        onPress={() => navigation.navigate('DateSearch')}
                    >
                        <Text style={primaryButtonText}>Search by date</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[primaryButton, { marginTop: 10 }]}
                        onPress={() => navigation.navigate('NewEventForm')}
                    >
                        <Text style={primaryButtonText}>New event</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const FONT = Platform.OS === 'ios' ? 'System' : 'monospace';

const styles = StyleSheet.create({
    dropdown: {
        width: 280,
        height: 40,
        borderWidth: 2,
        borderColor: '#b0b0b0',
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginBottom: 2,
        borderRadius: 0,
        shadowColor: '#fff',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    dropdownDesktop: {
        width: 320,
        height: 45,
    },
    dropdownText: {
        fontFamily: FONT,
        fontSize: 15,
        color: '#222',
        letterSpacing: 1,
    },
    dropdownList: {
        borderWidth: 2,
        borderColor: '#b0b0b0',
        backgroundColor: '#f0f0f0',
        borderRadius: 0,
        shadowColor: '#fff',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    item: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#d4d0c8',
        backgroundColor: '#fff',
    },
    selectedItem: {
        backgroundColor: '#c0d8ff',
        borderColor: '#003399',
        borderWidth: 1,
    },
    itemText: {
        fontFamily: FONT,
        fontSize: 15,
        color: '#222',
    },
    status: {
        marginTop: 10,
        fontFamily: FONT,
        fontStyle: 'italic',
        color: '#555',
        fontSize: 14,
        backgroundColor: '#f0f0f0',
        borderWidth: 2,
        borderColor: '#b0b0b0',
        padding: 6,
        alignSelf: 'center',
    },
});
