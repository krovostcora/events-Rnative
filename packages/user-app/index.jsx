import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreenUser } from "@events/shared";
import EventsChoose from "./screens/EventsChoose";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="HomeScreenUser"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="HomeScreenUser" component={HomeScreenUser} />
                <Stack.Screen name="EventsChoose" component={EventsChoose} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
