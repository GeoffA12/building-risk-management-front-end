import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-ionicons';
import { DARK_BLUE } from '../styles/Colors';

const styles = StyleSheet.create({
    closeButton: {
        color: `${DARK_BLUE}`,
    },
    container: {},
});

const IconButton = ({ name, style, iconSize, onPress }) => {
    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            <Icon name={name} style={styles.closeButton} size={iconSize} />
        </TouchableOpacity>
    );
};

export default IconButton;
