import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PageScreen from '../screens/PageScreen';
import NotFoundScreen from '../screens/NotFoundScreen';

export type RootStackParamList = {
  Page: undefined;
  NotFound: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Page">
      <Stack.Screen
        name="Page"
        component={PageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
