import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-ionicons';
import FormInput from '../../common/components/FormInput';
import { LIGHT_GRAY, DARK_BLUE } from '../../common/styles/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 5,
        marginVertical: 5,
        borderTopColor: `${DARK_BLUE}`,
        borderTopWidth: 2,
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 7,
        paddingHorizontal: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formInputCell: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formInput: {
        color: `${LIGHT_GRAY}`,
        backgroundColor: `${DARK_BLUE}`,
    },
    iconStyle: {
        color: `${DARK_BLUE}`,
        marginTop: 6,
    },
});

const Screener = ({
    questionText,
    onChangeText,
    onRemoveScreener,
    isRiskAssessmentView,
    screenerIndex,
}) => (
    <View style={styles.container}>
        <View style={styles.rowContainer}>
            <View style={styles.formInputCell}>
                <FormInput
                    multiline={true}
                    style={styles.formInput}
                    onChangeText={(val) => onChangeText(val, screenerIndex)}
                    value={questionText}
                    placeholder={'Ex: Are working conditions safe?'}
                    placeholderTextColor={`${LIGHT_GRAY}`}
                />
            </View>
            <View style={styles.iconCell}>
                <Icon
                    name="trash"
                    size={23}
                    onPress={() => onRemoveScreener(screenerIndex)}
                    style={styles.iconStyle}
                />
            </View>
        </View>
        {isRiskAssessmentView ? (
            <View style={styles.rowContainer}>
                <Text>
                    I should only appear if not in risk assessment view!
                </Text>
            </View>
        ) : null}
    </View>
);

Screener.propTypes = {
    questionText: PropTypes.string,
    onChangeText: PropTypes.func.isRequired,
    onRemoveScreener: PropTypes.func.isRequired,
    isRiskAssessmentView: PropTypes.bool.isRequired,
    screenerIndex: PropTypes.number.isRequired,
};

Screener.defaultProps = {
    questionText: '',
};

export default Screener;
