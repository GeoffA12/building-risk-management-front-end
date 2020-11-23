import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { navigationRoutes } from '../config/NavConfig';
import RiskAssessmentListScreen from '../workplacehealthsafetymember/screens/RiskAssessmentListScreen';
import RiskAssessmentEditor from '../workplacehealthsafetymember/screens/RiskAssessmentEditorScreen';
import RiskAssessmentProfile from '../workplacehealthsafetymember/components/RiskAssessmentProfile';

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
                    component={RiskAssessmentEditor}
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
                name="User Profile"
                component={RiskAssessmentProfile}
            />
        </WorkplaceHealthSafetyMemberDrawer.Navigator>
    );
};

export default WorkplaceHealthSafetyMemberStackNavigator;
