import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import Heading from '../../common/components/Heading';
import FormInput from '../../common/components/FormInput';
import StyledButton from '../../common/components/StyledButton';
import Error from '../../common/components/Error';
import AuthContainer from '../../users/components/AuthContainer';
import { navigationRoutes } from '../../config/NavConfig';
import AuthContext from '../contexts/AuthContext';
import Loading from '../../common/components/Loading';
import Confirmation from '../../common/components/Confirmation';
import { DARK_BLUE, DISABLED_BUTTON } from '../../common/styles/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 15,
    },
    input: {
        marginVertical: 12,
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
});

const LoginScreen = ({ navigation, route }) => {
    const {
        auth: { login },
    } = useContext(AuthContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    function checkRegistered() {
        const { isRegistered } = route.params;
        return isRegistered;
    }

    return (
        <AuthContainer>
            {route.params && checkRegistered() ? (
                <Confirmation
                    title={'Login successful!'}
                    message={'You may now login.'}
                    showConfirmation={true}
                />
            ) : null}
            <Heading>Login!</Heading>
            <Error errorMessage={error} />
            <FormInput
                style={styles.input}
                placeholder={'Username'}
                onChangeText={setUsername}
                value={username}
            />
            <FormInput
                style={styles.input}
                placeholder={'Password'}
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <StyledButton
                title={'Login'}
                style={styles.loginButton}
                onPress={handleLoginPress}
            />
            <StyledButton
                title={"Don't have an account? Create one here!"}
                style={styles.createAccountButton}
                textStyle={styles.createAccountText}
                onPress={() =>
                    navigation.navigate(navigationRoutes.REGISTRATION)
                }
            />
            <Loading loading={loading} />
        </AuthContainer>
    );
};

export default LoginScreen;
