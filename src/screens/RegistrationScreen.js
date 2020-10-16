import React, { useContext, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Heading from '../components/Heading';
import FormInput from '../components/FormInput';
import StyledButton from '../components/StyledButton';
import IconButton from '../components/IconButton';
import Error from '../components/Error';
import AuthContainer from '../components/AuthContainer';
import AuthContext from '../contexts/AuthContext';
import EnhancedPicker from '../components/EnhancedPicker';
import Loading from '../components/Loading';
import { SiteRoles } from '../config/SiteRolesConfig';

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
});

const RegistrationScreen = ({ navigation }) => {
    const { register } = useContext(AuthContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [siteRole, setSiteRole] = useState('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    function cancelIconPressHandler() {
        navigation.pop();
    }

    function handleSiteRoleChange(val) {
        console.log(val);
        if (val !== 0) {
            setSiteRole(val);
        }
    }

    function setPickerOptions() {
        const siteRoles = Object.keys(SiteRoles);
        let pickerOptions = [];
        pickerOptions.push({
            label: 'Please select your site role',
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

    async function handleRegisterPress() {
        console.log('Register was pressed.');
        try {
            setLoading(true);
            const response = await register(
                siteRole,
                firstName,
                lastName,
                email,
                phone,
                username,
                password
            );
            console.log('Response data was: ', response.data);
            navigation.pop();
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
        setLoading(false);
    }

    return (
        <ScrollView>
            <AuthContainer>
                <IconButton
                    name={'close-circle'}
                    style={styles.closeIcon}
                    iconSize={30}
                    onPress={cancelIconPressHandler}
                />
                <Heading>Sign up!</Heading>
                <Error errorMessage={error} />
                <FormInput
                    style={styles.input}
                    placeholder={'First name'}
                    onChangeText={setFirstName}
                    value={firstName}
                />
                <FormInput
                    style={styles.input}
                    placeholder={'Last name'}
                    onChangeText={setLastName}
                    value={lastName}
                />
                <FormInput
                    style={styles.input}
                    placeholder={'Email'}
                    keyboardType={'email-address'}
                    onChangeText={setEmail}
                    value={email}
                />
                <FormInput
                    style={styles.input}
                    placeholder={'Phone'}
                    keyboardType={'phone-pad'}
                    onChangeText={setPhone}
                    value={phone}
                />
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
                <EnhancedPicker
                    onChange={handleSiteRoleChange}
                    currentRoleSelected={siteRole}
                    pickerOptions={setPickerOptions()}
                />
                <StyledButton
                    title={'Sign up'}
                    style={styles.registrationButton}
                    onPress={handleRegisterPress}
                />
                <Loading loading={loading} />
            </AuthContainer>
        </ScrollView>
    );
};

export default RegistrationScreen;
