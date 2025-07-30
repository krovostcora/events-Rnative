import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, Dimensions } from 'react-native';
import {
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
    toggleButton,
    toggleButtonText,
} from '../components/constants';

export default function EventSelector({ navigation }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);
    const [dropdownTop, setDropdownTop] = useState(0);

    useEffect(() => {
        const mockEvents = [
            { id: '1', name: 'Summer Party', folder: '20250710_summerparty' },
            { id: '2', name: 'Birthday Bash', folder: '20250901_birthdaybash' },
            { id: '3', name: 'Halloween Night', folder: '20251031_halloweennight' }
        ];
        setTimeout(() => {
            setEvents(mockEvents);
            setLoading(false);
        }, 500);
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

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Select event</Text>

            <View ref={dropdownRef} onLayout={onDropdownLayout}>
                <TouchableOpacity
                    style={styles.dropdown}
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
                    {
                        position: 'absolute',
                        top: dropdownTop,
                        left: (Dimensions.get('window').width - 280) / 2,
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
                                    selectedEvent?.id === item.id && styles.selectedItem
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

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={secondaryButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={secondaryButtonText}>Cancel</Text>
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

const FONT = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 150,
    },
    label: {
        fontFamily: FONT,
        fontSize: 18,
        color: '#222',
        marginBottom: 10,
        letterSpacing: 1,
        alignSelf: 'center',
    },
    dropdown: {
        width: 280,
        height: 48,
        borderWidth: 2,
        borderColor: '#bbb',
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginBottom: 2,
        borderRadius: 0,
    },
    dropdownText: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#222',
        letterSpacing: 1,
    },
    dropdownList: {
        width: 280,
        borderWidth: 2,
        borderColor: '#bbb',
        backgroundColor: '#fff',
        maxHeight: 180,
        borderRadius: 0,
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    selectedItem: {
        backgroundColor: '#e0e0e0',
    },
    itemText: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#222',
    },
    status: {
        marginTop: 10,
        fontFamily: FONT,
        fontStyle: 'italic',
        color: '#555',
        fontSize: 14,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 36,
        left: 0,
        gap: 16,
        right: 0,
        width: '100%',
    },
});
