import React from 'react';
import { View, StyleSheet } from 'react-native';
import HeaderButton from '../../common/components/HeaderButton';
import { useCalendarHooks } from './CalendarHooks';

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});

export const useHeader = () => {
    const { getRiskAssessmentSchedules } = useCalendarHooks();

    async function loadRiskAssessmentSchedules(riskAssessmentScheduleIdsList) {
        console.log("Load Schedule");
        await getRiskAssessmentSchedules(riskAssessmentScheduleIdsList);
    }

    function setCalendarHeader(navigation, logout, riskAssessmentScheduleIdsList) {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerContainer}>
                    <HeaderButton name={'refresh'} onPress={async () => loadRiskAssessmentSchedules(riskAssessmentScheduleIdsList)} />
                </View>
            ),
            headerLeft: () => (
                <View style={styles.headerContainer}>
                    <HeaderButton name={'exit'} onPress={() => logout()} />
                </View>
            ),
        });
    }

    return {
        setCalendarHeader,
    };
};
