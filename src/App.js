import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthStackNavigator from './navigators/AuthStackNavigator';
import AuthContext from './contexts/AuthContext';

const RootStack = createStackNavigator();

const App = () => {
    const auth = useMemo(
        () => ({
            login: (username, password) => {
                console.log('Login API received: ', username, password);
            },
            logout: () => {
                console.log('Logged out');
            },
            register: (
                siteRole,
                firstName,
                lastName,
                email,
                phone,
                username,
                password
            ) => {
                console.log(
                    'Regisration API Received: ',
                    siteRole,
                    firstName,
                    lastName,
                    email,
                    phone,
                    username,
                    password
                );
            },
        }),
        []
    );

    return (
        <AuthContext.Provider value={auth}>
            <NavigationContainer>
                <RootStack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}>
                    <RootStack.Screen
                        name={'AuthStack'}
                        component={AuthStackNavigator}
                    />
                </RootStack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    );
};

export default App;
