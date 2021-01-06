import React from 'react';
import UserForm from '../../users/components/UserForm';
import { navigationRoutes } from '../../config/NavConfig';

const RegistrationScreen = ({ navigation, onCancelPress }) => {
    function handleExitFormPress(isRegistered) {
        navigation.navigate(navigationRoutes.LOGIN, {
            isRegistered: isRegistered,
        });
    }

    return (
        <>
            <UserForm
                navigation={navigation}
                formTitle={'Sign up!'}
                handleExitFormPress={handleExitFormPress}
            />
        </>
    );
};

export default RegistrationScreen;
