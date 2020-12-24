import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyledButton from './StyledButton';

const styles = StyleSheet.create({
    filterButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
    },
    filterButton: {
        fontSize: 17,
        fontWeight: '700',
        padding: 4,
        margin: 4,
        width: 250,
        textAlign: 'center',
    },
});

const ShowHideToggleButton = ({ buttonText, onPress }) => {
    return (
        <View style={styles.filterButtonContainer}>
            <StyledButton
                title={buttonText}
                onPress={onPress}
                style={styles.filterButton}
            />
        </View>
    );
};

export default ShowHideToggleButton;
