import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Avatar, Card } from 'react-native-paper';
import AuthContext from '../../auth/contexts/AuthContext';
import { useHeader } from '../hooks/CalendarHeader';
import { BASE_URL } from '../../config/APIConfig';
import { navigationRoutes } from '../../config/NavConfig';
import { useCalendarHooks } from '../hooks/CalendarHooks.js';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    agendaItemContainer: {
        marginRight: 10,
        marginTop: 17,
    },
    agendaItemContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

const CalendarScreen = ({ navigation }) => {
    const {
        auth: { logout },
        user,
    } = useContext(AuthContext);
    const { setCalendarHeader } = useHeader({ user });
    const {
        riskAssessmentScheduleList,
        setRiskAssessmentScheduleList,
        assignedRiskAssessmentScheduleIds,
        setAssignedRiskAssessmentScheduleIds,
        getAssignedRiskAssessmentSchedules,
        getSiteMaintenanceAssociateById,
        agendaItems,
        setAgendaItems,
        formatRiskAssessmentSchedules,
    } = useCalendarHooks();

    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        setCalendarHeader(navigation, logout, loadSiteMaintenanceAssociate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, logout, assignedRiskAssessmentScheduleIds]);

    useEffect(() => {
        loadSiteMaintenanceAssociate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (
            assignedRiskAssessmentScheduleIds &&
            assignedRiskAssessmentScheduleIds.length > 0
        ) {
            loadAssignedRiskAssessmentSchedules(
                assignedRiskAssessmentScheduleIds
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignedRiskAssessmentScheduleIds]);

    useEffect(() => {
        if (
            riskAssessmentScheduleList &&
            riskAssessmentScheduleList.length > 0
        ) {
            const formattedSchedules = formatRiskAssessmentSchedules(
                riskAssessmentScheduleList
            );
            setAgendaItems(formattedSchedules);
        }
    }, [riskAssessmentScheduleList]);

    async function loadSiteMaintenanceAssociate() {
        const siteMaintenanceAssociate = await getSiteMaintenanceAssociateById(
            user.id
        );
        setAssignedRiskAssessmentScheduleIds(
            siteMaintenanceAssociate.assignedRiskAssessmentScheduleIds
        );
    }

    async function loadAssignedRiskAssessmentSchedules(ids) {
        const assignedRiskAssessmentScheduleData = await getAssignedRiskAssessmentSchedules(
            ids
        );
        setRiskAssessmentScheduleList(assignedRiskAssessmentScheduleData);
    }

    function handleAgendaItemPress(event) {
        navigation.navigate(
            navigationRoutes.SMARISKASSESSMENTSCHEDULEEDITORSCREEN,
            {
                riskAssessmentScheduleId: event.id,
            }
        );
    }

    const renderItem = (item) => {
        return (
            <TouchableOpacity
                style={styles.agendaItemContainer}
                onPress={() => handleAgendaItemPress(item)}>
                <Card>
                    <Card.Content>
                        <View style={styles.agendaItemContentContainer}>
                            <Text>{item.name}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Agenda
                items={agendaItems}
                selected={today}
                renderItem={renderItem}
            />
        </View>
    );
};

export default CalendarScreen;
