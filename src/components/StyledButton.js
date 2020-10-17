import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#026cb8',
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 15,
        borderRadius: 10,
    },
    text: {
        color: '#45cff5',
        fontSize: 20,
        fontWeight: '400',
    },
});

const StyledButton = ({ title, style, onPress }) => {
    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            <Text style={[styles.text, style]}>{title}</Text>
        </TouchableOpacity>
    );
};

export default StyledButton;
