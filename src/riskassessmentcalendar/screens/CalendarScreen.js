import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Avatar, Card } from 'react-native-paper';
import AuthContext from '../../auth/contexts/AuthContext';
import { useHeader } from '../hooks/CalendarHeader';
import { BASE_URL } from '../../config/APIConfig';
import { navigationRoutes } from '../../config/NavConfig';
import { convertUTCDateToLocalDate } from '../../utils/Time.js';
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
    const { setCalendarHeader } = useHeader();
    const { getRiskAssessmentSchedules, riskAssessmentScheduleList, setRiskAssessmentScheduleList } = useCalendarHooks();
    const [
        riskAssessmentScheduleIdsList,
        setRiskAssessmentScheduleIdsList,
    ] = useState([]);
    const [itemsList, setItemsListForAgenda] = useState({});
    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        setCalendarHeader(navigation, logout, riskAssessmentScheduleIdsList);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, logout, riskAssessmentScheduleIdsList]);

    useEffect(() => {
        async function getAssignedRiskAssessmentScheduleIds() {
            const siteMaintenanceAssociate = await fetch(
                `${BASE_URL}/getSiteMaintenanceAssociateById?id=${user.id}`
            );
            const data = await siteMaintenanceAssociate.json();
            const idsList = data.assignedRiskAssessmentScheduleIds;
            setRiskAssessmentScheduleIdsList(idsList);
        }
        getAssignedRiskAssessmentScheduleIds();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        loadRiskAssessmentSchedules();
    }, [riskAssessmentScheduleIdsList]);

    async function loadRiskAssessmentSchedules() {
        await getRiskAssessmentSchedules(riskAssessmentScheduleIdsList);
    }

    useEffect(() => {
        async function formatRiskAssessmentSchedules() {
            if (riskAssessmentScheduleList) {
                const items = {};
                for (let x = 0; x < riskAssessmentScheduleList.length; ++x) {
                    const schedule = riskAssessmentScheduleList[x];
                    items[schedule.dueDate.slice(0, 10)] = [
                        {
                            name: schedule.title + "\n\n" +
                                convertUTCDateToLocalDate(schedule.dueDate) + "\n" +
                                formatStatus(schedule.status), id: schedule.id
                        },
                    ];
                }
                setItemsListForAgenda(items);
            }
        }
        formatRiskAssessmentSchedules();
    }, [riskAssessmentScheduleList]);

    function handleAgendaItemPress(event) {
        navigation.navigate(
            navigationRoutes.SMARISKASSESSMENTSCHEDULEEDITORSCREEN,
            {
                riskAssessmentScheduleId: event.id,
            }
        );
    }

    function formatStatus(status) {
        const splitStatus = status.split("_");
        var formattedStatus = "";
        for (const word in splitStatus) {
            var lower = splitStatus[word].toLowerCase();
            var capital = lower[0].toUpperCase() + lower.slice(1);
            formattedStatus += capital + " ";
        }
        return formattedStatus;
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
                items={itemsList}
                selected={today}
                renderItem={renderItem}
            />
        </View>
    );
};

export default CalendarScreen;
