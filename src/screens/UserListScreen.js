import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, FlatList, View, Modal, Text } from 'react-native';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';
import UserContext from '../contexts/UserContext';
import UserForm from '../forms/UserForm';
import HeaderButton from '../components/HeaderButton';
import User from '../components/User';
import Loading from '../components/Loading';
import ListHeader from '../components/ListHeader';
import { SiteRoles } from '../config/SiteRolesConfig';
import { BASE_URL } from '../config/APIConfig';
import { LIGHT_TEAL } from '../styles/Colors';

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        marginHorizontal: 8,
        padding: 6,
        flex: 1,
    },
    contentContainerStyle: {
        margin: 10,
        paddingBottom: 20,
        paddingTop: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    modalToggle: {
        marginBottom: 5,
        borderWidth: 2,
        borderRadius: 15,
        borderColor: `${LIGHT_TEAL}`,
        padding: 10,
        alignSelf: 'center',
        marginTop: 20,
    },
});

const UserListScreen = ({ navigation }) => {
    const {
        auth: { logout },
        user,
    } = useContext(AuthContext);
    // const { user } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [selectedSiteRole, setSelectedSiteRole] = useState('0');
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [userId, setUserId] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    async function getUsers() {
        let userPages;
        setLoading(true);
        try {
            userPages = await axios.post(`${BASE_URL}/getAllUsersBySite`, {
                pageInput: {
                    sortBy: 'updatedAt',
                    sortDirection: 'DESC',
                    pageSize: 20,
                },
                siteIds: user.associatedSiteIds,
            });
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
        const userData = userPages.data.users;
        setUsers(userData);
    }

    async function handleSiteRoleChange(siteRole) {
        console.log(siteRole);
        if (SiteRoles.hasOwnProperty(siteRole)) {
            const filteredUsersBySiteRole = users.filter(
                (existingUser) =>
                    existingUser.siteRole === SiteRoles[siteRole].apiEnumValue
            );
            setFilteredUsers(filteredUsersBySiteRole);
        } else {
            setFilteredUsers(users);
        }
        setSelectedSiteRole(siteRole);
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerContainer}>
                    <HeaderButton
                        name={'add'}
                        onPress={() => handleAddUserPress()}
                    />
                    <HeaderButton name={'exit'} onPress={() => logout()} />
                </View>
            ),
        });
    }, [navigation, logout]);

    function handleUserCardPress(eventUser) {
        setUserId(eventUser.id);
        setFormTitle('Update User!');
        setModalOpen(true);
    }

    function handleAddUserPress() {
        setFormTitle('Create User!');
        setUserId('');
        setModalOpen(true);
    }

    function renderUser({ item: existingUser }) {
        return <User user={existingUser} onPress={handleUserCardPress} />;
    }

    function handleCancelPress() {
        console.log('Cancel button pressed!');
        setSearchText('First name..');
        getUsers();
    }

    function handleLeaveFormPress() {
        getUsers();
        setModalOpen(false);
    }

    useEffect(() => {
        setFilteredUsers((prevUsers) => {
            const filteredFirstNameUsers = users.filter(
                (existingUser) =>
                    existingUser.firstName.includes(searchText) || !searchText
            );
            return filteredFirstNameUsers;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);

    return (
        <View style={styles.container}>
            <Modal visible={modalOpen} animationType={'slide'}>
                <View>
                    <UserForm
                        navigation={navigation}
                        formTitle={formTitle}
                        leaveFormPress={handleLeaveFormPress}
                        userId={userId}
                    />
                </View>
            </Modal>

            <ListHeader
                searchText={searchText}
                handleSearchTextChange={setSearchText}
                handleCancelPress={handleCancelPress}
                placeholder={'First name..'}
                handleSiteRoleChange={handleSiteRoleChange}
                selectedSiteRole={selectedSiteRole}
            />

            <FlatList
                data={filteredUsers}
                renderItem={renderUser}
                keyExtractor={(userInList) => userInList.id}
                contentContainerStyle={styles.contentContainerStyle}
            />
            <Loading loading={loading} />
        </View>
    );
};

export default UserListScreen;
