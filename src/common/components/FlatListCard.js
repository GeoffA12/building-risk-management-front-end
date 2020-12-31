import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DARK_BLUE, DARK_PURPLE } from '../styles/Colors';

const styles = StyleSheet.create({
    card: {
        borderRadius: 5,
        elevation: 8,
        backgroundColor: `${DARK_BLUE}`,
        shadowColor: '#45cff5',
        shadowRadius: 1,
        shadowOpacity: 0.5,
        shadowOffset: { width: 1, height: 1 },
    },
    cardContent: {
        padding: 10,
    },
});

const FlatListCard = ({ style, children, onPress }) => {
    return (
        <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
            <View style={styles.cardContent}>{children}</View>
        </TouchableOpacity>
    );
};

export default FlatListCard;
