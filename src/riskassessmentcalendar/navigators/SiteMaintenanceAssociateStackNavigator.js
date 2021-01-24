import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { navigationRoutes } from '../../config/NavConfig';
import CalendarScreen from '../screens/CalendarScreen';
import UserProfileScreen from '../../users/screens/UserProfileScreen';
import SMARiskAssessmentScheduleEditorScreen from '../screens/SMARiskAssessmentScheduleEditorScreen';

const SiteMaintenanceAssociateStack = createStackNavigator();
const SiteMaintenanceAssociateDrawer = createDrawerNavigator();

const SiteMaintenanceAssociateStackNavigator = () => {
    function createSiteMaintenanceAssociateStack() {
        return (
            <SiteMaintenanceAssociateStack.Navigator mode={'modal'}>
                <SiteMaintenanceAssociateStack.Screen
                    name={navigationRoutes.RISKASSESSMENTCALENDARSCREEN}
                    component={CalendarScreen}
                    options={{
                        title: 'Maintenance Calendar',
                        headerTitleAlign: 'center',
                    }}
                />
                <SiteMaintenanceAssociateStack.Screen
                    name={
                        navigationRoutes.SMARISKASSESSMENTSCHEDULEEDITORSCREEN
                    }
                    component={SMARiskAssessmentScheduleEditorScreen}
                    options={{
                        title: 'Maintenance Editor',
                        headerTitleAlign: 'center',
                    }}
                />
            </SiteMaintenanceAssociateStack.Navigator>
        );
    }

    return (
        <SiteMaintenanceAssociateDrawer.Navigator>
            <SiteMaintenanceAssociateDrawer.Screen
                name="Home"
                children={createSiteMaintenanceAssociateStack}
            />
            <SiteMaintenanceAssociateDrawer.Screen
                name={navigationRoutes.USERPROFILE}
                component={UserProfileScreen}
            />
        </SiteMaintenanceAssociateDrawer.Navigator>
    );
};

export default SiteMaintenanceAssociateStackNavigator;
