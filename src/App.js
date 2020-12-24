import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthStackNavigator from './auth/navigators/AuthStackNavigator';
import SiteAdminStackNavigator from './users/navigators/SiteAdminStackNavigator';
import WorkplaceHealthSafetyMemberStackNavigator from './riskassessment/navigators/WorkplaceHealthSafetyMemberStackNavigator';
import SiteMaintenanceManagerNavigator from './buildingriskassessment/navigators/SiteMaintenanceManagerNavigator';
import SplashScreen from './auth/screens/SplashScreen';
import AuthContext from './auth/contexts/AuthContext';
import { navigationRoutes } from './config/NavConfig';
import SiteRoles from './config/SiteRolesConfig';
import { useAuth } from './auth/hooks/Auth';

const RootStack = createStackNavigator();

const App = () => {
    const { auth, state } = useAuth();

    function pickUserScreenToRender() {
        switch (state.user.siteRole) {
            case SiteRoles.SITEADMIN.apiEnumValue:
                return (
                    <RootStack.Screen name={'SiteAdminStack'}>
                        {() => <SiteAdminStackNavigator />}
                    </RootStack.Screen>
                );
            case SiteRoles.WHSMEMBER.apiEnumValue:
                return (
                    <RootStack.Screen name={'WorkplaceHealthSafetyMemberStack'}>
                        {() => <WorkplaceHealthSafetyMemberStackNavigator />}
                    </RootStack.Screen>
                );
            case SiteRoles.SITEMAINTENANCEMGR.apiEnumValue:
                return (
                    <RootStack.Screen name={'SiteMaintenanceManagerStack'}>
                        {() => <SiteMaintenanceManagerNavigator />}
                    </RootStack.Screen>
                );
            default:
                return (
                    <RootStack.Screen
                        name={'AuthStack'}
                        component={AuthStackNavigator}
                    />
                );
        }
    }

    function renderScreens() {
        if (state.loading) {
            return (
                <RootStack.Screen
                    name={navigationRoutes.SPLASHSCREEN}
                    component={SplashScreen}
                />
            );
        } else {
            return state.user ? (
                pickUserScreenToRender()
            ) : (
                <RootStack.Screen
                    name={'AuthStack'}
                    component={AuthStackNavigator}
                />
            );
        }
    }

    return (
        <AuthContext.Provider value={{ auth, user: state.user }}>
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
