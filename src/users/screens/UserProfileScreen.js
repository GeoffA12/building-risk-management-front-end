import React, { useContext, useState, useEffect } from 'react';
import {
    Text,
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-ionicons';
import isEqual from 'lodash.isequal';
import { useAPI } from '../../common/hooks/API';
import Error from '../../common/components/Error';
import Loading from '../../common/components/Loading';
import AuthContext from '../../auth/contexts/AuthContext';
import FormInput from '../../common/components/FormInput';
import Confirmation from '../../common/components/Confirmation';
import StyledButton from '../../common/components/StyledButton';
import AuthenticatedSite from '../components/AuthenticatedSite';
import { useUser } from '../hooks/UserHooks';
import {
    DARK_BLUE,
    LIGHT_TEAL,
    DISABLED_BUTTON,
    LIGHT_GRAY,
} from '../../common/styles/Colors';
import SiteRoles from '../../config/SiteRolesConfig';

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 5,
        marginVertical: 5,
        flex: 1,
    },
    sectionContainer: {
        flex: 1,
        marginVertical: 5,
        marginHorizontal: 5,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        margin: 3,
    },
    cell: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
    },
    formInputCell: {
        flex: 3,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
    },
    titleText: {
        fontSize: 24,
        color: `${DARK_BLUE}`,
        fontWeight: '600',
        textAlign: 'center',
    },
    subTitleText: {
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        color: `${DARK_BLUE}`,
    },
    iconButton: {
        backgroundColor: `${DARK_BLUE}`,
        margin: 3,
        borderRadius: 10,
        flexDirection: 'row',
        padding: 5,
        width: '30%',
    },
    iconButtonText: {
        color: `${LIGHT_GRAY}`,
        fontSize: 16,
        paddingHorizontal: 12,
        paddingVertical: 3,
        flexDirection: 'row',
    },
    disabledIconButton: {
        backgroundColor: `${DISABLED_BUTTON}`,
        margin: 3,
        borderRadius: 10,
        flexDirection: 'row',
        padding: 5,
        width: '30%',
    },
    iconStyle: {
        color: `${LIGHT_GRAY}`,
        paddingVertical: 3,
        paddingHorizontal: 5,
    },
    formInput: {
        backgroundColor: `${DARK_BLUE}`,
        color: `${LIGHT_TEAL}`,
        margin: 3,
        flex: 1,
    },
    enterButton: {
        width: '45%',
        padding: 2,
    },
});

