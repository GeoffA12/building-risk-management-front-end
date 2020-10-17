import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
    text: {
        fontWeight: 'bold',
        fontSize: 38,
        color: '#026cb8',
        marginBottom: 32,
        marginTop: 15,
    },
});

const Heading = ({ children, style, ...props }) => {
    return (
        <Text {...props} style={[styles.text, style]}>
            {children}
        </Text>
    );
};

export default Heading;
