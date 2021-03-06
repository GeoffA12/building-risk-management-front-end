import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-ionicons';
import PropTypes from 'prop-types';
import { LIGHT_TEAL, DARK_BLUE } from '../../common/styles/Colors';
import { convertUTCDateToLocalDate } from '../../utils/Time';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 10,
        borderWidth: 1,
        borderBottomColor: `${DARK_BLUE}`,
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
    iconStyle: {
        color: `${DARK_BLUE}`,
        paddingVertical: 3,
        paddingHorizontal: 2,
    },
    iconButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'stretch',
        marginTop: 6,
    },
});

// TODO: Add an onPress, change the View to a TouchableOpacity so the user can edit the schedule if they want to
const RiskAssessmentSchedule = ({
    schedule,
    cancelPress,
    editPress,
    index,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.scheduleRow}>
                <TouchableOpacity
                    onPress={() => cancelPress(index)}
                    style={styles.iconButton}>
                    <Icon name="close" size={23} style={styles.iconStyle} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => editPress(schedule, index)}
                    style={styles.iconButton}>
                    <Icon name="create" size={23} style={styles.iconStyle} />
                </TouchableOpacity>
            </View>
            <View style={styles.scheduleContainer}>
                <Text style={styles.titleFont}> {schedule.title} </Text>
                <Text style={styles.subtitleFont}>
                    Currently: {schedule.status}{' '}
                </Text>
                <View style={styles.scheduleRow}>
                    <Text style={styles.subtitleFont}>
                        Due date:{' '}
                        {convertUTCDateToLocalDate(schedule.dueDate, false)}
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
    cancelPress: PropTypes.func.isRequired,
    editPress: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
};

export default RiskAssessmentSchedule;
