import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    primaryButton,
    primaryButtonText,
    secondaryButton,
    secondaryButtonText,
    toggleButton,
    toggleButtonActive,
    toggleButtonText,
} from '../components/constants';

const FONT = Platform.OS === 'ios' ? 'Menlo' : 'monospace';

export default function DateSearch({ navigation }) {
    const [mode, setMode] = useState('single'); // search mode: single day or range
    const [showStart, setShowStart] = useState(false); // show start date picker
    const [showEnd, setShowEnd] = useState(false); // show end date picker (for range)
    const [startDate, setStartDate] = useState(new Date()); // selected start date
    const [endDate, setEndDate] = useState(new Date()); // selected end date
    const [allEvents, setAllEvents] = useState([]); // all events from server
    const [events, setEvents] = useState([]); // filtered events to display
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Format date for display (DD.MM.YYYY)
    const formatDate = (d) => {
        if (!(d instanceof Date) || isNaN(d)) return 'Invalid Date';
        return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1)
            .toString()
            .padStart(2, '0')}.${d.getFullYear()}`;
    };

    // Parse ISO date string ('YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm:ss...')
    const parseISODate = (dateStr) => {
        if (!dateStr) return new Date(NaN);
        const datePart = dateStr.split('T')[0]; // ignore time if present
        const parts = datePart.split('-');
        if (parts.length !== 3) return new Date(NaN);
        const [year, month, day] = parts.map(Number);
        return new Date(year, month - 1, day);
    };

    // Fetch events from server
    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://events-server-eu5z.onrender.com/api/events');
            if (!response.ok) throw new Error('Failed to fetch events');
            const data = await response.json();

            // Add parsedDate for easier filtering
            const processed = data.map(event => ({
                ...event,
                parsedDate: parseISODate(event.date),
            }));

            setAllEvents(processed);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    // Local filtering of events based on mode and dates
    const filterEvents = () => {
        if (!allEvents.length) {
            setEvents([]);
            return;
        }

        if (mode === 'single') {
            // Filter events by exact date (ignore time)
            setEvents(
                allEvents.filter(ev => {
                    return ev.parsedDate.toDateString() === startDate.toDateString();
                })
            );
        } else {
            // Date range: from startDate to endDate (inclusive)
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            setEvents(
                allEvents.filter(ev => {
                    const evDate = ev.parsedDate;
                    return evDate >= start && evDate <= end;
                })
            );
        }
    };

    // Fetch events when component mounts
    useEffect(() => {
        fetchEvents();
    }, []);

    // Filter events when events or filter parameters change
    useEffect(() => {
        filterEvents();
    }, [allEvents, mode, startDate, endDate]);

    // Optionally, for "Search" button
    const handleSearch = () => {
        filterEvents();
    };

    // Clear events list and errors
    const handleCancel = () => {
        setEvents([]);
        setError(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Search Events by Date</Text>

            {/* Mode toggle */}
            <View style={styles.toggleRow}>
                <TouchableOpacity
                    style={[toggleButton, mode === 'single' && toggleButtonActive]}
                    onPress={() => setMode('single')}
                >
                    <Text style={toggleButtonText}>Single Day</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[toggleButton, mode === 'range' && toggleButtonActive]}
                    onPress={() => setMode('range')}
                >
                    <Text style={toggleButtonText}>Date Range</Text>
                </TouchableOpacity>
            </View>

            {/* Start date picker */}
            <TouchableOpacity style={styles.input} onPress={() => setShowStart(true)}>
                <Text style={styles.inputText}>
                    {mode === 'single' ? 'Select day' : 'Start date'}: {formatDate(startDate)}
                </Text>
            </TouchableOpacity>
            {showStart && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={(_, date) => {
                        setShowStart(false);
                        if (date) setStartDate(date);
                    }}
                />
            )}

            {/* End date picker, if range mode */}
            {mode === 'range' && (
                <>
                    <TouchableOpacity style={styles.input} onPress={() => setShowEnd(true)}>
                        <Text style={styles.inputText}>End date: {formatDate(endDate)}</Text>
                    </TouchableOpacity>
                    {showEnd && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display="default"
                            onChange={(_, date) => {
                                setShowEnd(false);
                                if (date) setEndDate(date);
                            }}
                        />
                    )}
                </>
            )}

            {/* Search button */}
            <TouchableOpacity
                style={[primaryButton, { marginTop: 32, marginBottom: 16 }]}
                onPress={handleSearch}
            >
                <Text style={primaryButtonText}>Search</Text>
            </TouchableOpacity>


            {/* Events list */}
            <ScrollView style={styles.eventsList} contentContainerStyle={{ paddingBottom: 80 }}>
                {loading && <ActivityIndicator size="large" color="#007AFF" />}
                {error && <Text style={styles.error}>{error}</Text>}
                {!loading && events.length === 0 && !error && (
                    <Text style={styles.noEventsText}>No events found for the selected date(s).</Text>
                )}
                {events.map((event) => (
                    <View key={event.id || event.name} style={styles.eventItem}>
                        <Text style={styles.eventName}>{event.name}</Text>
                        <Text style={styles.eventDate}>{formatDate(event.parsedDate)}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Back button */}
            <TouchableOpacity style={secondaryButton} onPress={() => navigation.goBack()}>
                <Text style={secondaryButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        paddingTop: 80,
        paddingHorizontal: 24,
    },
    title: {
        fontFamily: FONT,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111',
        letterSpacing: 1,
        marginBottom: 24,
        textAlign: 'center',
    },
    toggleRow: {
        flexDirection: 'row',
        marginBottom: 24,
        justifyContent: 'center',
    },
    input: {
        width: '100%',
        height: 44,
        borderWidth: 1,
        borderColor: '#bbb',
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    inputText: {
        color: '#222',
        fontFamily: FONT,
        fontSize: 16,
    },
    eventsList: {
        flex: 1,
        marginTop: 8,
    },
    eventItem: {
        backgroundColor: '#fff',
        borderRadius: 6,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    eventName: {
        fontFamily: FONT,
        fontSize: 18,
        fontWeight: '600',
        color: '#222',
    },
    eventDate: {
        fontFamily: FONT,
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    error: {
        fontFamily: FONT,
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginVertical: 16,
    },
    noEventsText: {
        fontFamily: FONT,
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginVertical: 16,
    },
});