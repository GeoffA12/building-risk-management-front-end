import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { navigationRoutes } from '../../config/NavConfig';
import UserListScreen from '../screens/UserListScreen';

const SiteAdminStack = createStackNavigator();

const SiteAdminStackNavigator = () => {
    return (
        <SiteAdminStack.Navigator mode={'modal'}>
            <SiteAdminStack.Screen
                name={navigationRoutes.SITEADMINLIST}
                component={UserListScreen}
                options={{
                    title: 'User List',
                    headerTitleAlign: 'center',
                }}
            />
        </SiteAdminStack.Navigator>
    );
};

export default SiteAdminStackNavigator;