const UserProfileScreen = ({ navigation }) => {
    const { user } = useContext(AuthContext);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [oldPasswordAttempt, setOldPasswordAttempt] = useState('');
    const {
        getUserProfile,
        userModel,
        userModelPlayground,
        setUserModel,
        setUserModelPlayground,
        saveUser,
        authenticateUserPassword,
    } = useUser();
    const { error, setError, loading, setLoading } = useAPI();
    const [newPassword, setNewPassword] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const [
        authenticationErrorMessage,
        setAuthenticationErrorMessage,
    ] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(
        false
    );
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [confirmationTitle, setConfirmationTitle] = useState('');

    useEffect(() => {
        loadUserProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setUserModelPlayground({ ...userModel });
        setIsDirty(false);
        setShowNewPassword(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userModel]);

    useEffect(() => {
        if (
            !isEqual(userModelPlayground, userModel) ||
            newPassword.length > 0
        ) {
            setIsDirty(true);
        } else {
            setIsDirty(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userModelPlayground, newPassword]);

    async function loadUserProfile() {
        setLoading(true);
        const userProfileResponse = await getUserProfile(user.id);
        setLoading(false);
        if (!userProfileResponse.data) {
            console.error(userProfileResponse.error);
            setError(userProfileResponse.error.message);
        } else {
            setUserModel(userProfileResponse.data);
        }
    }

    async function handleSaveUserProfile() {
        if (isDirty) {
            let userPasswordInput = null;
            if (newPassword && newPassword.length > 0) {
                userPasswordInput = newPassword;
            }

            let updateUserInput = {
                id: userModelPlayground.id,
                userId: user.id,
                firstName: userModelPlayground.firstName,
                lastName: userModelPlayground.lastName,
                username: userModelPlayground.username,
                email: userModelPlayground.email,
                phone: userModelPlayground.phone,
                siteIds: userModelPlayground.associatedSiteIds,
                password: userPasswordInput,
            };

            setLoading(true);
            const userProfileResponse = await saveUser(
                userModelPlayground.associatedSiteIds,
                updateUserInput,
                userModelPlayground.siteRole
            );
            setLoading(false);
            if (!userProfileResponse.data) {
                console.error(userProfileResponse.error);
                setError(userProfileResponse.error.message);
            } else {
                setShowConfirmation(true);
                setConfirmationTitle('User profile saved!');
                setConfirmationMessage(
                    'Your user profile has been successfully saved.'
                );
                setUserModel(userProfileResponse.data);
            }
        }
    }

    async function validateUserPassword() {
        setLoading(true);
        const validateUserPasswordResponse = await authenticateUserPassword(
            user.id,
            oldPasswordAttempt
        );
        setLoading(false);
        if (Object.keys(validateUserPasswordResponse.error).length > 0) {
            console.error(validateUserPasswordResponse.error);
            setError(validateUserPasswordResponse.error.message);
        } else {
            const oldPasswordAuthenticated = validateUserPasswordResponse.data;
            if (oldPasswordAuthenticated) {
                setShowNewPassword(true);
                setOldPasswordAttempt('');
                setAuthenticationErrorMessage('');
                setShowPasswordConfirmation(true);
                setConfirmationMessage('You may now enter new password.');
                setConfirmationTitle('Old password confirmed.');
            } else {
                setAuthenticationErrorMessage('Wrong password.');
            }
        }
    }

    function handleUserModelPlaygroundChange(fieldKey, value) {
        setUserModelPlayground((prevPlayground) => {
            let updatedPlayground = { ...prevPlayground };
            updatedPlayground[fieldKey] = value;
            return updatedPlayground;
        });
    }

    function handleConfirmationClose() {
        if (showConfirmation === true) {
            setShowConfirmation((prevConfirmation) => {
                return !prevConfirmation;
            });
        } else if (showPasswordConfirmation === true) {
            setShowPasswordConfirmation((prevPasswordConfirmation) => {
                return !prevPasswordConfirmation;
            });
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Error errorMessage={error} />
            <View style={styles.sectionContainer}>
                {showConfirmation ? (
                    <Confirmation
                        title={confirmationTitle}
                        message={confirmationMessage}
                        handleConfirmationClose={handleConfirmationClose}
                    />
                ) : null}
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <TouchableOpacity
                            onPress={handleSaveUserProfile}
                            style={
                                isDirty
                                    ? styles.iconButton
                                    : styles.disabledIconButton
                            }
                            disabled={!isDirty}>
                            <Icon
                                name="save"
                                size={22}
                                style={styles.iconStyle}
                            />
                            <Text style={styles.iconButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text style={styles.titleText}>
                            Hi {userModelPlayground.username}!
                        </Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text style={styles.subTitleText}>
                            Role: {SiteRoles[user.siteRole].textField}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.sectionContainer}>
                <AuthenticatedSite associatedSiteIds={user.associatedSiteIds} />
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text>First name:</Text>
                    </View>
                    <View style={styles.formInputCell}>
                        <FormInput
                            style={styles.formInput}
                            placeholder={'First name'}
                            onChangeText={(val) =>
                                handleUserModelPlaygroundChange(
                                    'firstName',
                                    val
                                )
                            }
                            value={userModelPlayground.firstName}
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text>Last name:</Text>
                    </View>
                    <View style={styles.formInputCell}>
                        <FormInput
                            style={styles.formInput}
                            placeholder={'Last name'}
                            onChangeText={(val) =>
                                handleUserModelPlaygroundChange('lastName', val)
                            }
                            value={userModelPlayground.lastName}
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text>Email:</Text>
                    </View>
                    <View style={styles.formInputCell}>
                        <FormInput
                            style={styles.formInput}
                            placeholder={'Email'}
                            onChangeText={(val) =>
                                handleUserModelPlaygroundChange('email', val)
                            }
                            value={userModelPlayground.email}
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text>Username:</Text>
                    </View>
                    <View style={styles.formInputCell}>
                        <FormInput
                            style={styles.formInput}
                            placeholder={'Username'}
                            onChangeText={(val) =>
                                handleUserModelPlaygroundChange('username', val)
                            }
                            value={userModelPlayground.username}
                        />
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text>Phone:</Text>
                    </View>
                    <View style={styles.formInputCell}>
                        <FormInput
                            style={styles.formInput}
                            placeholder={'Phone'}
                            onChangeText={(val) =>
                                handleUserModelPlaygroundChange('phone', val)
                            }
                            value={userModelPlayground.phone}
                        />
                    </View>
                </View>
            </View>
            {showPasswordConfirmation ? (
                <Confirmation
                    title={confirmationTitle}
                    message={confirmationMessage}
                    handleConfirmationClose={handleConfirmationClose}
                />
            ) : null}
            <View style={styles.sectionContainer}>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text style={styles.subTitleText}>Change password</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text>Old password</Text>
                    </View>
                    <View style={styles.formInputCell}>
                        <FormInput
                            style={styles.formInput}
                            placeholder={'Password'}
                            placeholderTextColor={`${LIGHT_TEAL}`}
                            onChangeText={setOldPasswordAttempt}
                            value={oldPasswordAttempt}
                            secureTextEntry={true}
                        />
                    </View>
                </View>
                <Error errorMessage={authenticationErrorMessage} />
                {!showNewPassword ? (
                    <View style={styles.row}>
                        <View style={styles.cell}>
                            <StyledButton
                                title={'Enter'}
                                onPress={validateUserPassword}
                                disabled={false}
                                style={styles.enterButton}
                            />
                        </View>
                    </View>
                ) : null}
                {showNewPassword ? (
                    <View style={styles.row}>
                        <View style={styles.cell}>
                            <Text>New password</Text>
                        </View>
                        <View style={styles.formInputCell}>
                            <FormInput
                                style={styles.formInput}
                                placeholder={'New Password'}
                                placeholderTextColor={`${LIGHT_TEAL}`}
                                onChangeText={setNewPassword}
                                value={newPassword}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>
                ) : null}
            </View>
            <Loading isLoading={loading} />
        </ScrollView>
    );
};

export default UserProfileScreen;
