import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { LIGHT_TEAL, DARK_BLUE } from '../../common/styles/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 10,
    },
    scheduleContainer: {
        padding: 6,
        margin: 9,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: `${LIGHT_TEAL}`,
        justifyContent: 'center',
        borderRadius: 10,
    },
    titleFont: {
        fontSize: 19,
        color: `${DARK_BLUE}`,
        fontWeight: '600',
        marginVertical: 7,
        textAlign: 'center',
    },
    subtitleFont: {
        fontSize: 14,
        color: 'black',
        fontWeight: '500',
        textAlign: 'center',
        padding: 2,
    },
    scheduleRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});

// TODO: Add an onPress, change the View to a TouchableOpacity so the user can edit the schedule if they want to
const RiskAssessmentSchedule = ({ schedule }) => {
    return (
        <View style={styles.container}>
            <View style={styles.scheduleContainer}>
                <Text style={styles.titleFont}> {schedule.title} </Text>
                <Text style={styles.subtitleFont}>
                    Currently: {schedule.status}{' '}
                </Text>
                <View style={styles.scheduleRow}>
                    <Text style={styles.subtitleFont}>
                        Due date: {schedule.dueDate}
                    </Text>
                    <Text style={styles.subtitleFont}>
                        Order: {schedule.workOrder}
                    </Text>
                </View>
            </View>
        </View>
    );
};

RiskAssessmentSchedule.propTypes = {
    schedule: PropTypes.object.isRequired,
};

export default RiskAssessmentSchedule;
