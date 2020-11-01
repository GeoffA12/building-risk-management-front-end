import React from 'react';
import UserForm from '../forms/UserForm';

const RegistrationScreen = ({ navigation, onCancelPress }) => {
    function onCancelPress() {
        navigation.pop();
    }

    return (
        <>
            <UserForm
                navigation={navigation}
                formTitle={'Sign up!'}
                leaveFormPress={onCancelPress}
            />
        </>
    );
};

export default RegistrationScreen;
