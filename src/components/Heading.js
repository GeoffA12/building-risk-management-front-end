import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { LIGHT_TEAL } from '../styles/Colors';

const styles = StyleSheet.create({
    text: {
        fontWeight: 'bold',
        fontSize: 38,
        color: `${LIGHT_TEAL}`,
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
