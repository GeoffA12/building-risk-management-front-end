import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash.isequal';
import PropTypes from 'prop-types';
import Heading from '../../common/components/Heading';
import FormInput from '../../common/components/FormInput';
import StyledButton from '../../common/components/StyledButton';
import IconButton from '../../common/components/IconButton';
import Error from '../../common/components/Error';
import AuthContainer from './AuthContainer';
import ShowHideToggleButton from '../../common/components/ShowHideToggleButton';
import AuthContext from '../../auth/contexts/AuthContext';
import EnhancedPicker from '../../common/components/EnhancedPicker';
import Row from './Row';
import Loading from '../../common/components/Loading';
import { useUser } from '../hooks/UserHooks';
import { useAPI } from '../../common/hooks/API';
import { entityTrailUtils } from '../../utils/EntityTrail';
import { pickerUtils } from '../../utils/Picker';
import SiteRoles from '../../config/SiteRolesConfig';
import {
    DARK_BLUE,
    LIGHT_TEAL,
    DISABLED_BUTTON,
} from '../../common/styles/Colors';
import EntityStatus from '../../common/components/EntityStatus';

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

const UserForm = ({ navigation, formTitle, userId, handleExitFormPress }) => {
    const {
        auth: { register },
        user,
    } = useContext(AuthContext);
    const {
        userModel,
        setUserModel,
        userModelPlayground,
        setUserModelPlayground,
        getUserProfile,
        getAllSites,
        getAllSiteMaintenanceManagers,
        saveUser,
        deleteUser,
    } = useUser();
    const [selectedSiteRole, setSelectedSiteRole] = useState('0');
    const {
        loading,
        setLoading,
        error,
        setError,
        getAuthenticatedSites,
    } = useAPI();
    const { setPickerOptions, setSiteRolePickerOptions } = pickerUtils();
    const { getUserLastUpdatedId } = entityTrailUtils();

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
    const [showSites, setShowSites] = useState(false);
    const [
        selectedSiteMaintenanceManager,
        setSelectedSiteMaintenanceManager,
    ] = useState('0');
    const [selectedSite, setSelectedSite] = useState('0');

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
        setShowSites(true);
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
        if (SiteRoles.hasOwnProperty(selectedSiteRole)) {
            if (
                SiteRoles[selectedSiteRole].apiEnumValue ===
                'SITEMAINTENANCEASSC'
            ) {
                setShowSiteMaintenanceManagers(true);
                setShowSites(true);
            } else if (
                SiteRoles[selectedSiteRole].apiEnumValue === 'SITEADMIN'
            ) {
                setShowSites(false);
                setShowSiteMaintenanceManagers(false);
            } else {
                setShowSites(true);
                setShowSiteMaintenanceManagers(false);
            }
        } else {
            setShowSiteMaintenanceManagers(false);
            setShowSites(false);
        }
    }, [selectedSiteRole]);

    async function loadUserProfile() {
        setLoading(true);
        const userObject = await getUserProfile(userId);

        if (!userObject.data) {
            setError(userObject.error);
            console.error(userObject.error);
        } else {
            if (error) {
                setError(userObject.error.message);
            }
            setUserModel(userObject.data);
        }
        setLoading(false);
    }

    async function loadAllSites() {
        setLoading(true);
        const loadedSites = await getAllSites();

        if (!loadedSites.data) {
            console.error(loadedSites.error);
            setError(loadedSites.error.message);
        } else {
            setSites(loadedSites.data);
            if (error) {
                setError('');
            }
        }
        setLoading(false);
    }

    async function loadUserSites() {
        setLoading(true);
        const loadedUserSites = await getAuthenticatedSites({
            siteIds: userModel.associatedSiteIds,
        });
        if (!loadedUserSites.data) {
            console.error(loadedUserSites.error);
            setError(loadedUserSites.error.message);
        } else {
            setUserSites(loadedUserSites.data);
            if (error) {
                setError('');
            }
        }
        setLoading(false);
    }

    async function loadSiteMaintenanceManagers() {
        setLoading(true);
        const loadedSiteMaintenanceManagers = await getAllSiteMaintenanceManagers();

        if (!loadedSiteMaintenanceManagers.data) {
            console.error(loadSiteMaintenanceManagers.error);
            setError(loadSiteMaintenanceManagers.error.message);
        } else {
            setSiteMaintenanceManagers(loadedSiteMaintenanceManagers.data);
            if (error) {
                setError('');
            }
        }
        setLoading(false);
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
        } catch (e) {
            console.error(e);
            setError(e.message);
            return;
        }
        handleExitFormPress(true);
    }

    async function handleDeleteUser() {
        setLoading(true);
        const deletedUser = await deleteUser(userModelPlayground, user.id);
        if (!deletedUser.data) {
            console.error(deletedUser.error);
            setError(deletedUser.error.message);
        }
        setLoading(false);
    }

    async function handleSaveUser() {
        setLoading(true);
        let updateUserInput = {
            id: userModelPlayground.id,
            userId: user.id,
            firstName: userModelPlayground.firstName,
            lastName: userModelPlayground.lastName,
            username: userModelPlayground.username,
            email: userModelPlayground.email,
            phone: userModelPlayground.phone,
            siteIds: userModelPlayground.associatedSiteIds,
            password: null,
        };

        const savedUser = await saveUser(
            userSites,
            updateUserInput,
            userModelPlayground.siteRole
        );

        if (!savedUser.data) {
            console.error(savedUser.error);
            setError(savedUser.error.message);
        } else {
            setUserModel(savedUser.data);
            if (error) {
                setError('');
            }
        }
        setLoading(false);
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
        return setPickerOptions('Select your site', sites, 'siteName', 'id');
    }

    function setSiteRolePickers() {
        return setSiteRolePickerOptions(
            'Select your site role',
            Object.keys(SiteRoles),
            'textField',
            'apiEnumValue'
        );
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
                    onPress={() => handleExitFormPress(false)}
                />
                <Heading>{formTitle}</Heading>
                {userId && userModel.entityTrail ? (
                    <EntityStatus
                        entityName={'User'}
                        publisherId={getUserLastUpdatedId(userModel)}
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
                                pickerOptions={setSiteRolePickers()}
                                prompt={'Select your site role'}
                                style={styles.picker}
                            />
                        </View>
                    </>
                )}
                {showSites ? (
                    <View style={styles.pickerContainer}>
                        <EnhancedPicker
                            onChange={handleSiteChange}
                            currentRoleSelected={selectedSite}
                            pickerOptions={setSitePickerOptions()}
                            prompt={'Select your site'}
                            style={styles.picker}
                        />
                    </View>
                ) : null}

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
                            onPress={handleSaveUser}
                            disabled={buttonDisabled}
                        />
                        <StyledButton
                            title={'Delete'}
                            style={styles.saveAndDelete}
                            onPress={handleDeleteUser}
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
    handleExitFormPress: PropTypes.func.isRequired,
    userId: PropTypes.string,
};

UserForm.defaultProps = {
    userId: '',
};

export default UserForm;
