import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'red',
        fontWeight: '800',
        fontSize: 16,
    },
});

const Error = ({ errorMessage }) => {
    return (
        <>
            {errorMessage ? (
                <View style={styles.container}>
                    <Text style={styles.text}>{errorMessage}</Text>
                </View>
            ) : null}
        </>
    );
};

export default Error;
