import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import axios from 'axios';
import Heading from '../components/Heading';
import FormInput from '../components/FormInput';
import StyledButton from '../components/StyledButton';
import IconButton from '../components/IconButton';
import Error from '../components/Error';
import AuthContainer from '../components/AuthContainer';
import ShowHideToggleButton from '../components/ShowHideToggleButton';
import AuthContext from '../contexts/AuthContext';
import EnhancedPicker from '../components/EnhancedPicker';
import Row from '../components/Row';
import Loading from '../components/Loading';
import SiteRoles from '../config/SiteRolesConfig';
import { DARK_BLUE, LIGHT_TEAL, DISABLED_BUTTON } from '../styles/Colors';
import { BASE_URL } from '../config/APIConfig';
import EntityStatus from '../components/EntityStatus';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 15,
    },
    input: {
        marginVertical: 12,
    },
    registrationButton: {
        marginVertical: 12,
    },
    closeIcon: {
        position: 'absolute',
        top: 32,
        right: 32,
    },
    deleteAndSaveContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveAndDelete: {
        backgroundColor: `${DARK_BLUE}`,
        width: '40%',
        margin: 10,
    },
    disabledSaveAndDelete: {
        backgroundColor: `${DISABLED_BUTTON}`,
        width: '40%',
        margin: 10,
    },
    textStyle: {
        fontSize: 16,
        padding: 5,
        margin: 5,
        fontWeight: '700',
        textAlign: 'center',
        color: `${LIGHT_TEAL}`,
    },
    rowContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        marginVertical: 8,
        marginHorizontal: 8,
    },
    pickerContainer: {
        width: '70%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 7,
    },
    picker: {
        width: 250,
    },
});

