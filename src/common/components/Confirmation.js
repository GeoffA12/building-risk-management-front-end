import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import PropTypes from 'prop-types';
import { CONFIRMATION_GREEN } from '../styles/Colors';
import IconButton from './IconButton';

const styles = StyleSheet.create({
    containerStyle: {
        borderRadius: 4,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: `${CONFIRMATION_GREEN}`,
        width: 300,
    },
    wrapperStyle: {
        padding: 1,
        margin: 1,
    },
    cardMessageText: {
        fontSize: 13,
        fontWeight: '500',
        color: 'black',
        textAlign: 'center',
    },
    cardTitleText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
        textAlign: 'center',
    },
    iconStyle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const Confirmation = ({ title, message, showConfirmation }) => {
    const [toggleConfirmation, setToggleConfirmation] = useState(
        showConfirmation
    );

    function handleConfirmationClose() {
        setToggleConfirmation((prevToggleConfirmation) => {
            return !prevToggleConfirmation;
        });
    }

    return toggleConfirmation ? (
        <Card
            containerStyle={styles.containerStyle}
            wrapperStyle={styles.wrapperStyle}>
            <Card.Title style={styles.cardTitleText}>{title}</Card.Title>
            <Card.Divider />
            <Card.FeaturedSubtitle style={styles.cardMessageText}>
                {message}
            </Card.FeaturedSubtitle>

            <IconButton
                onPress={handleConfirmationClose}
                name={'close-circle'}
                style={styles.iconStyle}
                iconSize={25}
            />
        </Card>
    ) : null;
};

Confirmation.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    showConfirmation: PropTypes.bool.isRequired,
};

export default Confirmation;
