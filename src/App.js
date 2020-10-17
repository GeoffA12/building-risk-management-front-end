import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthStackNavigator from './navigators/AuthStackNavigator';
import MainStackNavigator from './navigators/MainStackNavigator';
import SplashScreen from './screens/SplashScreen';
import AuthContext from './contexts/AuthContext';
import UserContext from './contexts/UserContext';
import { navigationRoutes } from './config/NavConfig';
import { useAuth } from './hooks/Auth';

const RootStack = createStackNavigator();

const App = () => {
    const { auth, state } = useAuth();

    function renderScreens() {
        if (state && state.loading) {
            return (
                <RootStack.Screen
                    name={navigationRoutes.SPLASHSCREEN}
                    component={SplashScreen}
                />
            );
        } else {
            return state && state.user ? (
                <RootStack.Screen name={'MainStack'}>
                    {() => (
                        <UserContext.Provider value={{ user: state.user }}>
                            <MainStackNavigator />
                        </UserContext.Provider>
                    )}
                </RootStack.Screen>
            ) : (
                <RootStack.Screen
                    name={'AuthStack'}
                    component={AuthStackNavigator}
                />
            );
        }
    }

    return (
        <AuthContext.Provider value={auth}>
            <NavigationContainer>
                <RootStack.Navigator
                    screenOptions={{
                        headerShown: false,
                        animationEnabled: false,
                    }}>
                    {renderScreens()}
                </RootStack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    );
};

export default App;
