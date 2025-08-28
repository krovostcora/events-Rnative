import EventsChoose from "@events/user-app/app/screens/EventsChoose";
import Registration from "@events/shared/src/screens/Registration";
import { NavigationContainer } from '@react-navigation/native';
import React from "react";
import EventSelector from "@events/admin-app/app/screens/EventSelector";
import NewEventForm from "@events/admin-app/app/screens/new_event/NewEventForm";
import EventDetails from "@events/admin-app/app/screens/EventDetails";
import DateSearch from "@events/admin-app/app/screens/DateSearch";
import MapScreen from "@events/admin-app/app/screens/new_event/MapScreen";
import RaceDetails from "@events/admin-app/app/screens/race/RaceDetails";
import ManageRegistrations from "@events/admin-app/app/screens/registrations/ManageRegistrations";
import PreviousResults from "@events/admin-app/app/screens/race/PreviousResults";
import EditEvent from "@events/admin-app/app/screens/EditEvent";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export { default as apiClient } from "@events/shared/src/api/client";
export * from "@events/shared/src/components/buttons_styles";
export * from "@events/shared/src/components/constants";
export { default as HomeScreen } from "@events/shared/src/screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="EventsChoose" component={EventsChoose} />
                <Stack.Screen name="Registration" component={Registration} />
                <Stack.Screen name="EventSelector" component={EventSelector} />
                <Stack.Screen name="NewEventForm" component={NewEventForm} />
                <Stack.Screen name="EventDetails" component={EventDetails} />
                <Stack.Screen name="DateSearch" component={DateSearch} />
                <Stack.Screen name="MapScreen" component={MapScreen} />
                <Stack.Screen name="RaceControls" component={RaceDetails} />
                <Stack.Screen name="ManageRegistrations" component={ManageRegistrations} />
                <Stack.Screen name="PreviousResults" component={PreviousResults} />
                <Stack.Screen name="EditEvent" component={EditEvent} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}