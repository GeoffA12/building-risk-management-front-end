import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DARK_BLUE, LIGHT_TEAL } from '../styles/Colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: `${DARK_BLUE}`,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 15,
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

export default StyledButton;
