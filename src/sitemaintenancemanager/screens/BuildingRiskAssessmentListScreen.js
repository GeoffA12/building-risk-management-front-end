import React, { useEffect, useContext, useState } from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import AuthContext from '../../contexts/AuthContext';
import Loading from '../../components/Loading';
import BuildingRiskAssessment from '../components/BuildingRiskAssessment';
import HeaderButton from '../../components/HeaderButton';
import { navigationRoutes } from '../../config/NavConfig';
import { BASE_URL } from '../../config/APIConfig';

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    pageContainer: {
        flex: 1,
        marginVertical: 6,
        marginHorizontal: 6,
        padding: 3,
    },
});

const BuildingRiskAssessmentListScreen = ({ navigation }) => {
    const {
        auth: { logout },
        user,
    } = useContext(AuthContext);

    const [buildingRiskAssessments, setBuildingRiskAssessments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getBuildingRiskAssessments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleAddBuildingRiskAssessmentPress() {
        navigation.navigate(navigationRoutes.BUILDINGRISKASSESSMENTEDITOR, {
            buildingRiskAssessmentId: undefined,
            riskAssessmentId: undefined,
        });
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerContainer}>
                    <HeaderButton
                        name={'add'}
                        onPress={handleAddBuildingRiskAssessmentPress}
                    />
                    <HeaderButton name={'exit'} onPress={() => logout()} />
                </View>
            ),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, logout]);

    async function getBuildingRiskAssessments() {
        let response;
        setLoading(true);
        try {
            response = await axios.post(
                `${BASE_URL}/getBuildingRiskAssessmentsBySite`,
                {
                    associatedSiteIds: user.associatedSiteIds,
                }
            );
            if (error) {
                setError('');
            }
        } catch (e) {
            console.error(e);
            setError(e.message);
            setLoading(false);
            return;
        }
        setLoading(false);
        setBuildingRiskAssessments(response.data);
    }

    function handleBuildingRiskAssessmentCardPress(event) {
        console.log(event);
        navigation.navigate(navigationRoutes.BUILDINGRISKASSESSMENTEDITOR, {
            buildingRiskAssessmentId: event.id,
            riskAssessmentId: event.riskAssessmentIds[0],
        });
    }

    function handleRefresh() {
        setRefreshing(true);
        getBuildingRiskAssessments();
        setRefreshing(false);
    }

    function renderBuildingRiskAssessment({
        item: existingBuildingRiskAssessment,
    }) {
        return (
            <BuildingRiskAssessment
                entity={existingBuildingRiskAssessment}
                onPress={handleBuildingRiskAssessmentCardPress}
            />
        );
    }

    return (
        <View style={styles.pageContainer}>
            <FlatList
                data={buildingRiskAssessments}
                renderItem={renderBuildingRiskAssessment}
                keyExtractor={(buildingRiskAssessmentInList) =>
                    buildingRiskAssessmentInList.id
                }
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
            <Loading loading={loading} />
        </View>
    );
};

export default BuildingRiskAssessmentListScreen;
