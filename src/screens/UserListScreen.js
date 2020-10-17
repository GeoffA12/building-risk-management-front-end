import React, { useEffect, useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import HeaderLogoutButton from '../components/HeaderLogoutButton';
import AuthContext from '../contexts/AuthContext';
import UserContext from '../contexts/UserContext';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const UserListScreen = ({ navigation }) => {
    const { logout } = useContext(AuthContext);
    const { user } = useContext(UserContext);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderLogoutButton name={'exit'} onPress={() => logout()} />
            ),
        });
    }, [navigation, logout]);

    return (
        <View style={styles.container}>
            <Text>Hello from User List Page!</Text>
            <Text>Hello {user.username}</Text>
        </View>
    );
};

export default UserListScreen;
