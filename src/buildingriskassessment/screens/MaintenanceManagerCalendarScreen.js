import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card } from 'react-native-paper';
import AuthContext from '../../auth/contexts/AuthContext';
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

const MaintenanceManagerCalendarScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);

    const {
        getAssociatesRiskAssessmentSchedules,
        riskAssessmentScheduleList,
        setRiskAssessmentScheduleList,
        formatRiskAssessmentSchedules,
        agendaItems,
        setAgendaItems,
    } = useCalendarHooks();

    const today = new Date().toISOString().slice(0, 10);

    useEffect(() => {
        loadAssociatesRiskAssessmentSchedules(user.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [riskAssessmentScheduleList]);

    async function loadAssociatesRiskAssessmentSchedules(id) {
        const riskAssessmentScheduleData = await getAssociatesRiskAssessmentSchedules(
            id
        );
        setRiskAssessmentScheduleList(riskAssessmentScheduleData);
    }

    const renderItem = (item) => {
        return (
            <TouchableOpacity style={styles.agendaItemContainer}>
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

export default MaintenanceManagerCalendarScreen;
