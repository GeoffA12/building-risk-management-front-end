import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
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
import { BASE_URL_GEOFF_LOCAL } from '../config/APIConfig';

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
    const [selectedSiteRole, setSelectedSiteRole] = useState('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState('0');

    useEffect(() => {
        loadAllSites();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadAllSites() {
        let allSites;
        setLoading(true);
        try {
            allSites = await axios.get(`${BASE_URL_GEOFF_LOCAL}/getAllSites`);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
        setSites(allSites.data);
    }

    function cancelIconPressHandler() {
        navigation.pop();
    }

    function handleSiteRoleChange(val) {
        if (val !== 0) {
            setSelectedSiteRole(val);
        }
    }

    function handleSiteChange(val) {
        if (val !== 0) {
            setSelectedSite(val);
        }
    }

    console.log(selectedSite);
    console.log(selectedSiteRole);

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

    async function handleRegisterPress() {
        try {
            setLoading(true);
            const response = await register(
                selectedSiteRole,
                firstName,
                lastName,
                email,
                phone,
                username,
                password,
                selectedSite
            );
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
                    currentRoleSelected={selectedSiteRole}
                    pickerOptions={setSiteRolePickerOptions()}
                    prompt={'Select your site role'}
                />
                {sites ? (
                    <EnhancedPicker
                        onChange={handleSiteChange}
                        currentRoleSelected={selectedSite}
                        pickerOptions={setSitePickerOptions()}
                        prompt={'Select your site'}
                    />
                ) : null}

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
