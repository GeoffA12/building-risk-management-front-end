import React from 'react';
import { View, StyleSheet } from 'react-native';
import HeaderButton from '../common/components/HeaderButton';

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});

export const useHeader = () => {
    function setCalendarHeader(navigation, logout) {
        navigation.setOptions({
            headerLeft: () => (
                <View style={styles.headerContainer}>
                    <HeaderButton name={'exit'} onPress={() => logout()} />
                </View>
            ),
        });
    }

    return {
        setCalendarHeader,
    };
};