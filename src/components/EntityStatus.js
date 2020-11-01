import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import axios from 'axios';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { DARK_BLUE, LIGHT_TEAL } from '../styles/Colors';
import { BASE_URL } from '../config/APIConfig';

const styles = StyleSheet.create({
    entityStatusContainer: {
        backgroundColor: `${DARK_BLUE}`,
        margin: 2,
        width: 340,
        height: 100,
        borderRadius: 8,
        padding: 8,
    },
    titleText: {
        fontSize: 17,
        fontWeight: '700',
        color: `${LIGHT_TEAL}`,
        textAlign: 'center',
    },
    detailsText: {
        fontSize: 16,
        fontWeight: '600',
        color: `${LIGHT_TEAL}`,
        textAlign: 'center',
    },
});

const EntityStatus = ({ entityName, publisherId, updatedAt }) => {
    const [publisher, setPublisher] = useState(null);
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getPublisher();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getPublisher() {
        let publisherResponse;
        try {
            setLoading(true);
            publisherResponse = await axios.get(
                `${BASE_URL}/getUserById?id=${publisherId}`
            );
        } catch (e) {
            console.error(e.message);
            setError(e.message);
            setLoading(false);
        }
        setError('');
        setLoading(false);
        const publisherData = publisherResponse.data;
        setPublisher(publisherData);
        let formattedDate = new Date(updatedAt);
        setDate(formattedDate.toString());
    }

    return (
        <View style={styles.entityStatusContainer}>
            <Text style={styles.titleText}>{entityName} status:</Text>
            {publisher ? (
                <>
                    <Text style={styles.detailsText}>
                        Updated by: {publisher.firstName} {publisher.lastName}
                    </Text>
                    <Text style={styles.detailsText}>Updated at: {date}</Text>
                </>
            ) : null}
        </View>
    );
};

export default EntityStatus;
