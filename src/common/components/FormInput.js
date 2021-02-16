import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { LIGHT_TEAL } from '../styles/Colors';

const styles = StyleSheet.create({
    input: {
        backgroundColor: `${LIGHT_TEAL}`,
        width: '90%',
        paddingHorizontal: 10,
        borderRadius: 10,
    },
});

const FormInput = ({ style, ...props }) => {
    return <TextInput {...props} style={[styles.input, style]} />;
};

export default FormInput;
