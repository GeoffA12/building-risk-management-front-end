import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    card: {
        borderRadius: 5,
        elevation: 8,
        backgroundColor: '#026cb8',
        shadowColor: '#45cff5',
        shadowRadius: 1,
        shadowOpacity: 0.8,
        shadowOffset: { width: 1, height: 1 },
    },
    cardContent: {
        padding: 5,
    },
});

const FlatListCard = ({ style, children, onPress }) => {
    return (
        <View style={[styles.card, style]} onPress={onPress}>
            <View style={styles.cardContent}>{children}</View>
        </View>
    );
};

export default FlatListCard;
