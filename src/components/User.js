import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import FlatListCard from './FlatListCard';

const styles = StyleSheet.create({
    card: {
        marginVertical: 10,
        marginHorizontal: 5,
    },
    siteInfoContainer: {
        padding: 5,
    },
    siteDescription: {
        fontSize: 14,
        fontWeight: '500',
        color: 'black',
    },
});

const User = ({ user, onPress }) => {
    return (
        <FlatListCard style={styles.card} onPress={onPress}>
            <View stlye={styles.siteInfoContainer}>
                <Text style={styles.siteDescription}>{user.email}</Text>
                <Text style={styles.siteDescription}>{user.firstName}</Text>
                <Text style={styles.siteDescription}>{user.lastName}</Text>
            </View>
        </FlatListCard>
    );
};

export default User;
