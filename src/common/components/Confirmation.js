import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { CONFIRMATION_GREEN } from '../styles/Colors';
import IconButton from './IconButton';

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: `${CONFIRMATION_GREEN}`,
        flex: 1,
        margin: 2,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        marginVertical: 2,
    },
    cardMessageText: {
        fontSize: 13,
        fontWeight: '500',
        color: 'black',
        textAlign: 'center',
    },
    cardTitleText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
        textAlign: 'center',
    },
    iconStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const Confirmation = ({
    title,
    message,
    handleConfirmationClose,
    containerStyle,
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.row}>
                <Text style={styles.cardTitleText}>{title}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.cardMessageText}>{message}</Text>
            </View>
            <View style={styles.row}>
                <IconButton
                    onPress={() => handleConfirmationClose()}
                    name={'close-circle'}
                    style={styles.iconStyle}
                    iconSize={25}
                />
            </View>
        </View>
    );
};

Confirmation.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    handleConfirmationClose: PropTypes.func.isRequired,
    containerStyle: PropTypes.object,
};

export default Confirmation;
