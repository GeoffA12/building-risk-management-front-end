import React from 'react';
import { StyleSheet } from 'react-native';
import IconButton from './IconButton';

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
        marginVertical: 2,
        padding: 4,
    },
});

const HeaderButton = ({ name, onPress, style }) => {
    return (
        <IconButton
            name={name}
            style={styles.container}
            onPress={onPress}
            iconSize={32}
        />
    );
};

export default HeaderButton;
