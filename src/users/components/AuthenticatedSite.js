import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-ionicons';
import Loading from '../../common/components/Loading';
import Error from '../../common/components/Error';
import { useAPI } from '../../common/hooks/API';
import { useUser } from '../hooks/UserHooks';
import { DARK_BLUE, LIGHT_TEAL } from '../../common/styles/Colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 3,
    },
    messageText: {
        fontSize: 21,
        fontWeight: '600',
        margin: 3,
        padding: 2,
        color: `${DARK_BLUE}`,
    },
    icon: {
        paddingHorizontal: 6,
        margin: 4,
        color: `${LIGHT_TEAL}`,
    },
    siteText: {
        fontSize: 17,
        fontWeight: '500',
        color: `${DARK_BLUE}`,
    },
});

const AuthenticatedSite = ({ associatedSiteIds }) => {
    const [userSites, setUserSites] = useState([]);
    const { error, setError, loading, setLoading } = useAPI();
    const { getUserSites } = useUser();

    useEffect(() => {
        if (associatedSiteIds && associatedSiteIds.length > 0) {
            loadUserSites();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadUserSites() {
        setLoading(true);
        const userSitesResponse = await getUserSites(associatedSiteIds);
        setLoading(false);
        if (!userSitesResponse.data) {
            console.error(userSitesResponse.error);
            setError(userSitesResponse.error.message);
        } else {
            setUserSites(userSitesResponse.data);
        }
    }

    function renderUserSites() {
        if (userSites.length > 0) {
            return userSites.map((userSite) => {
                return (
                    <View style={styles.row} key={userSite.id}>
                        <Icon
                            name="arrow-forward"
                            size={23}
                            style={styles.icon}
                        />
                        <Text style={styles.siteText}>{userSite.siteName}</Text>
                    </View>
                );
            });
        }
    }

    return (
        <View style={styles.container}>
            <Error errorMessage={error} />
            <Text style={styles.messageText}>Sites you're reigstered at:</Text>
            {renderUserSites()}
            <Loading loading={loading} />
        </View>
    );
};

export default AuthenticatedSite;
