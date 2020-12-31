import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import FlatListCard from '../../common/components/FlatListCard';
import { convertUTCDateToLocalDate } from '../../utils/Time';
import { LIGHT_GRAY, LIGHT_TEAL } from '../../common/styles/Colors';

const styles = StyleSheet.create({
    card: {
        marginVertical: 15,
    },
    contentContainer: {
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '700',
        margin: 7,
        color: `${LIGHT_TEAL}`,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        color: `${LIGHT_GRAY}`,
    },
});

const RiskAssessment = ({ riskAssessment, onPress }) => {
    function getTimePrefix() {
        return riskAssessment.entityTrail.length > 1
            ? 'Updated at: '
            : 'Created at: ';
    }

    return (
        <FlatListCard
            style={styles.card}
            onPress={() => onPress(riskAssessment)}>
            <View stlye={styles.contentContainer}>
                <Text style={styles.title}>{riskAssessment.title}</Text>
                <Text
                    style={styles.subtitle}
                    adjustsFontSizeToFit={true}
                    numberOfLines={2}>
                    {riskAssessment.taskDescription}
                </Text>
                <Text style={styles.subtitle}>
                    {getTimePrefix() +
                        convertUTCDateToLocalDate(riskAssessment.updatedAt)}
                </Text>
            </View>
        </FlatListCard>
    );
};

RiskAssessment.propTypes = {
    riskAssessment: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
};

export default RiskAssessment;
