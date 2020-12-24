import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { navigationRoutes } from '../../config/NavConfig';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';

const AuthStack = createStackNavigator();
const LoginStack = createStackNavigator();

const AuthStackNavigator = () => {
    function getLoginStack() {
        return (
            <LoginStack.Navigator
                mode={'card'}
                screenOptions={{
                    headerShown: false,
                }}>
                <LoginStack.Screen
                    name={navigationRoutes.LOGIN}
                    component={LoginScreen}
                />
            </LoginStack.Navigator>
        );
    }
    return (
        <AuthStack.Navigator
            mode={'modal'}
            screenOptions={{
                headerShown: false,
            }}>
            <AuthStack.Screen name={'LoginStack'}>
                {getLoginStack}
            </AuthStack.Screen>
            <AuthStack.Screen
                name={navigationRoutes.REGISTRATION}
                component={RegistrationScreen}
            />
        </AuthStack.Navigator>
    );
};

export default AuthStackNavigator;
