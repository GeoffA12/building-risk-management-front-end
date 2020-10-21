import React, { useEffect, useContext, useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import UserContext from '../contexts/UserContext';
import HeaderLogoutButton from '../components/HeaderLogoutButton';
import Loading from '../components/Loading';
import { BASE_URL_GEOFF_LOCAL } from '../config/APIConfig';

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
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getUsers() {
        let userPages;
        setLoading(true);
        try {
            userPages = await axios.post(
                `${BASE_URL_GEOFF_LOCAL}/getAllUsersBySite`,
                {
                    pageInput: {
                        sortBy: 'updatedAt',
                        sortDirection: 'DESC',
                    },
                    siteIds: user.associatedSiteIds,
                }
            );
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
        console.log(userPages);
    }

    console.log(user);
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
            <Loading loading={loading} />
        </View>
    );
};

export default UserListScreen;
