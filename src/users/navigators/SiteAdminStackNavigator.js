import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { navigationRoutes } from '../../config/NavConfig';
import UserListScreen from '../screens/UserListScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import { DARK_BLUE } from '../../common/styles/Colors';

const SiteAdminStack = createStackNavigator();
const SiteAdminDrawer = createDrawerNavigator();

const SiteAdminStackNavigator = () => {
    function createSiteAdminHomeStack() {
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
    }

    function createSiteAdminUserProfileStack() {
        return (
            <SiteAdminStack.Navigator mode={'modal'}>
                <SiteAdminStack.Screen
                    name={navigationRoutes.USERPROFILE}
                    component={UserProfileScreen}
                    options={{
                        title: 'User Profile',
                        headerTitleAlign: 'center',
                        headerTintColor: `${DARK_BLUE}`,
                    }}
                />
            </SiteAdminStack.Navigator>
        );
    }

    return (
        <SiteAdminDrawer.Navigator>
            <SiteAdminDrawer.Screen
                name="Home"
                children={createSiteAdminHomeStack}
            />
            <SiteAdminDrawer.Screen
                name={navigationRoutes.USERPROFILE}
                children={createSiteAdminUserProfileStack}
            />
        </SiteAdminDrawer.Navigator>
    );
};

export default SiteAdminStackNavigator;
