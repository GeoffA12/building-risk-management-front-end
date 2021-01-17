import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { navigationRoutes } from '../../config/NavConfig';
import RiskAssessmentListScreen from '../screens/RiskAssessmentListScreen';
import RiskAssessmentEditorScreen from '../screens/RiskAssessmentEditorScreen';
import UserProfileScreen from '../../users/screens/UserProfileScreen';

const WorkplaceHealthSafetyMemberStack = createStackNavigator();
const WorkplaceHealthSafetyMemberDrawer = createDrawerNavigator();

const WorkplaceHealthSafetyMemberStackNavigator = () => {
    function createRiskAssessmentStack() {
        return (
            <WorkplaceHealthSafetyMemberStack.Navigator mode={'modal'}>
                <WorkplaceHealthSafetyMemberStack.Screen
                    name={navigationRoutes.RISKASSESSMENTLIST}
                    component={RiskAssessmentListScreen}
                    options={{
                        title: 'Risk Assessment List',
                        headerTitleAlign: 'center',
                    }}
                />
                <WorkplaceHealthSafetyMemberStack.Screen
                    name={navigationRoutes.RISKASSESSMENTEDITOR}
                    component={RiskAssessmentEditorScreen}
                    options={{
                        title: 'Risk Assessment Editor',
                        headerTitleAlign: 'center',
                    }}
                />
            </WorkplaceHealthSafetyMemberStack.Navigator>
        );
    }

    return (
        <WorkplaceHealthSafetyMemberDrawer.Navigator>
            <WorkplaceHealthSafetyMemberDrawer.Screen
                name="Home"
                children={createRiskAssessmentStack}
            />
            <WorkplaceHealthSafetyMemberDrawer.Screen
                name={navigationRoutes.USERPROFILE}
                component={UserProfileScreen}
            />
        </WorkplaceHealthSafetyMemberDrawer.Navigator>
    );
};

export default WorkplaceHealthSafetyMemberStackNavigator;
