import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import EventSelector from './screens/EventSelector';
import NewEventForm from './screens/NewEventForm';
import EventDetails from './screens/EventDetails';
import Registration from './screens/Registration';
import DateSearch from "./screens/DateSearch";
import MapScreen from "./screens/MapScreen";
import RaceDetails from "./screens/RaceDetails";
import ManageRegistrations from "./screens/ManageRegistrations";
import PreviousResults from "./screens/PreviousResults";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="EventSelector" component={EventSelector} />
                <Stack.Screen name="NewEventForm" component={NewEventForm} />
                <Stack.Screen name="EventDetails" component={EventDetails} />
                <Stack.Screen name="Registration" component={Registration} />
                <Stack.Screen name="DateSearch" component={DateSearch} />
                <Stack.Screen name="MapScreen" component={MapScreen} />
                <Stack.Screen name="RaceControls" component={RaceDetails} />
                <Stack.Screen name="ManageRegistrations" component={ManageRegistrations} />
                <Stack.Screen name="PreviousResults" component={PreviousResults} />
            </Stack.Navigator>
    );
}
