import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-ionicons';
import {
    riskImpactPickerOptions,
    riskCategoryPickerOptions,
} from '../config/PickerOptions';
import { DARK_BLUE } from '../../styles/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 7,
        marginVertical: 6,
        borderTopWidth: 2,
        borderTopColor: `${DARK_BLUE}`,
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 6,
        justifyContent: 'space-between',
    },
    titleInputCell: {
        flex: 5,
    },
    iconCell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    descriptionCell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        color: `${DARK_BLUE}`,
    },
});

const Hazard = ({
    hazard,
    index,
    isRiskAssessmentView,
    onEditPress,
    onRemoveHazard,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={styles.titleInputCell}>
                    <Text style={styles.text}>{hazard.description}</Text>
                </View>
                <View style={styles.iconCell}>
                    <Icon
                        name="create"
                        size={23}
                        onPress={() => onEditPress(index)}
                        color={`${DARK_BLUE}`}
                    />
                </View>
                <View style={styles.iconCell}>
                    <Icon
                        name="trash"
                        size={23}
                        onPress={() => onRemoveHazard(index)}
                        color={`${DARK_BLUE}`}
                    />
                </View>
            </View>
            <View style={styles.rowContainer}>
                <View style={styles.descriptionCell}>
                    <Text style={styles.text}>{hazard.directions}</Text>
                </View>
            </View>
            <View style={styles.rowContainer}>
                <View style={styles.descriptionCell}>
                    <Text style={styles.text}>
                        {
                            riskCategoryPickerOptions[`${hazard.riskCategory}`]
                                .label
                        }
                    </Text>
                </View>
                <View style={styles.descriptionCell}>
                    <Text style={styles.text}>
                        {riskImpactPickerOptions[`${hazard.riskImpact}`].label}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default Hazard;
