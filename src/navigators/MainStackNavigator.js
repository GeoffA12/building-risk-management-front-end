import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { navigationRoutes } from '../config/NavConfig';
import UserListScreen from '../screens/UserListScreen';

const MainStack = createStackNavigator();

const MainStackNavigator = () => {
    return (
        <MainStack.Navigator mode={'modal'}>
            <MainStack.Screen
                name={navigationRoutes.USERLIST}
                component={UserListScreen}
                options={{
                    title: 'User List',
                    headerTitleAlign: 'center',
                }}
            />
        </MainStack.Navigator>
    );
};

export default MainStackNavigator;