const UserForm = ({ navigation, formTitle, userId, leaveFormPress }) => {
    const {
        auth: { register },
        user,
    } = useContext(AuthContext);
    const [selectedSiteRole, setSelectedSiteRole] = useState('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sites, setSites] = useState([]);
    const [userSites, setUserSites] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [openFilters, setOpenFilters] = useState(false);
    const [siteToggleButtonText, setSiteToggleButtonText] = useState(
        'Show associated sites'
    );
    const [siteMaintenanceManagers, setSiteMaintenanceManagers] = useState([]);
    const [
        showSiteMaintenanceManagers,
        setShowSiteMaintenanceManagers,
    ] = useState(false);
    const [
        selectedSiteMaintenanceManager,
        setSelectedSiteMaintenanceManager,
    ] = useState('0');
    const [selectedSite, setSelectedSite] = useState('0');
    const [userModel, setUserModel] = useState({
        id: '',
        entityTrail: '',
        createdAt: '',
        updatedAt: '',
        publisherId: '',
        siteRole: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        username: '',
        associatedSiteIds: '',
    });

    const [userModelPlayground, setUserModelPlayground] = useState(
        cloneDeep(userModel)
    );

    useEffect(() => {
        loadAllSites();
        loadSiteMaintenanceManagers();
        if (userId) {
            loadUserProfile();
            setButtonDisabled(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setUserModelPlayground(userModel);
        if (userModel.id) {
            loadUserSites();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userModel]);

    useEffect(() => {
        if (!isEqual(userModel, userModelPlayground)) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userModelPlayground]);

    useEffect(() => {
        if (
            SiteRoles.hasOwnProperty(selectedSiteRole) &&
            SiteRoles[selectedSiteRole].apiEnumValue === 'SITEMAINTENANCEASSC'
        ) {
            setShowSiteMaintenanceManagers(true);
        } else {
            setShowSiteMaintenanceManagers(false);
        }
    }, [selectedSiteRole]);

    async function loadUserProfile() {
        let userProfile;
        setLoading(true);
        try {
            userProfile = await axios.get(
                `${BASE_URL}/getUserById?id=${userId}`
            );
        } catch (e) {
            console.error(e.message);
        }
        setLoading(false);
        const userData = userProfile.data;
        const userModelData = {
            id: userData.id,
            entityTrail: userData.entityTrail,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            publisherId: userData.publisherId,
            siteRole: userData.siteRole,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            username: userData.username,
            associatedSiteIds: userData.associatedSiteIds,
            authToken: userData.authToken,
        };
        setUserModel(userModelData);
    }

    async function loadUserSites() {
        let loadedUserSites;
        try {
            setLoading(true);
            loadedUserSites = await axios.post(`${BASE_URL}/getSites`, {
                siteIds: userModel.associatedSiteIds,
            });
        } catch (e) {
            console.error(e);
            setError(e.message());
            setLoading(false);
            return;
        }
        setError('');
        setLoading(false);
        setUserSites(loadedUserSites.data);
    }

    async function loadSiteMaintenanceManagers() {
        let loadedSiteMaintenanceManagers;
        try {
            setLoading(true);
            loadedSiteMaintenanceManagers = await axios.get(
                `${BASE_URL}/getUsersBySiteRole?siteRole=SITEMAINTENANCEMGR`
            );
        } catch (e) {
            console.error(e);
            setError(e.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        setError('');
        setSiteMaintenanceManagers(loadedSiteMaintenanceManagers.data);
    }

    async function handleRegisterPress() {
        try {
            setLoading(true);
            await register(
                selectedSiteRole,
                userModelPlayground.firstName,
                userModelPlayground.lastName,
                userModelPlayground.email,
                userModelPlayground.phone,
                userModelPlayground.username,
                userModelPlayground.password,
                selectedSite,
                selectedSiteMaintenanceManager
            );
            setError(false);
            setLoading(false);
            leaveFormPress();
        } catch (e) {
            console.error(e);
            setError(e.message);
            return;
        }
    }

    async function deleteUser() {
        let existingUserSiteRole = userModel.siteRole;
        let siteRoleUrlValue = SiteRoles[existingUserSiteRole].urlValue;
        try {
            setLoading(true);
            await axios.delete(
                `${BASE_URL}/delete${siteRoleUrlValue}?id=${userModel.id}`
            );
            setLoading(false);
            leaveFormPress();
        } catch (e) {
            console.error(e.message);
            setError(e.message);
        }
    }

    async function saveUser() {
        let existingUserSiteRole = userModel.siteRole;
        let updatedAssociatedSiteIds = [];
        userSites.map((site) => {
            updatedAssociatedSiteIds.push(site.id);
        });
        let updatedUser;
        const siteRoleUrlValue = SiteRoles[existingUserSiteRole].urlValue;
        try {
            setLoading(true);
            updatedUser = await axios.post(
                `${BASE_URL}/update${siteRoleUrlValue}`,
                {
                    id: userModel.id,
                    username: userModelPlayground.username,
                    siteRole: userModelPlayground.siteRole,
                    firstName: userModelPlayground.firstName,
                    lastName: userModelPlayground.lastName,
                    email: userModelPlayground.email,
                    phone: userModelPlayground.phone,
                    siteIds: updatedAssociatedSiteIds,
                    userId: user.id,
                }
            );
        } catch (e) {
            console.error(e);
            setError(e.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        setError('');
        const userData = updatedUser.data;
        const userModelData = {
            id: userData.id,
            entityTrail: userData.entityTrail,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            publisherId: userData.publisherId,
            siteRole: userData.siteRole,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            username: userData.username,
            associatedSiteIds: userData.associatedSiteIds,
            authToken: userData.authToken,
        };
        setUserModel(userModelData);
    }

    async function loadAllSites() {
        let allSites;
        setLoading(true);
        try {
            allSites = await axios.get(`${BASE_URL}/getAllSites`);
        } catch (e) {
            console.error(e);
            setError(e.message);
            return;
        }
        setError(false);
        setLoading(false);
        setSites(allSites.data);
    }

    function handleUserModelPlaygroundChange(fieldKey, value) {
        setUserModelPlayground((prevPlayground) => {
            let updatedPlayground = cloneDeep(prevPlayground);
            updatedPlayground[fieldKey] = value;
            return updatedPlayground;
        });
    }

    function handleSiteRoleChange(val) {
        if (val !== 0) {
            setSelectedSiteRole(val);
        }
    }

    function handleSiteChange(val) {
        if (val !== 0) {
            setSelectedSite(val);
            if (userId) {
                let targetSite;
                for (let x = 0; x < sites.length; ++x) {
                    if (sites[x].id === val) {
                        targetSite = sites[x];
                        break;
                    }
                }
                let siteAlreadyAdded = false;
                const prevUserSites = userSites;
                for (let y = 0; y < prevUserSites.length; ++y) {
                    if (isEqual(prevUserSites[y], targetSite)) {
                        siteAlreadyAdded = true;
                        break;
                    }
                }
                if (!siteAlreadyAdded) {
                    prevUserSites.push(targetSite);
                    setButtonDisabled(false);
                    setUserSites(prevUserSites);
                }
            }
        }
    }

    function handleSiteRemovePress(val) {
        if (userSites.length !== 0) {
            let targetIndex;
            for (let x = 0; x < userSites.length; ++x) {
                if (userSites[x].id === val) {
                    targetIndex = x;
                }
            }
            const prevUserSites = [...userSites];
            prevUserSites.splice(targetIndex, 1);
            setUserSites(prevUserSites);
            setButtonDisabled(false);
        }
    }

    function handleSiteMaintenanceManagerChange(val) {
        if (val !== '0') {
            setSelectedSiteMaintenanceManager(val);
        }
    }

    function setSiteMaintenanceManagerPickerOptions() {
        let siteMaintenanceManagerOptions = [];
        siteMaintenanceManagerOptions.push({
            label: 'Select your manager',
            value: '0',
        });
        const siteMaintenanceManagersCopy = siteMaintenanceManagers.map(
            (manager) => ({ ...manager })
        );
        for (let x = 0; x < siteMaintenanceManagersCopy.length; ++x) {
            let currentManager = siteMaintenanceManagersCopy[x];
            currentManager.label =
                `${currentManager.firstName}` + ` ${currentManager.lastName}`;
            currentManager.value = currentManager.id;
            siteMaintenanceManagerOptions.push(currentManager);
        }
        return siteMaintenanceManagerOptions;
    }

    function setSitePickerOptions() {
        let siteOptions = [];
        siteOptions.push({
            label: 'Select your site',
            value: '0',
        });
        const sitesCopy = sites.map((site) => ({ ...site }));
        for (let x = 0; x < sitesCopy.length; ++x) {
            let currentSite = sitesCopy[x];
            currentSite.label = currentSite.siteName;
            currentSite.value = currentSite.id;
            siteOptions.push(currentSite);
        }
        return siteOptions;
    }

    function setSiteRolePickerOptions() {
        const siteRoles = Object.keys(SiteRoles);
        let pickerOptions = [];
        pickerOptions.push({
            label: 'Select your site role',
            value: '0',
        });
        for (let x = 0; x < siteRoles.length; ++x) {
            let currentOption = {};
            let currentSiteRoleKey = siteRoles[x];
            currentOption.label = SiteRoles[currentSiteRoleKey].textField;
            currentOption.value = SiteRoles[currentSiteRoleKey].apiEnumValue;
            pickerOptions.push(currentOption);
        }
        return pickerOptions;
    }

    function handleSiteButtonTogglePress() {
        setOpenFilters((prevOpenFilters) => {
            return !prevOpenFilters;
        });
        setSiteToggleButtonText((prevSiteToggleText) => {
            if (prevSiteToggleText === 'Show associated sites') {
                return 'Hide associated sites';
            } else {
                return 'Show associates sites';
            }
        });
    }

    // TODO: Update the back end update API's so that we don't have to do this and can directly access the correct userId using userModel.publisherId.
    function getPublisherId() {
        const userEntityTrail = userModel.entityTrail;
        const mostRecentUpdate = userEntityTrail[userEntityTrail.length - 1];
        return mostRecentUpdate.userId;
    }

    function renderAssociatedSiteRows() {
        if (userId) {
            return (
                <>
                    <ShowHideToggleButton
                        buttonText={siteToggleButtonText}
                        onPress={handleSiteButtonTogglePress}
                    />
                    {openFilters ? (
                        <View style={styles.rowContainer}>
                            {userSites.map((site) => {
                                return (
                                    <Row
                                        key={site.id}
                                        iconName={'close-circle'}
                                        entity={site}
                                        onPress={handleSiteRemovePress}
                                    />
                                );
                            })}
                        </View>
                    ) : null}
                </>
            );
        } else {
            return null;
        }
    }

    return (
        <ScrollView>
            <AuthContainer>
                <IconButton
                    name={'close-circle'}
                    style={styles.closeIcon}
                    iconSize={30}
                    onPress={leaveFormPress}
                />
                <Heading>{formTitle}</Heading>
                {userId && userModel.entityTrail ? (
                    <EntityStatus
                        entityName={'User'}
                        publisherId={getPublisherId()}
                        updatedAt={userModel.updatedAt}
                    />
                ) : null}
                <Error errorMessage={error} />
                <FormInput
                    style={styles.input}
                    placeholder={'First name'}
                    onChangeText={(val) =>
                        handleUserModelPlaygroundChange('firstName', val)
                    }
                    value={userModelPlayground.firstName}
                />
                <FormInput
                    style={styles.input}
                    placeholder={'Last name'}
                    onChangeText={(val) =>
                        handleUserModelPlaygroundChange('lastName', val)
                    }
                    value={userModelPlayground.lastName}
                />
                <FormInput
                    style={styles.input}
                    placeholder={'Email'}
                    keyboardType={'email-address'}
                    onChangeText={(val) =>
                        handleUserModelPlaygroundChange('email', val)
                    }
                    value={userModelPlayground.email}
                />
                <FormInput
                    style={styles.input}
                    placeholder={'Phone'}
                    keyboardType={'phone-pad'}
                    onChangeText={(val) =>
                        handleUserModelPlaygroundChange('phone', val)
                    }
                    value={userModelPlayground.phone}
                />
                <FormInput
                    style={styles.input}
                    placeholder={'Username'}
                    onChangeText={(val) =>
                        handleUserModelPlaygroundChange('username', val)
                    }
                    value={userModelPlayground.username}
                />
                {userId ? null : (
                    <>
                        <FormInput
                            style={styles.input}
                            placeholder={'Password'}
                            secureTextEntry
                            onChangeText={(val) =>
                                handleUserModelPlaygroundChange('password', val)
                            }
                            value={userModelPlayground.password}
                        />
                        <View style={styles.pickerContainer}>
                            <EnhancedPicker
                                onChange={handleSiteRoleChange}
                                currentRoleSelected={selectedSiteRole}
                                pickerOptions={setSiteRolePickerOptions()}
                                prompt={'Select your site role'}
                                style={styles.picker}
                            />
                        </View>
                    </>
                )}
                <View style={styles.pickerContainer}>
                    <EnhancedPicker
                        onChange={handleSiteChange}
                        currentRoleSelected={selectedSite}
                        pickerOptions={setSitePickerOptions()}
                        prompt={'Select your site'}
                        style={styles.picker}
                    />
                </View>

                {renderAssociatedSiteRows()}

                {showSiteMaintenanceManagers ? (
                    <View style={styles.pickerContainer}>
                        <EnhancedPicker
                            onChange={handleSiteMaintenanceManagerChange}
                            currentRoleSelected={selectedSiteMaintenanceManager}
                            pickerOptions={setSiteMaintenanceManagerPickerOptions()}
                            prompt={'Select your manager'}
                            style={styles.picker}
                        />
                    </View>
                ) : null}

                {!userId ? (
                    <StyledButton
                        title={'Sign up'}
                        style={styles.registrationButton}
                        onPress={handleRegisterPress}
                    />
                ) : (
                    <View style={styles.deleteAndSaveContainer}>
                        <StyledButton
                            title={'Save'}
                            style={
                                buttonDisabled
                                    ? styles.disabledSaveAndDelete
                                    : styles.saveAndDelete
                            }
                            textStyle={styles.textStyle}
                            onPress={saveUser}
                            disabled={buttonDisabled}
                        />
                        <StyledButton
                            title={'Delete'}
                            style={styles.saveAndDelete}
                            onPress={deleteUser}
                            textStyle={styles.textStyle}
                            disabled={false}
                        />
                    </View>
                )}
                <Loading loading={loading} />
            </AuthContainer>
        </ScrollView>
    );
};

UserForm.propTypes = {
    navigation: PropTypes.object.isRequired,
    formTitle: PropTypes.string.isRequired,
    leaveFormPress: PropTypes.func.isRequired,
    userId: PropTypes.string,
};

UserForm.defaultProps = {
    userId: '',
};

export default UserForm;
