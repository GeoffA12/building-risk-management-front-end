import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import Heading from '../../common/components/Heading';
import FormInput from '../../common/components/FormInput';
import StyledButton from '../../common/components/StyledButton';
import Error from '../../common/components/Error';
import AuthContainer from '../../users/components/AuthContainer';
import { navigationRoutes } from '../../config/NavConfig';
import AuthContext from '../contexts/AuthContext';
import Loading from '../../common/components/Loading';
import Confirmation from '../../common/components/Confirmation';
import { DARK_BLUE } from '../../common/styles/Colors';
import { Platform } from 'react-native';

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
    } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        if (route.params && route.params.isRegistered) {
            setShowConfirmation(true);
        }
    }, [route]);

    async function handleLoginPress() {
        try {
            setLoading(true);
            await login(username, password);
        } catch (e) {
            console.error(e);
            setError(e.message);
            setLoading(false);
            return;
        }
    }

    function handleConfirmationClose() {
        if (showConfirmation === true) {
            setShowConfirmation((prevShowConfirmation) => {
                return !prevShowConfirmation;
            });
        }
    }

    return (
        <AuthContainer>
            {showConfirmation ? (
                <View style={styles.confirmationRow}>
                    <Confirmation
                        title="Successfully registered!"
                        message="You may now login."
                        handleConfirmationClose={handleConfirmationClose}
                    />
                </View>
            ) : null}
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
