import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, FlatList, View, Modal } from 'react-native';
import AuthContext from '../../auth/contexts/AuthContext';
import UserForm from '../components/UserForm';
import User from '../components/User';
import Loading from '../../common/components/Loading';
import SearchFilters from '../../common/components/SearchFilters';
import SiteRoles from '../../config/SiteRolesConfig';
import { useUser } from '../hooks/UserHooks';
import { useHeader } from '../../common/hooks/Header';
import { pickerUtils } from '../../utils/Picker';
import { useAPI } from '../../common/hooks/API';
import { LIGHT_TEAL } from '../../common/styles/Colors';

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
    const { getUsers } = useUser();
    const { loading, setLoading, error, setError } = useAPI();
    const { setSiteRolePickerOptions } = pickerUtils();
    const { setListHeader } = useHeader();

    const [users, setUsers] = useState([]);
    const [selectedSiteRole, setSelectedSiteRole] = useState('0');
    const [searchText, setSearchText] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [userId, setUserId] = useState('');
    const [formTitle, setFormTitle] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        loadUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

    useEffect(() => {
        setListHeader(navigation, handleAddUserPress, logout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, logout]);

    async function loadUsers() {
        setLoading(true);
        const userPageResponse = await getUsers(
            user.associatedSiteIds,
            user.id
        );
        if (!userPageResponse.data) {
            console.error(userPageResponse.error);
            setError(userPageResponse.error.message);
        } else {
            setUsers(userPageResponse.data);
            if (error) {
                setError('');
            }
        }
        setLoading(false);
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
        loadUsers();
    }

    function setPickerCallback() {
        return setSiteRolePickerOptions(
            'Site role',
            Object.keys(SiteRoles),
            'textField',
            'apiEnumValue'
        );
    }

    function handleLeaveFormPress() {
        loadUsers();
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
                        handleExitFormPress={handleLeaveFormPress}
                        userId={userId}
                    />
                </View>
            </Modal>

            <SearchFilters
                searchText={searchText}
                handleSearchTextChange={setSearchText}
                // handleCancelPress={handleCancelPress}
                placeholder={'First name..'}
                handleFilterChange={handleSiteRoleChange}
                selectedFilterValue={selectedSiteRole}
                setPickerCallback={setPickerCallback}
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
