import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import FlatListCard from '../../common/components/FlatListCard';
import SiteRoles from '../../config/SiteRolesConfig';
import { LIGHT_TEAL } from '../../common/styles/Colors';

const styles = StyleSheet.create({
    card: {
        // marginVertical: 10,
        // marginHorizontal: 5,
        marginVertical: 15,
    },
    siteInfoContainer: {
        padding: 6,
    },
    siteDescription: {
        fontSize: 15,
        fontWeight: '700',
        color: `${LIGHT_TEAL}`,
    },
});

const User = ({ user, onPress }) => {
    return (
        <FlatListCard style={styles.card} onPress={() => onPress(user)}>
            <View stlye={styles.siteInfoContainer}>
                <Text
                    style={
                        styles.siteDescription
                    }>{`${user.firstName} ${user.lastName}`}</Text>
                <Text style={styles.siteDescription}>{user.email}</Text>
                <Text style={styles.siteDescription}>
                    {SiteRoles[`${user.siteRole}`].textField}
                </Text>
            </View>
        </FlatListCard>
    );
};

export default User;
