import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LIGHT_TEAL } from '../styles/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: `${LIGHT_TEAL}`,
    },
});

const SplashScreen = () => {
    return <View style={styles.container} />;
};

export default SplashScreen;
