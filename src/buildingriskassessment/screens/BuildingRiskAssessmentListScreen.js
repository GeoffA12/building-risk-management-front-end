import React, { useEffect, useContext, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import AuthContext from '../../auth/contexts/AuthContext';
import Loading from '../../common/components/Loading';
import Error from '../../common/components/Error';
import BuildingRiskAssessment from '../components/BuildingRiskAssessment';
import { useHeader } from '../../common/hooks/Header';
import { navigationRoutes } from '../../config/NavConfig';
import { useAPI } from '../../common/hooks/API';
import { useBuildingRiskAssessment } from '../hooks/BuildingRiskAssessmentHooks';

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

    const { setListHeader } = useHeader();
    const { getBuildingRiskAssessments } = useBuildingRiskAssessment();
    const { loading, setLoading, error, setError } = useAPI();

    const [buildingRiskAssessments, setBuildingRiskAssessments] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadBuildingRiskAssessments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleAddBuildingRiskAssessmentPress() {
        navigation.navigate(navigationRoutes.BUILDINGRISKASSESSMENTEDITOR, {
            buildingRiskAssessmentId: undefined,
            riskAssessmentSchedule: undefined,
        });
    }

    useEffect(() => {
        setListHeader(navigation, handleAddBuildingRiskAssessmentPress, logout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, logout]);

    async function loadBuildingRiskAssessments() {
        setLoading(true);
        const buildingRiskAssessmentsResponse = await getBuildingRiskAssessments(
            user.associatedSiteIds
        );
        setLoading(false);
        if (!buildingRiskAssessmentsResponse.data) {
            setError(buildingRiskAssessmentsResponse.error.message);
            console.error(buildingRiskAssessmentsResponse.error);
        } else {
            setBuildingRiskAssessments(buildingRiskAssessmentsResponse.data);
        }
    }

    function handleBuildingRiskAssessmentCardPress(event) {
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
            <Error errorMessage={error} />
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
