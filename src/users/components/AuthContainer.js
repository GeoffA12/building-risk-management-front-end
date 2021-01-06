import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 14,
        paddingTop: 10,
        alignItems: 'center',
    },
});

const AuthContainer = ({ children }) => {
    return <View style={styles.container}>{children}</View>;
};

export default AuthContainer;