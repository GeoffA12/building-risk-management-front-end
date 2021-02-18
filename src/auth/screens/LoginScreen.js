import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import SecureStorage from 'react-native-secure-storage';
import Heading from '../../common/components/Heading';
import FormInput from '../../common/components/FormInput';
import StyledButton from '../../common/components/StyledButton';
import Error from '../../common/components/Error';
import AuthContainer from '../../users/components/AuthContainer';
import { navigationRoutes } from '../../config/NavConfig';
import { createAction } from '../../utils/CreateAction';
import AuthContext from '../contexts/AuthContext';
import Loading from '../../common/components/Loading';
import { DARK_BLUE } from '../../common/styles/Colors';
import { useNotifications } from '../../common/hooks/Notifications';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 15,
    },
    loginButton: {
        marginVertical: 12,
    },
    createAccountButton: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        marginTop: 5,
        backgroundColor: 'transparent',
    },
    createAccountText: {
        color: `${DARK_BLUE}`,
        fontSize: 14,
        fontWeight: '500',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    inputRow: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmationRow: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const LoginScreen = ({ navigation, route }) => {
    const {
        auth: { login },
        dispatch,
        userKey,
    } = useContext(AuthContext);

    const { showNotification } = useNotifications();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (route.params && route.params.isRegistered) {
            showNotification(
                'Registration successful!',
                'You may now login with your username and password.'
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route]);

    async function handleLoginPress() {
        let userResponse;
        setLoading(true);
        userResponse = await login(username, password);
        setLoading(false);
        if (!userResponse.data) {
            if (
                userResponse.error &&
                Object.keys(userResponse.error).length > 0
            ) {
                console.error(userResponse.error);
                setError(userResponse.error.message);
            } else {
                Alert.alert(
                    'Invalid Login',
                    'Invalid username or password was entered.',
                    [
                        {
                            text: 'OK',
                            style: 'default',
                        },
                    ]
                );
            }
        } else {
            let data = userResponse.data;
            const user = {
                id: data.id,
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                phone: data.phone,
                email: data.email,
                authToken: data.authToken,
                associatedSiteIds: data.associatedSiteIds,
                siteRole: data.siteRole,
            };
            await SecureStorage.setItem(userKey, JSON.stringify(user));
            dispatch(createAction('SET_USER', user));
        }
    }

    return (
        <AuthContainer>
            <View style={styles.confirmationRow}>
                <Heading>Login!</Heading>
            </View>
            <Error errorMessage={error} />
            <View style={styles.inputRow}>
                <FormInput
                    style={styles.input}
                    placeholder={'Username'}
                    onChangeText={setUsername}
                    value={username}
                />
            </View>
            <View style={styles.inputRow}>
                <FormInput
                    style={styles.input}
                    placeholder={'Password'}
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />
            </View>
            <View style={styles.inputRow}>
                <StyledButton
                    title={'Login'}
                    style={styles.loginButton}
                    onPress={handleLoginPress}
                />
            </View>
            <View style={styles.row}>
                <StyledButton
                    title={"Don't have an account? Create one here!"}
                    style={styles.createAccountButton}
                    textStyle={styles.createAccountText}
                    onPress={() =>
                        navigation.navigate(navigationRoutes.REGISTRATION)
                    }
                />
            </View>
            <Loading loading={loading} />
        </AuthContainer>
    );
};

export default LoginScreen;
