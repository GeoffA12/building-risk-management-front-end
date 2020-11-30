import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import Heading from '../components/Heading';
import FormInput from '../components/FormInput';
import StyledButton from '../components/StyledButton';
import TextButton from '../components/TextButton';
import Error from '../components/Error';
import AuthContainer from '../components/AuthContainer';
import { navigationRoutes } from '../config/NavConfig';
import AuthContext from '../contexts/AuthContext';
import Loading from '../components/Loading';

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
});

const LoginScreen = ({ navigation }) => {
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

    return (
        <AuthContainer>
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
            <TextButton
                title={"Don't have an account? Create one here!"}
                style={styles.loginButton}
                onPress={() =>
                    navigation.navigate(navigationRoutes.REGISTRATION)
                }
            />
            <Loading loading={loading} />
        </AuthContainer>
    );
};

export default LoginScreen;
