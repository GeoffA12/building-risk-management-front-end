import React, { useEffect, useContext, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import AuthContext from '../../auth/contexts/AuthContext';
import Loading from '../../common/components/Loading';
import Error from '../../common/components/Error';
import BuildingRiskAssessment from '../components/BuildingRiskAssessment';
import SearchFilters from '../../common/components/SearchFilters';
import { useHeader } from '../../common/hooks/Header';
import { navigationRoutes } from '../../config/NavConfig';
import { useAPI } from '../../common/hooks/API';
import { useBuildingRiskAssessment } from '../hooks/BuildingRiskAssessmentHooks';
import { useBuilding } from '../hooks/BuildingHooks';
import { filterOptions } from '../config/FilterOptions';

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

const BuildingRiskAssessmentListScreen = ({ navigation, route }) => {
    const {
        auth: { logout },
        user,
    } = useContext(AuthContext);

    const { setListHeader } = useHeader();
    const {
        getBuildingRiskAssessments,
        getInitialPickerState,
    } = useBuildingRiskAssessment();
    const { getBuildingsByAssociatedSiteIds } = useBuilding();
    const { loading, setLoading, error, setError } = useAPI();

    const [buildingRiskAssessments, setBuildingRiskAssessments] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [authenticatedBuildings, setAuthenticatedBuildings] = useState([]);
    const [pickerOptions, setPickerOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState(
        filterOptions.INITIAL_VALUE.value
    );
    const [
        filteredBuildingRiskAssessments,
        setFilteredBuildingRiskAssessments,
    ] = useState([]);

    useEffect(() => {
        loadBuildingRiskAssessments();
        loadBuildings(user.associatedSiteIds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setListHeader(navigation, handleAddBuildingRiskAssessmentPress, logout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, logout]);

    useEffect(() => {
        if (route.params && route.params.refresh) {
            loadBuildingRiskAssessments();
            loadBuildings(user.associatedSiteIds);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route]);

    useEffect(() => {
        if (authenticatedBuildings.length > 0) {
            let pickers = getInitialPickerState();
            for (let x = 0; x < authenticatedBuildings.length; ++x) {
                let currentBuilding = authenticatedBuildings[x];
                pickers.push({
                    label: currentBuilding.name,
                    value: currentBuilding.id,
                });
            }
            setPickerOptions(pickers);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authenticatedBuildings]);

    useEffect(() => {
        setFilteredBuildingRiskAssessments(buildingRiskAssessments);
    }, [buildingRiskAssessments]);

    useEffect(() => {
        setFilteredBuildingRiskAssessments(() => {
            return buildingRiskAssessments.filter((buildingRiskAssessment) => {
                return buildingRiskAssessment.title.includes(searchText);
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);

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

    async function handleRefresh() {
        setRefreshing(true);
        await loadBuildingRiskAssessments();
        setRefreshing(false);
    }

    async function loadBuildings(associatedSiteIds) {
        setLoading(true);
        const buildingsAtSiteResponse = await getBuildingsByAssociatedSiteIds(
            associatedSiteIds
        );
        setLoading(false);
        if (!buildingsAtSiteResponse.data) {
            console.error(buildingsAtSiteResponse.error);
            setError(buildingsAtSiteResponse.error.message);
        } else {
            console.log(buildingsAtSiteResponse);
            setAuthenticatedBuildings(buildingsAtSiteResponse.data);
        }
    }

    function handleAddBuildingRiskAssessmentPress() {
        navigation.navigate(navigationRoutes.BUILDINGRISKASSESSMENTEDITOR, {
            buildingRiskAssessmentId: undefined,
            riskAssessmentSchedule: undefined,
        });
    }

    function handleFilterChange(val) {
        console.log(val);
        if (
            val === filterOptions.INITIAL_VALUE.value ||
            val === filterOptions.ALL_BUILDING_ASSESSMENTS.value
        ) {
            setFilteredBuildingRiskAssessments(buildingRiskAssessments);
        } else if (val === filterOptions.MY_BUILDING_ASSESSMENTS.value) {
            let filteredBuildingAssessments = [];
            for (let x = 0; x < buildingRiskAssessments.length; ++x) {
                const currentAssessment = buildingRiskAssessments[x];
                const createdEntityTrail = currentAssessment.entityTrail[0];
                const publisherId = createdEntityTrail.userId;
                const userIdOfUserLoggedIn = user.id;
                if (publisherId === userIdOfUserLoggedIn) {
                    filteredBuildingAssessments.push(currentAssessment);
                }
            }
            setFilteredBuildingRiskAssessments(filteredBuildingAssessments);
        } else {
            let filteredBuildingAssessments = buildingRiskAssessments.filter(
                (buildingRiskAssessment) => {
                    return buildingRiskAssessment.buildingId === val;
                }
            );
            setFilteredBuildingRiskAssessments(filteredBuildingAssessments);
        }
        setSelectedValue(val);
    }

    function handleBuildingRiskAssessmentCardPress(event) {
        navigation.navigate(navigationRoutes.BUILDINGRISKASSESSMENTEDITOR, {
            buildingRiskAssessmentId: event.id,
        });
    }

    function getPickers() {
        return pickerOptions;
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
            <SearchFilters
                searchText={searchText}
                handleSearchTextChange={setSearchText}
                placeholder={'Title..'}
                handleFilterChange={handleFilterChange}
                selectedFilterValue={selectedValue}
                setPickerCallback={getPickers}
            />
            <FlatList
                data={filteredBuildingRiskAssessments}
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
