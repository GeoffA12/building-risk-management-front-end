import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card } from 'react-native-paper';
import AuthContext from '../../auth/contexts/AuthContext';
import Error from '../../common/components/Error';
import Loading from '../../common/components/Loading';
import { useAPI } from '../../common/hooks/API';
import { useHeader } from '../hooks/CalendarHeader';
import { navigationRoutes } from '../../config/NavConfig';
import { useCalendarHooks } from '../hooks/CalendarHooks.js';
import { DARK_BLUE, LIGHT_TEAL } from '../../common/styles/Colors';

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
    const { loading, setLoading, error, setError } = useAPI();

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [riskAssessmentScheduleList]);

    async function loadSiteMaintenanceAssociate() {
        setLoading(true);
        const siteMaintenanceAssociateResponse = await getSiteMaintenanceAssociateById(
            user.id
        );
        setLoading(false);
        if (!siteMaintenanceAssociateResponse.data) {
            setError(siteMaintenanceAssociateResponse.error.message);
            console.error(siteMaintenanceAssociateResponse.error);
        } else {
            setAssignedRiskAssessmentScheduleIds(
                siteMaintenanceAssociateResponse.data
                    .assignedRiskAssessmentScheduleIds
            );
        }
    }

    async function loadAssignedRiskAssessmentSchedules(ids) {
        setLoading(true);
        const assignedRiskAssessmentScheduleResponse = await getAssignedRiskAssessmentSchedules(
            ids
        );
        setLoading(false);
        if (!assignedRiskAssessmentScheduleResponse.data) {
            setError(assignedRiskAssessmentScheduleResponse.error.message);
            console.error(assignedRiskAssessmentScheduleResponse.error);
        } else {
            setRiskAssessmentScheduleList(
                assignedRiskAssessmentScheduleResponse.data
            );
        }
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
            <Error errorMessage={error} />
            <Agenda
                items={agendaItems}
                selected={today}
                minDate={'2017-05-16'}
                maxDate={'2024-05-16'}
                renderItem={renderItem}
                theme={{
                    agendaDayTextColor: `${DARK_BLUE}`,
                    agendaDayNumColor: `${DARK_BLUE}`,
                    agendaKnobColor: `${LIGHT_TEAL}`,
                }}
            />
            <Loading loading={loading} />
        </View>
    );
};

export default CalendarScreen;
