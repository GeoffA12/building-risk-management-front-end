import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card } from 'react-native-paper';
import AuthContext from '../../auth/contexts/AuthContext';
import Error from '../../common/components/Error';
import Loading from '../../common/components/Loading';
import { useAPI } from '../../common/hooks/API';
import { useManagerCalendarHooks } from '../hooks/ManagerCalendarHooks';
import { useCalendarHooks } from '../../riskassessmentcalendar/hooks/CalendarHooks';
import { useHeader } from '../hooks/CalendarHeader';
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

const MaintenanceManagerCalendarScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const { setCalendarHeader } = useHeader();
    const {
        getAssociatesRiskAssessmentSchedules,
        riskAssessmentScheduleList,
        setRiskAssessmentScheduleList,
        agendaItems,
        setAgendaItems,
    } = useManagerCalendarHooks();
    const { formatRiskAssessmentSchedules } = useCalendarHooks();
    const { loading, setLoading, error, setError } = useAPI();

    const today = new Date().toISOString().slice(0, 10);
    useEffect(() => {
        setCalendarHeader(navigation, loadAssociatesRiskAssessmentSchedules);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation]);

    useEffect(() => {
        loadAssociatesRiskAssessmentSchedules();
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

    async function loadAssociatesRiskAssessmentSchedules() {
        setLoading(true);
        const riskAssessmentScheduleResponse = await getAssociatesRiskAssessmentSchedules(
            user.id
        );
        setLoading(false);
        if (!riskAssessmentScheduleResponse.data) {
            setError(riskAssessmentScheduleResponse.error.message);
            console.error(riskAssessmentScheduleResponse.error);
        } else {
            setRiskAssessmentScheduleList(riskAssessmentScheduleResponse.data);
        }
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
            <Error errorMessage={error} />
            <Agenda
                items={agendaItems}
                selected={today}
                renderItem={renderItem}
                minDate={'2017-05-16'}
                maxDate={'2024-05-16'}
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

export default MaintenanceManagerCalendarScreen;
