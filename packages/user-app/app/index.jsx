import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {HomeScreenUser} from "@events/shared";
import EventsChoose from "./screens/EventsChoose";
import Registration from "@events/shared/src/screens/Registration";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreenUser} />
                <Stack.Screen name="EventsChoose" component={EventsChoose} />
                <Stack.Screen name="Registration" component={Registration} />
            </Stack.Navigator>
    );
}
