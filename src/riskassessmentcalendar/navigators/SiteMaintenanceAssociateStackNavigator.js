import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { navigationRoutes } from '../../config/NavConfig';
import CalendarScreen from '../screens/CalendarScreen';

const SiteMaintenanceAssociateStack = createStackNavigator();
const SiteMaintenanceAssociateDrawer = createDrawerNavigator();

const SiteMaintenanceAssociateStackNavigator = () => {
    function createSiteMaintenanceAssociateStack() {
        return (
            <SiteMaintenanceAssociateStack.Navigator mode={'modal'}>
                <SiteMaintenanceAssociateStack.Screen
                    name={navigationRoutes.RISKASSESSMENTCALENDARSCREEN}
                    component={CalendarScreen}
                />
            </SiteMaintenanceAssociateStack.Navigator>
        );
    }
    return (
        <SiteMaintenanceAssociateStack.Navigator mode={'modal'}>
            <SiteMaintenanceAssociateStack.Screen
                name={navigationRoutes.RISKASSESSMENTCALENDARSCREEN}
                component={CalendarScreen}
                options={{
                    title: 'Calendar Screen',
                    headerTitleAlign: 'center',
                }}
            />
        </SiteMaintenanceAssociateStack.Navigator>
    );
};

export default SiteMaintenanceAssociateStackNavigator;
