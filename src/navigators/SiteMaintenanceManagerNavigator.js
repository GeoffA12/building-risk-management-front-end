import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AuthContext from '../contexts/AuthContext';
import { navigationRoutes } from '../config/NavConfig';
import HeaderButton from '../components/HeaderButton';
import BuildingRiskAssessmentListScreen from '../sitemaintenancemanager/screens/BuildingRiskAssessmentListScreen';
import RiskAssessmentListScreen from '../workplacehealthsafetymember/screens/RiskAssessmentListScreen';
import BuildingRiskAssessmentEditor from '../sitemaintenancemanager/screens/BuilidingRiskAssessmentEditorScreen';
import RiskAssessmentEditorScreen from '../workplacehealthsafetymember/screens/RiskAssessmentEditorScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const SiteMaintenanceManagerDrawer = createDrawerNavigator();

const SiteMaintenanceManagerStack = createStackNavigator();
const RiskAssessmentStack = createStackNavigator();
const SiteMaintenanceManagerTopTabs = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
});

const SiteMaintenanceManagerNavigator = () => {
    const {
        auth: { logout },
    } = useContext(AuthContext);
    function getHeaderTitle(route) {
        const routeName =
            getFocusedRouteNameFromRoute(route) ??
            navigationRoutes.BUILDINGRISKASSESSMENTLIST;

        switch (routeName) {
            case navigationRoutes.BUILDINGRISKASSESSMENTLIST:
                return 'Building Assessment List';
            case navigationRoutes.RISKASSESSMENTLIST:
                return 'Risk Assessment List';
            default:
                return 'Unknown';
        }
    }

    function getHeaderRight(navigation, route) {
        const routeName =
            getFocusedRouteNameFromRoute(route) ??
            navigationRoutes.BUILDINGRISKASSESSMENTLIST;

        switch (routeName) {
            case navigationRoutes.BUILDINGRISKASSESSMENTLIST:
                return (
                    <View style={styles.headerContainer}>
                        <HeaderButton
                            name={'add'}
                            onPress={() =>
                                navigation.navigate(
                                    navigationRoutes.BUILDINGRISKASSESSMENTEDITOR
                                )
                            }
                        />
                        <HeaderButton name={'exit'} onPress={() => logout()} />
                    </View>
                );
            case navigationRoutes.RISKASSESSMENTLIST:
                return (
                    <View style={styles.headerContainer}>
                        <HeaderButton name={'exit'} onPress={() => logout()} />
                    </View>
                );
            default:
                return null;
        }
    }

    function createTopTabs() {
        return (
            <SiteMaintenanceManagerTopTabs.Navigator>
                <SiteMaintenanceManagerTopTabs.Screen
                    name={navigationRoutes.BUILDINGRISKASSESSMENTLIST}
                    component={BuildingRiskAssessmentListScreen}
                    options={{
                        title: 'Building assessments',
                    }}
                />
                <SiteMaintenanceManagerTopTabs.Screen
                    name={navigationRoutes.RISKASSESSMENTLIST}
                    component={RiskAssessmentListScreen}
                />
            </SiteMaintenanceManagerTopTabs.Navigator>
        );
    }

    function createBuildingRiskAssessmentStack() {
        return (
            <SiteMaintenanceManagerStack.Navigator mode={'modal'}>
                <SiteMaintenanceManagerStack.Screen
                    name="Building Assessment List"
                    // children={createTopTabs}
                    component={BuildingRiskAssessmentListScreen}
                    // options={({ navigation, route }) => ({
                    //     headerTitle: getHeaderTitle(route),
                    //     headerTitleAlign: 'center',
                    //     headerRight: () => getHeaderRight(navigation, route),
                    // })}
                    options={{
                        headerTitleAlign: 'center',
                    }}
                />
                <SiteMaintenanceManagerStack.Screen
                    name={navigationRoutes.BUILDINGRISKASSESSMENTEDITOR}
                    component={BuildingRiskAssessmentEditor}
                    options={{
                        title: 'Building Assessment Editor',
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
        </SiteMaintenanceManagerDrawer.Navigator>
    );
};

export default SiteMaintenanceManagerNavigator;
