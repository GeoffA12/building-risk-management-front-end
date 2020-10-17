import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#45cff5',
        width: '90%',
        padding: 15,
        borderRadius: 10,
    },
});

const FormInput = ({ children, style, ...props }) => {
    return <TextInput {...props} style={[styles.input, style]} />;
};

export default FormInput;
