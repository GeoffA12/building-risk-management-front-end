import React, { useMemo, useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';

import AuthStackNavigator from './navigators/AuthStackNavigator';
import MainStackNavigator from './navigators/MainStackNavigator';
import AuthContext from './contexts/AuthContext';
import UserContext from './contexts/UserContext';
import { BASE_URL_GEOFF_LOCAL } from './config/APIConfig';
import { BASE_URL_DROPLET } from './config/APIConfig';
import { createAction } from './config/CreateAction';

const RootStack = createStackNavigator();

const App = () => {
    const [state, dispatch] = useReducer((currentState, action) => {
        switch (action.type) {
            case 'SET_USER':
                return {
                    ...state,
                    user: { ...action.payload },
                };
            case 'REMOVE_USER':
                return {
                    ...state,
                    user: undefined,
                };
            default:
                return currentState;
        }
    });
    const auth = useMemo(
        () => ({
            login: async (username, password) => {
                const url = `${BASE_URL_DROPLET}/authenticateUserLogin`;
                const response = await axios.post(url, {
                    username,
                    hashPassword: password,
                });
                const { data } = response;
                if (data) {
                    const user = {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        username: data.username,
                        phone: data.phone,
                        email: data.email,
                        authToken: data.authToken,
                    };
                    dispatch(createAction('SET_USER', user));
                }
                return response;
            },
            logout: () => {
                dispatch(createAction('REMOVE_USER'));
            },
            register: async (
                siteRole,
                firstName,
                lastName,
                email,
                phone,
                username,
                password
            ) => {
                const url = `${BASE_URL_DROPLET}/createUser`;
                const response = await axios.post(url, {
                    siteRole,
                    firstName,
                    lastName,
                    username,
                    email,
                    phone,
                    password,
                });
                return response;
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
                        animationEnabled: false,
                    }}>
                    {state && state.user ? (
                        <RootStack.Screen name={'MainStack'}>
                            {() => (
                                <UserContext.Provider
                                    value={{ user: state.user }}>
                                    <MainStackNavigator />
                                </UserContext.Provider>
                            )}
                        </RootStack.Screen>
                    ) : (
                        <RootStack.Screen
                            name={'AuthStack'}
                            component={AuthStackNavigator}
                        />
                    )}
                </RootStack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    );
};

export default App;
