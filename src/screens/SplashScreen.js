import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#45cff5',
    },
});

const SplashScreen = () => {
    return <View style={styles.container} />;
};

export default SplashScreen;
