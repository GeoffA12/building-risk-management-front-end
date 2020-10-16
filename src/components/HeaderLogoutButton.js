import React from 'react';
import { StyleSheet } from 'react-native';
import IconButton from './IconButton';

const styles = StyleSheet.create({
    container: {
        marginRight: 8,
    },
});

const HeaderLogoutButton = ({ name, onPress }) => {
    return (
        <IconButton
            name={name}
            style={styles.container}
            onPress={onPress}
            iconSize={32}
        />
    );
};

export default HeaderLogoutButton;
