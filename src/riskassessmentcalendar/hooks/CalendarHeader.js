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

export const useHeader = ({ user }) => {
    const {
        getSiteMaintenanceAssociateById,
        setAssignedRiskAssessmentScheduleIds,
    } = useCalendarHooks();

    async function loadRiskAssessmentSchedules() {
        const siteMaintenanceAssociate = await getSiteMaintenanceAssociateById(
            user.id
        );
        setAssignedRiskAssessmentScheduleIds(
            siteMaintenanceAssociate.assignedRiskAssessmentScheduleIds
        );
    }

    function setCalendarHeader(
        navigation,
        logout,
        getSiteMaintenanceAssociate
    ) {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerContainer}>
                    <HeaderButton
                        name={'refresh'}
                        onPress={() => getSiteMaintenanceAssociate()}
                    />
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
