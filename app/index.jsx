import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import EventSelector from './screens/EventSelector';
import NewEventForm from './screens/NewEventForm';
import EventDetails from './screens/EventDetails';
import ParticipantCard from './screens/ParticipantCard';
import DateSearch from "./screens/DateSearch";
import MapScreen from "./components/MapScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="EventSelector" component={EventSelector} />
                <Stack.Screen name="NewEventForm" component={NewEventForm} />
                <Stack.Screen name="EventDetails" component={EventDetails} />
                <Stack.Screen name="ParticipantCard" component={ParticipantCard} />
                <Stack.Screen name="DateSearch" component={DateSearch} />
                <Stack.Screen name="MapScreen" component={MapScreen} />
            </Stack.Navigator>
    );
}
