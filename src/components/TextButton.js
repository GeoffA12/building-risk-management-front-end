import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        marginTop: 5,
    },
    text: {
        color: '#026cb8',
        fontSize: 14,
        fontWeight: '400',
    },
});

const TextButton = ({ title, style, onPress }) => {
    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

export default TextButton;
