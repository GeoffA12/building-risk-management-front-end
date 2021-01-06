import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';

const Loading = ({ loading }) => {
    if (!loading) {
        return null;
    }

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <ActivityIndicator color={'black'} />
                <Text style={styles.text}>Please wait...</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
    },
    text: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Loading;
