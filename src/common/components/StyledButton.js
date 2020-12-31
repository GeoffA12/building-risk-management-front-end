import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DARK_BLUE, LIGHT_TEAL } from '../styles/Colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: `${DARK_BLUE}`,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
        borderRadius: 10,
    },
    text: {
        color: `${LIGHT_TEAL}`,
        fontSize: 20,
        fontWeight: '400',
        padding: 5,
    },
});

const StyledButton = ({ title, style, textStyle, onPress, disabled }) => {
    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={onPress}
            disabled={disabled}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

StyledButton.propTypes = {
    title: PropTypes.string.isRequired,
    style: PropTypes.object,
    textStyle: PropTypes.object,
    onPress: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

StyledButton.defaultProps = {
    style: styles.container,
    textStyle: styles.text,
    disabled: false,
};

export default StyledButton;
