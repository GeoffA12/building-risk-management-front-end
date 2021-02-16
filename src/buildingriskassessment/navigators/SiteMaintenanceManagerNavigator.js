import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { navigationRoutes } from '../../config/NavConfig';
import BuildingRiskAssessmentListScreen from '../screens/BuildingRiskAssessmentListScreen';
import RiskAssessmentListScreen from '../../riskassessment/screens/RiskAssessmentListScreen';
import BuildingRiskAssessmentEditorScreen from '../screens/BuildingRiskAssessmentEditorScreen';
import RiskAssessmentEditorScreen from '../../riskassessment/screens/RiskAssessmentEditorScreen';
import RiskAssessmentScheduleEditorScreen from '../screens/RiskAssessmentScheduleEditorScreen';
import UserProfileScreen from '../../users/screens/UserProfileScreen';
import MaintenanceManagerCalendarScreen from '../screens/MaintenanceManagerCalendarScreen';

const SiteMaintenanceManagerDrawer = createDrawerNavigator();

const SiteMaintenanceManagerStack = createStackNavigator();

const SiteMaintenanceManagerNavigator = () => {
    function createBuildingRiskAssessmentStack() {
        return (
            <SiteMaintenanceManagerStack.Navigator mode={'modal'}>
                <SiteMaintenanceManagerStack.Screen
                    name={navigationRoutes.BUILDINGRISKASSESSMENTLIST}
                    component={BuildingRiskAssessmentListScreen}
                    options={{
                        title: 'Building Assessment List',
                        headerTitleAlign: 'center',
                    }}
                />
                <SiteMaintenanceManagerStack.Screen
                    name={navigationRoutes.BUILDINGRISKASSESSMENTEDITOR}
                    component={BuildingRiskAssessmentEditorScreen}
                    options={{
                        title: 'Building Assessment Editor',
                        headerTitleAlign: 'center',
                    }}
                />
                <SiteMaintenanceManagerStack.Screen
                    name={navigationRoutes.RISKASSESSMENTSCHEDULEEDITORSCREEN}
                    component={RiskAssessmentScheduleEditorScreen}
                    options={{
                        title: 'Schedule Editor',
                        headerTitleAlign: 'center',
                    }}
                />
            </SiteMaintenanceManagerStack.Navigator>
        );
    }

    function createSiteMaintenanceManagerCalendarStack() {
        return (
            <SiteMaintenanceManagerStack.Navigator mode={'modal'}>
                <SiteMaintenanceManagerStack.Screen
                    name={navigationRoutes.MAINTENANCEMANAGERCALENDARSCREEN}
                    component={MaintenanceManagerCalendarScreen}
                    options={{
                        title: 'Maintenance Calendar',
                        headerTitleAlign: 'center',
                    }}
                />
            </SiteMaintenanceManagerStack.Navigator>
        );
    }

    function createRiskAssessmentStack() {
        return (
            <SiteMaintenanceManagerStack.Navigator mode={'modal'}>
                <SiteMaintenanceManagerStack.Screen
                    name={navigationRoutes.RISKASSESSMENTLIST}
                    component={RiskAssessmentListScreen}
                    options={{
                        title: 'Risk Assessment List',
                        headerTitleAlign: 'center',
                    }}
                />
                <SiteMaintenanceManagerStack.Screen
                    name={navigationRoutes.RISKASSESSMENTEDITOR}
                    component={RiskAssessmentEditorScreen}
                    options={{
                        title: 'Risk Assessment Editor',
                        headerTitleAlign: 'center',
                    }}
                />
            </SiteMaintenanceManagerStack.Navigator>
        );
    }

    return (
        <SiteMaintenanceManagerDrawer.Navigator>
            <SiteMaintenanceManagerDrawer.Screen
                name="Home"
                children={createBuildingRiskAssessmentStack}
            />
            <SiteMaintenanceManagerDrawer.Screen
                name="Risk assessments"
                children={createRiskAssessmentStack}
            />
            <SiteMaintenanceManagerDrawer.Screen
                name={navigationRoutes.USERPROFILE}
                component={UserProfileScreen}
            />
            <SiteMaintenanceManagerDrawer.Screen
                name={navigationRoutes.MAINTENANCEMANAGERCALENDARSCREEN}
                children={createSiteMaintenanceManagerCalendarStack}
            />
        </SiteMaintenanceManagerDrawer.Navigator>
    );
};

export default SiteMaintenanceManagerNavigator;
