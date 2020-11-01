import React from 'react';
import { StyleSheet } from 'react-native';
import IconButton from './IconButton';

const styles = StyleSheet.create({
    container: {
        marginRight: 25,
    },
});

const HeaderButton = ({ name, onPress, style }) => {
    return (
        <IconButton
            name={name}
            style={[styles.container, style]}
            onPress={onPress}
            iconSize={32}
        />
    );
};

export default HeaderButton;
