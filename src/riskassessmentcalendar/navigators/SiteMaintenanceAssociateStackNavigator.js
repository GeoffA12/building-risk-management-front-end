import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRoutes } from '../../config/NavConfig';
import CalendarScreen from '../screens/CalendarScreen';

const SiteMaintenanceAssociateStack = createStackNavigator();

const SiteMaintenanceAssociateStackNavigator = () => {
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
