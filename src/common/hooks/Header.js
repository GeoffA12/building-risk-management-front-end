import React from 'react';
import { View, StyleSheet } from 'react-native';
import HeaderButton from '../components/HeaderButton';

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});

export const useHeader = () => {
    function setListHeader(navigation, addIconPressHandler, logout) {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerContainer}>
                    <HeaderButton name={'add'} onPress={addIconPressHandler} />
                </View>
            ),
            headerLeft: () => (
                <View style={styles.headerContainer}>
                    <HeaderButton name={'exit'} onPress={() => logout()} />
                </View>
            ),
        });
    }

    return {
        setListHeader,
    };
};
