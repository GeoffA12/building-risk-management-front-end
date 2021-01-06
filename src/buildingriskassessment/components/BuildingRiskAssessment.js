import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import FlatListCard from '../../common/components/FlatListCard';
import { convertUTCDateToLocalDate } from '../../utils/Time';
import { LIGHT_GRAY, LIGHT_TEAL } from '../../common/styles/Colors';

const styles = StyleSheet.create({
    card: {
        marginVertical: 18,
    },
    contentContainer: {
        padding: 8,
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

const BuildingRiskAssessment = ({ onPress, entity }) => {
    function getTimePrefix() {
        return entity.entityTrail.length > 1 ? 'Updated at: ' : 'Created at: ';
    }

    return (
        <FlatListCard style={styles.card} onPress={() => onPress(entity)}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{entity.title}</Text>
                <Text
                    style={styles.subtitle}
                    adjustsFontSizeToFit={true}
                    numberOfLines={2}>
                    {entity.description}
                </Text>
                <Text style={styles.subtitle}>
                    {getTimePrefix() +
                        convertUTCDateToLocalDate(entity.updatedAt)}
                </Text>
            </View>
        </FlatListCard>
    );
};

export default BuildingRiskAssessment;
