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
} from '../../components/buttons_styles';
import { UNIFIED_STYLES } from '../../components/constants';

const FONT = Platform.OS === 'ios' ? 'System' : 'monospace';

export default function DateSearch({ navigation }) {
    const [mode, setMode] = useState('single');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [allEvents, setAllEvents] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState({ mode: null, visible: false });

    const formatDate = (d) => {
        if (!(d instanceof Date) || isNaN(d)) return 'Invalid Date';
        return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1)
            .toString()
            .padStart(2, '0')}.${d.getFullYear()}`;
    };

    const parseISODate = (dateStr) => {
        if (!dateStr) return new Date(NaN);
        const datePart = dateStr.split('T')[0];
        const parts = datePart.split('-');
        if (parts.length !== 3) return new Date(NaN);
        const [year, month, day] = parts.map(Number);
        return new Date(year, month - 1, day);
    };

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://events-server-eu5z.onrender.com/api/events');
            if (!response.ok) throw new Error('Failed to fetch events');
            const data = await response.json();
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

    const filterEvents = () => {
        if (!allEvents.length) {
            setEvents([]);
            return;
        }
        if (mode === 'single') {
            setEvents(
                allEvents.filter(ev => {
                    return ev.parsedDate.toDateString() === startDate.toDateString();
                })
            );
        } else {
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

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [allEvents, mode, startDate, endDate]);

    const handleSearch = () => {
        filterEvents();
    };

    return (
        <View style={[UNIFIED_STYLES.container2, { paddingHorizontal: 20 }]}>
            <Text style={UNIFIED_STYLES.title}>Search Events by Date</Text>

            <View style={styles.toggleRow}>
                <TouchableOpacity
                    style={[toggleButton, mode === 'single' && toggleButtonActive]}
                    onPress={() => setMode('single')}
                >
                    <Text style={[toggleButtonText, mode !== 'single' && { color: '#222' }]}>
                        Single Day
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[toggleButton, mode === 'range' && toggleButtonActive]}
                    onPress={() => setMode('range')}
                >
                    <Text style={[toggleButtonText, mode !== 'range' && { color: '#222' }]}>
                        Date Range
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Date pickers */}
            {Platform.OS === 'web' ? (
                mode === 'single' ? (
                    <label style={styles.webLabelStyle}>
                        Date
                        <input
                            type="date"
                            value={!isNaN(startDate) ? startDate.toISOString().slice(0, 10) : ''}
                            onChange={e => {
                                const selected = new Date(e.target.value);
                                if (!isNaN(selected)) setStartDate(selected);
                            }}
                            style={styles.webInputDate}
                        />
                    </label>
                ) : (
                    <View style={styles.dateRangeRow}>
                        <label style={styles.webLabelStyle}>
                            From date
                            <input
                                type="date"
                                value={startDate instanceof Date && !isNaN(startDate) ? startDate.toISOString().slice(0, 10) : ''}
                                onChange={e => setStartDate(new Date(e.target.value))}
                                style={styles.webInputDate}
                            />
                        </label>
                        <label style={{ ...styles.webLabelStyle, marginLeft: 8 }}>
                            To date
                            <input
                                type="date"
                                value={endDate instanceof Date && !isNaN(endDate) ? endDate.toISOString().slice(0, 10) : ''}
                                onChange={e => setEndDate(new Date(e.target.value))}
                                style={styles.webInputDate}
                            />
                        </label>
                    </View>
                )
            ) : (
                mode === 'single' ? (
                    <>
                        <TouchableOpacity
                            onPress={() =>
                                setShowDatePicker({ mode: 'start', visible: true })
                            }
                            style={UNIFIED_STYLES.input}
                        >
                            <Text style={styles.inputText}>
                                Date: {formatDate(startDate)}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker.visible && showDatePicker.mode === 'start' && (
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker({ mode: null, visible: false });
                                    if (selectedDate) setStartDate(selectedDate);
                                }}
                            />
                        )}
                    </>
                ) : (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.inputText}>Start date:</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker({ mode: 'start', visible: true })}
                                style={UNIFIED_STYLES.input}
                            >
                                <Text style={styles.inputText}>{formatDate(startDate)}</Text>
                            </TouchableOpacity>
                            {showDatePicker.visible && showDatePicker.mode === 'start' && (
                                <View style={{ width: '100%', marginLeft: -10 }}>
                                <DateTimePicker
                                    value={startDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker({ mode: null, visible: false });
                                        if (selectedDate) setStartDate(selectedDate);
                                    }}
                                />
                                    </View>
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.inputText}>End date:</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker({ mode: 'end', visible: true })}
                                style={UNIFIED_STYLES.input}
                            >
                                <Text style={styles.inputText}>{formatDate(endDate)}</Text>
                            </TouchableOpacity>
                            {showDatePicker.visible && showDatePicker.mode === 'end' && (
                                <View style={{ width: '100%', alignItems: 'center', marginLeft: -85 }}>
                                <DateTimePicker
                                    value={endDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker({ mode: null, visible: false });
                                        if (selectedDate) setEndDate(selectedDate);
                                    }}
                                />
                                </View>
                            )}
                        </View>
                    </View>
                )
            )}

            <TouchableOpacity
                style={[primaryButton, { marginTop: 32, marginBottom: 16, maxWidth: 600, alignSelf: 'center' }]}
                onPress={handleSearch}
            >
                <Text style={primaryButtonText}>Search</Text>
            </TouchableOpacity>

            <ScrollView style={styles.eventsList} contentContainerStyle={{ paddingBottom: 80 }}>
                {loading && <ActivityIndicator size="large" color="#007AFF" />}
                {error && <Text style={styles.error}>{error}</Text>}
                {!loading && events.length === 0 && !error && (
                    <Text style={styles.noEventsText}>No events found for the selected date(s).</Text>
                )}
                {events.map((event) => (
                    <TouchableOpacity
                        key={event.id || event.name}
                        style={styles.eventItem}
                        onPress={() => navigation.navigate('EventDetails', { event: event.folder })}
                    >
                        <Text style={styles.eventName}>{event.name}</Text>
                        <Text style={styles.eventDate}>{formatDate(event.parsedDate)}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity style={[secondaryButton, { marginBottom: 20, marginHorizontal: 50 }]} onPress={() => navigation.goBack()}>
                <Text style={secondaryButtonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    toggleRow: {
        flexDirection: 'row',
        marginBottom: 24,
        justifyContent: 'center',
    },
    inputText: {
        color: '#222',
        fontFamily: FONT,
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    eventsList: {
        flex: 1,
        marginTop: 8,
    },
    eventItem: {
        backgroundColor: '#fff',
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
    webInputDate: {
        fontFamily: FONT,
        fontSize: 16,
        height: 44,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginVertical: 10,
        marginRight: 8,
        minWidth: 160,
        backgroundColor: '#fff',
    },
    dateRangeRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    webLabelStyle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: FONT,
        fontSize: 16,
        margin: 0,
    },
});